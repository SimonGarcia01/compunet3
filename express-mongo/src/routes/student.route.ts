import { Router } from "express";
import { studentController } from "../controllers/student.controller";
import { CreateStudentDto } from "../dtos/student.dto";
import { validateDto } from "../middlewares/validate-dto";


export const studentRouter: Router = Router();


//Routes for other CRUD Operations
//Create a new student
studentRouter.post("/", validateDto(CreateStudentDto),  studentController.create);

//Routing to get all students
studentRouter.get("/", studentController.getAll);

//Get one student by id
studentRouter.get("/:id", studentController.getOne);

// //Update part of a student
// studentRouter.patch("/:id",validateDto(UpdateStudentDto), studentController.update);
// //Delete a student
// studentRouter.delete("/:id", studentController.delete);