import {Request, Response} from 'express';
import { StudentDocument } from '../models/Student.model';
import { studentService } from '../services/student.service';

class StudentController {
    //Method to get all students
    public async getAll(request: Request, response: Response) {
        try{
            const students: StudentDocument[] = await studentService.findAll();
            response.status(200).json(students);
        }catch(error){
            response.status(500).json({message: "Error getting students", error});
        }
    }

    //Get one student by id
    public getOne = async (request: Request, response: Response) => {
        const id = this.extractId(request);

        try{

        }catch(error){

        }
    }

    //Create a new student
    public create = async (request: Request, response: Response) => {
        try{
            const student = await studentService.create(request.body);
            response.status(201).json(student);
        }catch(error){
            response.status(500).json({message: "Error creating student", error});
        }
    }

    //validation method for an id
}
//Export the singleton instance of the StudentController
export const studentController = new StudentController();