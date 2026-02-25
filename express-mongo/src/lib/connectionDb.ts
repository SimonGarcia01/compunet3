import mongoose from "mongoose";

const connectionString = `mongodb://root:password@localhost:27017`;

export const db = mongoose.connect(
    connectionString, {dbName: "icesi"}
).then(() => {
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to MongoDB: ", error);
})