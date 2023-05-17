import { createServerSideHelpers } from '@trpc/react-query/server';
import { TRPCError } from '@trpc/server';
import { type GetServerSideProps, type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import superjson from 'superjson';

import { Feed } from '~/components/feed';
import { PageTemplate } from '~/components/page-template';
import { Page404 } from '~/pages/404';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';
import { getUserAtTag } from '~/utils/user';

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

    const slug = context.params?.slug;

    if (typeof slug !== 'string') throw new Error('NO SLUG');

    const username = slug.replace('@', '');

    await helpers.profile.getUserByUsername.prefetch({ username });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username,
        },
    };
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
    // This query will be immediately available as it's prefetched. i.e. `{ isLoading }` will always be false.
    const { data } = api.profile.getUserByUsername.useQuery({
        username,
    });

    if (!data) return <Page404 />;

    return (
        <>
            <Head>
                <title>{`${data.username}`}</title>
            </Head>
            <PageTemplate>
                <div>
                    <div className="h-48 flex relative flex-col border-yellow-200">
                        <div className="bg-yellow-600 h-full"></div>
                        <div className="h-full relative">
                            <div className="mt-12 p-3">
                                <div>{getUserAtTag(data)}</div>
                            </div>
                        </div>
                        <Image
                            src={data.profileImageUrl}
                            alt={`${data.username}`}
                            width={96}
                            height={96}
                            className="border-4 border-blue-950 rounded-full absolute bottom-1/2 top-1/2 m-auto left-3"
                        ></Image>
                    </div>
                    <Feed authorId={data.id} />
                </div>
            </PageTemplate>
        </>
    );
};

export default ProfilePage;
