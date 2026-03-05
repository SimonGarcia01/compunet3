import { StudentDocument } from "../models/Student.model";
import { StudentResponseDto } from "../dtos/student-response.dto";

export const studentToResponse = (student: StudentDocument): StudentResponseDto => ({
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    age: student.age,
    //Not sending the isActive field
});