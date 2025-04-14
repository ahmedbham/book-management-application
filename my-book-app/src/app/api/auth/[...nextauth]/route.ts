import NextAuth, { AuthOptions, Session, Account } from "next-auth"
import { JWT } from "next-auth/jwt" // Import JWT type
import AzureADProvider from "next-auth/providers/azure-ad";

// Define custom types for session and token if extending them
interface ExtendedToken extends JWT {
  accessToken?: string;
  userId?: string;
  roles?: string[];
}

interface ExtendedSession extends Session {
  accessToken?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[]; // Add roles if needed
  }
}


export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string, // Assert as string
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string, // Assert as string
      tenantId: process.env.AZURE_AD_TENANT_ID as string, // Assert as string
      // Optional: Define profile information or scopes if needed
      // authorization: { params: { scope: "openid profile email User.Read" } },
    }),
    // ...add more providers here if needed (Google, Facebook via Entra ID B2C/External ID)
    // Note: For B2C/External ID, the configuration might differ slightly.
    // You might use the generic OIDC provider or specific settings for B2C.
  ],
  // Optional: Add callbacks for customizing behavior (e.g., modifying session data)
  callbacks: {
    async jwt({ token, account }: { token: JWT, account?: Account | null }): Promise<JWT> {
      const extendedToken = token as ExtendedToken;
      // Persist the access_token and user roles/groups from the account object to the token right after signin
      if (account) {
        extendedToken.accessToken = account.access_token;
        // Example: Add user's object ID or roles if available in profile/account
        // The exact property names depend on the claims returned by Azure AD
        // Check the 'profile' object structure during debugging if needed
        // extendedToken.userId = profile?.oid; // Example: Object ID from Azure AD
        // extendedToken.roles = profile?.roles; // Example: App Roles assigned in Entra ID
      }
      return extendedToken; // Return the potentially extended token
    },
    async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
       const extendedSession = session as ExtendedSession;
       const extendedToken = token as ExtendedToken;
      // Send properties to the client, like an access_token and user id from the token
      extendedSession.accessToken = extendedToken.accessToken;
      if (extendedSession.user) {
          // extendedSession.user.id = extendedToken.userId; // Example
          // extendedSession.user.roles = extendedToken.roles; // Example
      }
      return extendedSession; // Return the potentially extended session
    }
  },
  // Optional: Add custom pages if needed
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // }
  secret: process.env.NEXTAUTH_SECRET, // Ensure this matches .env.local
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }