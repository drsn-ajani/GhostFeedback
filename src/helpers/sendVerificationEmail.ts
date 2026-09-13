import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    console.log('Inside sendVerificationEmail Route')
    try {
        console.log("email is: ", email)
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'GhostFeedback | Verify your email address',
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return {
            success: true,
            message: "Verification email sent successfully.."
        };
    } catch (error) {
        console.log("Failed to send verification email", error)
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}