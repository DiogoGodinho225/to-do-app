import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";


const handler = NextAuth({

    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.users.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    return null;
                }


                const isPasswordValid = await bcrypt.compare(credentials.password.trim(), user.password_hash.trim());

                if (!isPasswordValid) {
                    return null;
                }

                prisma.users.update({
                    where: { id: user.id },
                    data: {
                        status: 1,
                    }
                })

                return {
                    id: (user?.id).toString(),
                    email: user?.email,
                    name: user?.first_name + ' ' + user.last_name,
                    tag: user?.tag,
                    image: user.image_url,
                };
            }
        })
    ],

    session: {
        strategy: 'jwt'
    },
    callbacks: {
       
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },


    pages: {
        signIn: '/auth'
    }
})

export { handler as GET, handler as POST };