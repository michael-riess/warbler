import { useUser } from '@clerk/nextjs';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { type GetServerSideProps, type NextPage } from 'next';
import Head from 'next/head';
import superjson from 'superjson';

import { PageTemplate } from '~/components/page-template';
import { Page404 } from '~/pages/404';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';

/**
 * Fetches data ahead of time and hyrdates through server-side props.
 * This allows for the data to exist when the page loads.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, session: { authUserId: null } },
        transformer: superjson,
    });

    const id = context.params?.id;

    if (typeof id !== 'string') throw new Error('NO ID');

    await helpers.post.getById.fetch({ id });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

const PostPage: NextPage<{ id: string }> = ({ id }) => {
    const { data } = api.post.getById.useQuery({ id });
    if (!data) return <Page404 />;

    return (
        <>
            <Head>
                <title>{`${data.post.content} - ${data.author.username}`}</title>
            </Head>
            <PageTemplate>
                <div className="w-full rounded-md border-x border-yellow-200 md:max-w-2xl">
                    Post View
                </div>
            </PageTemplate>
        </>
    );
};

export default PostPage;
