import { useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';
import Head from 'next/head';

import { PageTemplate } from '~/components/page-template';

const Home: NextPage = () => {
    const { isSignedIn, isLoaded: isUserLoaded } = useUser();
    if (!isUserLoaded) return <div />;

    return (
        <>
            <Head>
                <title>Post</title>
            </Head>
            <PageTemplate>
                <div className="w-full rounded-md border-x border-yellow-200 md:max-w-2xl">
                    Post View
                </div>
            </PageTemplate>
        </>
    );
};

export default Home;
