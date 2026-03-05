import { z } from "zod";

export const CreateStudentDto = z.object({
    name: z.string().min(3, "Name must have at least 3 characters"),
    email: z.email("Invalid email"),
    age: z.number().int().min(1, "Age must be a positive integer")
});

export const UpdateStudentDto = CreateStudentDto.partial();