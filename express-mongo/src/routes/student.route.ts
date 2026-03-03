import { Router } from "express";
import { studentController } from "../controllers/student.controller";

export const studentRouter: Router = Router();

//Routing to get all students
studentRouter.get("/", studentController.getAll);

//Routes for other CRUD Operations
//Get information
// studentRouter.get("/:id", studentController.getOne);
// //Create a new student
// studentRouter.post("/", studentController.create);
// //Update a student
// studentRouter.put("/:id", studentController.update);
// //Delete a student
// studentRouter.delete("/:id", studentController.delete);