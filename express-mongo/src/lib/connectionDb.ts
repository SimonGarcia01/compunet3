import mongoose from "mongoose";

const connectionString = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}`;

export const db = mongoose.connect(
    connectionString, {dbName: "icesi"}
).then(() => {
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to MongoDB: ", error);
})