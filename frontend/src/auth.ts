import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Retro Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simple mock authorization.
        // In a real app, you would verify this against your database.
        if (credentials?.email === "admin@retro.os" && credentials?.password === "password") {
          return {
            id: "1",
            name: "System Administrator",
            email: "admin@retro.os",
            role: "ADMIN",
          };
        }
        if (credentials?.email?.toString().toLowerCase() === "rehanmohammad1302@gmail.com") {
          return {
            id: "99",
            name: "Mohammad Rehan",
            email: "rehanmohammad1302@gmail.com",
            role: "ADMIN",
          };
        }
        if (credentials?.email === "rehan@member.os" && credentials?.password === "password") {
          return {
            id: "2",
            name: "Rehan Developer",
            email: "rehan@member.os",
            role: "MEMBER",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
