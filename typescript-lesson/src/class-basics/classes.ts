import { ApiService } from "../api/api.service";


class Student {
    id: number;
    name: string;
    age: number;
    isActive: boolean;

    //You now make the constructor
    //A private readonly property is a property that can only be set in the constructor and cannot be changed afterwards
    constructor(id: number, name: string, age: number, isActive: boolean, private readonly apiService: ApiService) {
        //This refers to the instance of the class
        //If the class had a parent class, you use super.X
        this.id = id;
        this.name = name;
        this.age = age;
        this.isActive = isActive;
        this.apiService = apiService;
    }

    //Method with return
    add(a: number, b: number): number {
        return a + b;
    }

    //Method without return
    printMessage(): void {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }

    async getPokemon(name:string){
        return await this.apiService.getPokemon(name);
    }
}

//Now you must add the api service to the constructor
export const student1 = new Student(1, "student1", 34, true, new ApiService());

//Here we make the petition to the API
const pokemon = await student1.getPokemon("bulbasaur");
console.log(pokemon.data.name);