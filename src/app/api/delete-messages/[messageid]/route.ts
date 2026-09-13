import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: {params: {messageid: string}}) {
    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            { status: 401 }
        );
    }

    const user = session.user;
    const userId = user._id;
    
    try {
        const deleteMessage = await UserModel.updateOne(
            { _id: userId },
            { $pull: {messages: { _id: messageId } } }
        );

        if (deleteMessage.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted'
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: false,
                message: 'Message deleted, successfully'
            },
            { status: 200 }
        )

        
    } catch (error) {
        console.log('Error in deleting message: ', error);
        return Response.json(
            {
                success: false,
                message: 'Error deleting message'
            },
            { status: 500 }
        )
    }
}