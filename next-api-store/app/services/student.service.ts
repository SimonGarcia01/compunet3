import { Student } from "../interfaces/students-response.interface"
import apiService from "./api.service"

const studentService = {

    getall: async(limit:number=10, offset: number=1) => {
        const students = await apiService.get<Student[]>(`students?limit=${limit}&offset=${offset}`);
        return students;
    },

    getById: async(id:string) => {
        const student = await apiService.get<Student>(`students/${id}`);
        return student;
    },

    update: async(id:string, data: Partial<Student>)=>{
        const student = await apiService.patch<Student>(`students/${id}`, data);
        return student;
    }
}

export default studentService;