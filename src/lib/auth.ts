import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";

export const config: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
  providers: [
    // Ways to login
    Credentials({
      // Email and password provider
      async authorize(credentials) {
        // Runs on logic
        const { email, password } = credentials;

        // Is there a user in the database with that email
        const user = await getUserByEmail(email as string);
        if (!user) {
          console.log("No user found");
          return null;
        }

        // Is the password correct
        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        console.log("User found and password correct");
        console.log(user);
        return user;
      },
    }),
  ],
  callbacks: {
    // Runs on each request
    authorized: ({ auth, request }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }
      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }
      return false;
    },
    // To attach more information to the token (available on the server)
    jwt: async ({ token, user }) => {
      if (user && typeof user.id === "string") {
        // On sign in
        token.userId = user.id;
      }
      return token;
    },
    // To attach more information to the session (available to the client)
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
    redirect: ({ url, baseUrl }) => {
      console.log("Redirect - Url:     ", url);
      console.log("Redirect - BaseUrl: ", baseUrl);

      if (url === "/login") {
        return url;
      }

      // For other actions, such as sign-in, handle callbackUrl logic
      const callbackUrl = new URL(url).searchParams.get("callbackUrl");

      // Allow the callbackUrl if it's from the same origin (security best practice)
      if (callbackUrl && callbackUrl.startsWith(baseUrl)) {
        return callbackUrl; // Redirect to the callbackUrl
      }

      // Default redirect behavior
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
