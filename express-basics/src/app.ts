//used to define the app class that will be used to create the express app
import express, { Application } from "express";
import router from "./routes/api.route";

export class App {
    private app: Application;

    //This is the constructor that is used to create the express app
    //We also call the methods to set settings, middleware, and routes
    constructor(){
        this.app = express();
        this.settings();
        this.middleware();
        this.routes();
    }

    //Defines the routes for the app
    routes() {
        //comment the line below, later it will be used to define the routes
        this.app.use("/", router);
    }

    //Defines the settings for the app
    //starts with port
    settings() {
        //Set the port
        this.app.set("port", 3000);
    }

    //Async function to listen to the port, must be async
    //this starts the server and listens to the port
    async listen() {
        await this.app.listen(this.app.get("port"));
        console.log("This app is running on port " + this.app.get("port"));
    }

    //Must define middleware
    //This lets you define 
    middleware() {
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }
}