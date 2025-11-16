import dbConnect from "@/lib/db.connect";
import UserModel from "@/models/user.model";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";
import {Message} from "@/models/messages.model";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const {username, email, password, fullName} = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken."
            }, {status: 400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with email"
                }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                fullName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMsg: true,
                isVerified: false,
                messages: []
            })

            await newUser.save();
        }

        //send verification email.
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "User Registered Successfully."
        }, {status: 201})


    } catch (error) {
        console.log("Error Registering User :: ", error)
        return Response.json({
            success: false,
            message: "Error Registering User."
        }, {
            status: 500
        })
    }

}