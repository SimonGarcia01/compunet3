import { Router } from "express";
import { studentController } from "../controllers/student.controller";

export const studentRouter: Router = Router();


//Routes for other CRUD Operations
//Create a new student
studentRouter.post("/", studentController.create);

//Routing to get all students
studentRouter.get("/", studentController.getAll);

//Get one student by id
studentRouter.get("/:id", studentController.getOne);

// //Update a student
// studentRouter.put("/:id", studentController.update);
// //Delete a student
// studentRouter.delete("/:id", studentController.delete);