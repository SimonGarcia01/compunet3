import {Request, Response} from 'express';
import { StudentDocument } from '../models/Student.model';
import { studentService } from '../services/student.service';

class StudentController {
    public async getAll(request: Request, response: Response) {
        try{
            const students: StudentDocument[] = await studentService.findAll();
            response.status(200).json(students);
        }catch(error){
            response.status(500).json({message: "Error getting students", error});
        }
    }
}
//Export the singleton instance of the StudentController
export const studentController = new StudentController();