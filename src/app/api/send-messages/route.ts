import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();
    console.log('content is: ', content)
    
    
    try {
        console.log('In send-message')

        const user = await UserModel.findOne({username}).exec();

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'No user found with given username'
                },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User with username is not accepting messages',
                },
                { status: 403 }
            );
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();

        console.log('user is : ');
        console.log(user);
        
        console.log('Last send-message')

        return Response.json(
            {
                success: true,
                message: 'Message sent successfully'
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.log('Error in sending message', error);
        return Response.json(
            {
                success: false,
                message: 'Error in sending message'
            },
            { status: 500 }
        );
    }
}