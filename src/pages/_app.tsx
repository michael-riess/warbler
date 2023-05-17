import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { type AppType } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '~/styles/globals.css';
import { api } from '~/utils/api';

const HeaderNav = () => (
    <header className="flex justify-center">
        <div className="h-16 flex w-full items-center justify-between md:max-w-xl">
            <h1>Warbler</h1>
            <SignedIn>
                {/* Mount the UserButton component */}
                <UserButton />
            </SignedIn>
            <SignedOut>
                {/* Signed out users get sign in button */}
                <SignInButton />
            </SignedOut>
        </div>
    </header>
);

const SideNav = () => {
    return (
        <header>
            <div className="h-16 flex flex-col w-full items-center justify-between md:max-w-xl mt-4">
                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                // Hide circle avatar & replace with text button
                                userButtonAvatarBox: 'hidden',
                                userButtonTrigger:
                                    'before:content-["Settings"] focus:shadow-none',
                            },
                        }}
                    />
                    <Link href={`/`}>
                        <span>Explore</span>
                    </Link>
                </SignedIn>
                <SignedOut>
                    {/* Signed out users get sign in button */}
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    );
};

const MyApp: AppType = ({ Component, pageProps }) => (
    <ClerkProvider {...pageProps}>
        <Head>
            <title>Warbler</title>
            <meta name="description" content="A place for birders by birders" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        <div className="block sm:hidden">
            <HeaderNav />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-7 lg:grid-cols-12">
            <div className="hidden sm:block col-start-1 lg:col-start-2">
                <SideNav />
            </div>

            <div className="col-span-1 sm:col-span-5 lg:col-span-8">
                <Component {...pageProps} />
            </div>

            <div className="">{/* TODO: Add search & widgets */}</div>
        </div>
    </ClerkProvider>
);

export default api.withTRPC(MyApp);
