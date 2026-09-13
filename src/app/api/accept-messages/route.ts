import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Aurhenticated'
            },
            { status: 401 }
        );
    }

    const user = session.user;

    try {
        const userId = user._id;
        const { acceptMessages } = await request.json();
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find the user to update status'
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Accepting status upated, succesfully'
            },
            { status: 200 }
        );

    } catch (error) {
        console.log('Error in accepting-messages');
        return Response.json(
            {
                success: false,
                message: 'Error in updating message acceptance status'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                successs: false,
                message: 'Not Authenticated'
            },
            { status: 500 }
        );
    }

    const user = session.user;

    try {
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );

    } catch (error) {
        console.log('Error retrieving the message acceptance status');
        return Response.json(
            {
                success: false,
                message: 'Error retrieving the message acceptance status'
            },
            { status: 500 }
        )
    }
}