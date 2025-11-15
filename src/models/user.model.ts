import mongoose, {Schema, Document} from 'mongoose';
import {Message, messageSchema} from "@/models/messages.model";


export interface User extends Document {
    username: string;
    fullName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMsg: boolean;
    isVerified: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please provide a valid email address."]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, "Please choose a valid password."]
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required."]
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    isAcceptingMsg: {
        type: Boolean,
        required: true,
        default: true
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)
export default UserModel