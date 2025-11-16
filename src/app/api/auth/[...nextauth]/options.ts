// TypeScript
import {NextAuthOptions} from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/db.connect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: {label: "Email or Username", type: "text", placeholder: "jsmith@example.com"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials?.identifier},
                            {username: credentials?.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email or username.")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account first.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect password.")
                    }

                } catch (error: any) {
                    // Ensure a string message is passed to Error
                    throw new Error(error?.message ?? String(error))
                }
            }
        })
    ],
    callbacks: {
        async session({session, token}) {
            if (token) {
                session.user._id = token._id
                session.user.isAcceptingMsg = token.isAcceptingMsg
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            return session
        },
        async jwt({token, user}) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMsg = user.isAcceptingMsg;
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};
