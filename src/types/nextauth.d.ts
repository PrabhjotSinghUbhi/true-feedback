import 'next-auth'
import {Message} from "@/models/messages.model";
import {DefaultSession} from "next-auth";

declare module 'next-auth' {
    interface User {
        _id?: string;
        isAcceptingMsg?: boolean;
        isVerified?: boolean;
        username?: string;
    }

    interface Session {
        user: {
            _id?: string;
            isAcceptingMsg?: boolean;
            isVerified?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isAcceptingMsg?: boolean;
        isVerified?: boolean;
        username?: string;
    }
}