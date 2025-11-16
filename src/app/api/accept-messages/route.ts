import {getServerSession} from "next-auth";
import dbConnect from "@/lib/db.connect";
import UserModel from "@/models/user.model";
import {User} from 'next-auth'

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession()
    const user: User = session?.user as User

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "User not signed in."
        }, {status: 401})
    }

    const userId = user._id
    const {acceptMessage} = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMsg: acceptMessage},
            {new: true}
        )

        if (!updatedUser) {
            console.log("User does not exists.")
            return Response.json({
                success: false,
                message: "User does not exists."
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: "Updated Successfully.",
            updatedUser
        }, {status: 200})

    } catch (error) {
        console.log("Failed to update user status to accept messages.")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages."
        }, {status: 500})
    }

}

export async function GET() {
    await dbConnect();


    const session = await getServerSession()
    const user: User = session?.user as User


    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "User not signed in."
        }, {status: 401})
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            console.log("User does not exists.")
            return Response.json({
                success: false,
                message: "User does not exists."
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "User is Accepting Messages."
        }, {status: 200})
    } catch (error) {
        console.log("Failed to get accept messages.")
        return Response.json({
            success: false,
            message: "Failed to get accept messages."
        }, {status: 500})
    }
}