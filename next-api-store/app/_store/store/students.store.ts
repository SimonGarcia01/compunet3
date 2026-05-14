import { create } from "zustand";
import { Student, StudentStore } from "../interfaces/types";
import studentService from "@/app/services/student.service";

//This is the store for the students, uses zustand to manage the state of the students
export const useStudentStore = create<StudentStore>()((set) => ({
  //Initial state of the students = Empty array
  student: [],
  //This function is responsible for fetching the students from the API and updating the state
  getStudent: async (limit: number, offset: number = 1) => {
    //This is where we call the API to get the students with the student service
    const student: Student[] = await studentService.getall(limit, offset);
    //After we get the students, we update the state with the new students
    return set((state) => ({ ...state, student }));
  },
}));
