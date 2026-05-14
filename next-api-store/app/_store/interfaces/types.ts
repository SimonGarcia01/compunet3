import { AuthUser } from '@/app/interfaces/auth.interface';
import { Grade } from '@/app/interfaces/students-response.interface';

export type Student = {
	id: string;
	name: string;
	age: number;
	email: string;
	nickname: string;
	gender: string;
	subjects: string[];
	grade: Grade[];
};

export type StudentStore = {
	//Strores the state of the students
	student: Array<Student>;
	//This function is responsible for fetcihng the students from the API and updating the state
	getStudent: (limit: number, offset: number) => Promise<void>;
};

export type StoreSet = (
	partial:
		| StudentStore
		| Partial<StudentStore>
		| ((state: StudentStore) => StudentStore | Partial<StudentStore>),
	replace?: boolean | undefined
) => void;

export interface AuthStore {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
}
