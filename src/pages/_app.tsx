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
  <header
    style={{ display: "flex", justifyContent: "space-between", padding: 20 }}
  >
    <h1>My App</h1>
    <SignedIn>
      {/* Mount the UserButton component */}
      <UserButton />
    </SignedIn>
    <SignedOut>
      {/* Signed out users get sign in button */}
      <SignInButton />
    </SignedOut>
  </header>
);

const MyApp: AppType = ({ Component, pageProps }) => (
  <ClerkProvider {...pageProps}>
    <Header />
    <Component {...pageProps} />
  </ClerkProvider>
);

export default api.withTRPC(MyApp);
