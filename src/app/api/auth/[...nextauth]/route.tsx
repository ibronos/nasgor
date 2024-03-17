import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [

    CredentialsProvider({

      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },

      async authorize(credentials, req) {
        let user;

        const res = await axios({
          method: 'POST',
          url: `${process.env.NEXTAUTH_URL}/api/login`,
          data: credentials,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          user = response.data;
        });


        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    }, 

    async session({ session, token, user }) {
      session.user = token as any;

      // if (session.user) {
      //   session.user.id = user.id;
      // }

      return session;
    },
  },

  pages: {
    signIn: '/admin-login', // comment to use default nextauthlogin page
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }


});

export { handler as GET, handler as POST };