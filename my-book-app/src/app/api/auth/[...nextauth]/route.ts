import NextAuth, { AuthOptions, Session, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";

// Use the augmented Profile type from next-auth module augmentation

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      // Optional: Define profile information or scopes if needed
      // Ensure you request roles scope if needed from Azure AD
      // authorization: { params: { scope: "openid profile email User.Read roles" } },
    }),
    // ...add more providers here
  ],
  callbacks: {
    // Use the augmented Profile type directly in the signature
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account?: Account | null;
      profile?: Profile;
    }): Promise<JWT> {
      // Persist the access_token and user roles/groups from the account object to the token right after signin
      if (account && profile) {
        token.accessToken = account.access_token;
        // Now profile.roles should be recognized due to module augmentation
        token.roles = profile?.roles;
        // token.userId = profile?.oid; // Example if you added oid to Profile augmentation
      }
      return token; // Return the augmented token
    },
    // Use the augmented Session type directly in the signature
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      // Send properties to the client, like an access_token and roles from the token
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.roles = token.roles;
        // session.user.id = token.userId; // Example if you added userId to JWT augmentation
      }
      return session; // Return the augmented session
    },
  },
  // Optional: Add custom pages if needed
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this matches .env.local
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
