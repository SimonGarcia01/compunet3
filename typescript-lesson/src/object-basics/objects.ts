//Arrays
export const studentIds:number[] = [1, 2, 6, 7, 13];

studentIds.push(20);
console.log("Student IDs:", studentIds);
studentIds.pop();
console.log("Student IDs after pop:", studentIds);

//Better than usual for loop to iterate using forEach
//This is faster than the usual loop
studentIds.forEach((id) => {
    console.log("Student ID:", id);
});

//Filter is used to create a filtered array
const studentsFilter:number[] = studentIds.filter((id) => id > 5);
console.log("Filtered Student IDs:", studentsFilter);

//Now about objects, they are created with {curly braces } and have key = value pairs
// const student = {
//     id: 1,
//     name: "student1",
//     age: 34,
//     isActive: true
// }
// console.log("Student Object:", student);

//Prototype inheritance in JS example


//Now lets make an interface
//All their values must be implemented in the object
interface Student {
    id: number;
    name: string;
    age: number;
    //If you add a ? it means the property is optional
    isActive?: boolean;
    //Can define methods, but only the signature
    login: () => number;
}

const student: Student = {
    id: 1,
    name: "student1",
    age: 34,
    // isActive: true,
    login: () => {
        console.log("Student logged in");
        return 1;
    }
    //If you try to add property not defined in the interface = error
    // grade: "A"
}
console.log("Student Object:", student);

//The difference between interface, class and abstract class:
//Interface: defines a contract for the shape of an object, but does not provide implementation. 
// --> It is used to define the structure of an object and can be implemented by classes or objects.
//Class: defines a blueprint for creating objects, including properties and methods. 
// -- >It can be instantiated to create objects and can implement interfaces.
//Abstract Class: is a class that cannot be instantiated and is meant to be extended by other classes. 
// --> It can provide both implementation and abstract methods that must be implemented by subclasses. 
// -->It is used to define common behavior for a group of related classes.


