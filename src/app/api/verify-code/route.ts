import dbConnect from "@/lib/db.connect";
import UserModel from "@/models/user.model";
import {usernameValidation} from "@/schemas/signUp.schema";

export async function POST(request: Request) {
    await dbConnect()

    try {

        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const result = usernameValidation.safeParse(decodedUsername)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid Query Parameters."
            }, {status: 400})
        }

        const user = await UserModel.findOne({username: decodedUsername})

        if (!user) {
            return Response.json({
                success: false,
                message: "No user exists."
            }, {status: 404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Code is not valid."
            }, {status: 400})
        }

        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code is no longer valid."
            }, {status: 400})
        }

        user.isVerified = true;
        await user.save();

        return Response.json({
            success: true,
            message: "User Verified successfully."
        }, {status: 200})

    } catch (error) {
        console.log("Error verifying the code.");
        return Response.json({
            success: false,
            message: "Error in Verifying the user."
        }, {status: 500})
    }
}