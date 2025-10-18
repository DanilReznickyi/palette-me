// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import AppleProvider from "next-auth/providers/apple";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "./prisma";
// import bcrypt from "bcrypt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "database" },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//     }),
//     AppleProvider({
//       clientId: process.env.APPLE_ID!,
//       clientSecret: process.env.APPLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });
//         if (!user?.password) return null;

//         const valid = await bcrypt.compare(credentials.password, user.password);
//         return valid ? user : null;
//       },
//     }),
//   ],
//   pages: { signIn: "/signin" },
//   callbacks: {
//     async session({ session, user }) {
//       if (session.user) session.user.id = user.id;
//       return session;
//     },
//   },
// };

// Temporary auth mock (no backend mode)
export const authOptions = {};
