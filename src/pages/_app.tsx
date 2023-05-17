import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '~/styles/globals.css';
import { api } from '~/utils/api';

const Header = () => (
    <header className="flex justify-center">
        <div className="h-16 flex w-full items-center justify-between md:max-w-2xl">
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
        <Header />
        <Component {...pageProps} />
    </ClerkProvider>
);

export default api.withTRPC(MyApp);
