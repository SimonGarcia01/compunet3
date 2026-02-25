import { StudentDocument, StudentModel} from "../models/Student.model";

class StudentService {
    async findAll():Promise<StudentDocument[]>{
        try{
            const student:StudentDocument[] = await StudentModel.find();
            return student;
        } catch(error){
            console.log("Error finding students: ", error);
            throw error;
        }
    }
}

//Export the singleton instance of the StudentService
export const studentService = new StudentService();