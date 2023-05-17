import { createServerSideHelpers } from '@trpc/react-query/server';
import { type GetServerSideProps, type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import superjson from 'superjson';

import { Page404 } from '~/components/404';
import { Feed } from '~/components/feed';
import { PageTemplate } from '~/components/page-template';
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

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <PageTemplate>
                {data && (
                    <div>
                        <div className="border-b border-yellow-200 bg-yellow-600">
                            <Image
                                src={data.profileImageUrl}
                                alt={`${data.username ?? ''}`}
                                width={48}
                                height={48}
                                className="rounded-full"
                            ></Image>
                            {data.username}
                        </div>
                        <Feed />
                    </div>
                )}
                {!data && <Page404 />}
            </PageTemplate>
        </>
    );
};

export default ProfilePage;
