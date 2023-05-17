import { type NextPage } from 'next';
import Head from 'next/head';

import { PageTemplate } from '~/components/page-template';

export const Page404: NextPage = () => {
    return (
        <>
            <Head>
                <title>404</title>
            </Head>
            <PageTemplate>
                <div className="flex flex-col w-full gap-12 items-left justify-center">
                    <span className="text-7xl">YIKES!</span>
                    <span className="text-5xl">
                        Either you screwed up or we did 🤷
                    </span>
                    <span className="text-5xl">404</span>
                </div>
            </PageTemplate>
        </>
    );
};
