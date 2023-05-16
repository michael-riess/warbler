import { type User, clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
// for deno: see above
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '~/server/api/trpc';

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

type DisplayableAuthor = Pick<User, 'id' | 'profileImageUrl'> & {
    username: string;
};

const filterUserPropsForClient = (user: User) => ({
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
});

export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map((post) => post.authorId),
            })
        ).map(filterUserPropsForClient);

        return posts.map((post) => {
            const author = users.find((user) => user.id === post.authorId);
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
                content: z.string().min(1).max(255),
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
