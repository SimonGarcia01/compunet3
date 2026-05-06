export type Students = {
	id: string;
	name: string;
	age: number;
	email: string;
	nickname: string;
	gender: string;
	subjects: string[];
};

export type StudentStore = {
	student: Array<Students>;
	getStudent: (limit: number, offset: number) => Promise<void>;
};
