import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'admin@prabh.me',
            to: email,
            subject: "Verify your account - True Feedback.",
            react: VerificationEmail({username, otp: verifyCode})
        })

        return {
            success: true,
            message: "Verification code send successfully."
        }

    } catch (err) {
        console.error("Error Sending the email :: ", err);
        return {
            success: false,
            message: "Error sending the verification code."
        }
    }
}
