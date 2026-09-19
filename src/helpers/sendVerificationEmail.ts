import { render } from "@react-email/render";
import { getMailFrom, getTransporter } from "@/lib/mailer";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const emailComponent = VerificationEmail({ username, otp: verifyCode });
        const html = await render(emailComponent);
        const text = await render(emailComponent, { plainText: true });

        await getTransporter().sendMail({
            from: getMailFrom(),
            to: email,
            subject: "GhostFeedback | Verify your email address",
            html,
            text,
        });

        return {
            success: true,
            message: "Verification email sent successfully.."
        };
    } catch (error) {
        console.error("Failed to send verification email", error);
        return {
            success: false,
            message: "Failed to send verification email"
        };
    }
}