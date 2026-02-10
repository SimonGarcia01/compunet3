class Student {
    id: number;
    name: string;
    age: number;
    isActive: boolean;

    //You now make the constructor
    constructor(id: number, name: string, age: number, isActive: boolean){
        //This refers to the instance of the class
        //If the class had a parent class, you use super.X
        this.id = id;
        this.name = name;
        this.age = age;
        this.isActive = isActive;
    }
}

export const student1 = new Student(1, "student1", 34, true);