import express, { Express } from "express";
import { db } from "./lib/connectionDb";
import { studentRouter } from "./routes/student.route";

const app: Express = express();

const PORT:number = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Add the routes
app.use("/student", studentRouter)

//First you got to connect to the db before you start the server, otherwise you might have problems with the connection
db.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running ${PORT} port`);
    });
});


