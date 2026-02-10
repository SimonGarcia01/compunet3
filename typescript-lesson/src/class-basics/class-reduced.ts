//This is the reduced version of the class file,
//It is more concise, but it gives you a little less control over the properties

class Student{
    constructor(
        public id: number, 
        public name: string, 
        public age: number, 
        public isActive: boolean
    ) {}
}

export const student1 = new Student(1, "student1", 34, true);