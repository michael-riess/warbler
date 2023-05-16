import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { type AppType } from 'next/app';

import '~/styles/globals.css';
import { api } from '~/utils/api';

const Header = () => (
    <header className="flex justify-center">
        <div className="flex w-full items-center justify-between p-5 md:max-w-2xl">
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
        <Header />
        <Component {...pageProps} />
    </ClerkProvider>
);

export default api.withTRPC(MyApp);
