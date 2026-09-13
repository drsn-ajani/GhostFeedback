import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername});

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(Date.now());

        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: 'Account is verified'
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: 'Verification code is expired, Please sign up again'
                }
            )
        }

        return Response.json(
            {
                success: false,
                message: 'Incoreect verification code'
            },
            { status: 400 }
        )
    } catch (error) {
        console.error("Error in verifying Code..", error);
        return Response.json(
            {
                success: false,
                message: "Error in verifying Code..",
            },
            { status: 500 }
        )
    }
}