//Introduction to Typescript

//Variables and constants
//This is type string
let variable = "variable";
//This is type "constant"
const constant = "constant";

//Variables and constants should have a declared type
export let name:string = "Original Name";
const age: number = 20;

const isValid:boolean = true;

//Using inverted commas to create special string
const message:string = `Allows to create multi-line
strings. You can also use " and ' without escaping.
You can also use variables like ${name}`;
console.log(message);

//Explaining the life cycle in javascript
//There are priorities in the execution of code
//First, the synchronous code is executed (common tasks)
//Second, the microtasks are executed (promises)
//Third, macrotasks are executed (timeouts, intervals, etc.)
//The event loop looks at the call stack and the task queue
//It will loop over and over until everything has the priority set and is executed
console.log("1");
setTimeout(() => console.log("2"), 100);
Promise.resolve().then(() => console.log("3"));
console.log("4");

//Showing how permissive is JS
// const number1: number = 10;
// const number2: number = "10";
// const result = number1 + number2;
//eventhough Typescript will show an error,
//the code will still run since its JS and the result
// will be "1010" instead of 20.