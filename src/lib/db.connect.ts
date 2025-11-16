import mongoose from 'mongoose'

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Database already connected.")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log("DB CONNECTIONs :: ", db.connections)

        connection.isConnected = db.connections[0].readyState

        console.log("Db Connected successfully...")

    } catch (err) {
        console.log("Db Connection Failed :: ", err)
        process.exit(1)
    }
}

export default dbConnect;