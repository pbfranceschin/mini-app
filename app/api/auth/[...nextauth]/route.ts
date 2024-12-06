import NextAuth, { NextAuthOptions } from "next-auth";

console.log("process.env.NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
console.log("process.env.WLD_CLIENT_ID", process.env.WLD_CLIENT_ID);
console.log("process.env.WLD_CLIENT_SECRET", process.env.WLD_CLIENT_SECRET);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("nextauth url", process.env.NEXTAUTH_URL);
const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      // authorization: { params: { scope: "openid" } },
      authorization: { 
        params: { 
          scope: "openid",
          response_type: "code",
        } 
      },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("signIn", user);
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };