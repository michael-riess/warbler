import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

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
