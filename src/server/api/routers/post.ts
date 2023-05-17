import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
// for deno: see above
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import { type DisplayableAuthor } from '~/interfaces/user';
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import { filterUserPropsForClient } from '~/server/utils/user';

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: '@upstash/ratelimit',
});

export const postRouter = createTRPCRouter({
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: { id: input.id },
            });
            if (!post)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Post does not exist.',
                });
            // wish there was a way to do this with a single query
            const [author] = (
                await clerkClient.users.getUserList({
                    userId: [post.authorId],
                })
            ).map(filterUserPropsForClient);

            return {
                post,
                author: author as DisplayableAuthor,
            };
        }),

    getAll: publicProcedure
        .input(
            z
                .object({
                    authorId: z.string().nullish(), // allow filtering by specific author e.g. profile page feed
                })
                .nullish()
        )
        .query(async ({ ctx, input }) => {
            const authorId = input?.authorId;
            const posts = await ctx.prisma.post.findMany({
                take: 100,
                orderBy: {
                    createdAt: 'desc',
                },
                where:
                    authorId != null
                        ? {
                              authorId: authorId,
                          }
                        : undefined,
            });

            // wish there was a way to do this with a single query
            const users = (
                await clerkClient.users.getUserList({
                    userId:
                        authorId != null
                            ? [authorId]
                            : posts.map((post) => post.authorId),
                })
            ).map(filterUserPropsForClient);

            return posts.map((post) => {
                const author =
                    authorId != null
                        ? users[0]
                        : users.find((user) => user.id === post.authorId);
                if (!author?.username) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Author of post not found.',
                    });
                }

                return {
                    post,
                    author: author as DisplayableAuthor,
                };
            });
        }),

    create: privateProcedure
        .input(
            z.object({
                content: z
                    .string()
                    .min(1, '🤏 That post is too short.')
                    .max(255, '😵 That post is too long.'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.session.authUserId;
            const { success } = await ratelimit.limit(authorId);
            if (!success)
                throw new TRPCError({
                    code: 'TOO_MANY_REQUESTS',
                    message:
                        'Request limit has been reached. Please try again later.',
                });

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                },
            });
            return post;
        }),
});
