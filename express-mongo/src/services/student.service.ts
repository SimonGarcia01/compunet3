import { StudentInput, StudentDocument, StudentModel} from "../models/Student.model";

class StudentService {
    //Method to find all students
    async findAll():Promise<StudentDocument[]>{
        try{
            const student:StudentDocument[] = await StudentModel.find();
            return student;
        } catch(error){
            console.log("Error finding students: ", error);
            throw error;
        }
    }

    //Method to find one student by ID

    //Method to create a new student
    async create(studentInput: StudentInput): Promise<StudentDocument> {
        const student = StudentModel.create(studentInput);
        return student;
    }

    
}

//Export the singleton instance of the StudentService
export const studentService = new StudentService();