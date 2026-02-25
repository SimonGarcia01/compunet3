import mongoose from "mongoose";

// Define the stundent object
export interface StudentInput {
    name: string;
    age: number;
    isActive:boolean;
    email: string;
}

//This lets you make inserts to the db
//It must have the info of the student and the info of the mongodocument
export interface StudentDocument extends StudentInput, mongoose.Document {}

//This schema defines how strict the db is when defining the fields
const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    isActive: {type: Boolean, required: true}
    //The collection option specifies the name of the collection
}, {collection: "Students"});

//This gives all the CRUD methods necessary to interact with the db
export const StudentModel = mongoose.model<StudentDocument>("Student", studentSchema);