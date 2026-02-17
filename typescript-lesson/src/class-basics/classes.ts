import { ApiServiceAxios, ApiServiceFetch, type HttpAdapter } from "../api/api.service";

class Student {
    id: number;
    name: string;
    age: number;
    isActive: boolean;

    //You now make the constructor
    //A private readonly property is a property that can only be set in the constructor and cannot be changed afterwards
    //Now we inject the api interface, so we can use any class
    constructor(id: number, name: string, age: number, isActive: boolean, private readonly httpAdapter: HttpAdapter) {
        //This refers to the instance of the class
        //If the class had a parent class, you use super.X
        this.id = id;
        this.name = name;
        this.age = age;
        this.isActive = isActive;
    }

    //Method with return
    add(a: number, b: number): number {
        return a + b;
    }

    //Method without return
    printMessage(): void {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }

    //Now make the method generic
    async getPokemon<T>(name:string): Promise<T> {
        return await this.httpAdapter.getPokemon<T>(name);
    }
}

//Now you must add the api service to the constructor

//The constructor can be using any service now
const serviceAxios = new ApiServiceAxios();
const serviceFetch = new ApiServiceFetch();

export const student1 = new Student(1, "student1", 34, true, serviceAxios);

//Here we make the petition to the API
const pokemon = await student1.getPokemon("bulbasaur");
console.log(pokemon);