import { type User, clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '~/server/api/trpc';

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
                    message: 'Author of post not found',
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
            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                },
            });
            return post;
        }),
});
