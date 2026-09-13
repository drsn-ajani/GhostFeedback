import mongoose from 'mongoose'

type connectionObject = {
    isConnected?: number;
}

const connection : connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to Database");
        return ;
    }

    try {
        const db = await mongoose.connect(process.env.MOGODB_URL || '')
        // console.log("Printing db: ", db)

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected, Successfully");
    } catch (error) {
        console.log("Error connecting to DB", error);
        throw error;
    }
}

export default dbConnect;