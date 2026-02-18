import { App } from "./app";

//This is the main file used to start the server
async function main() {
    const app = new App();
    await app.listen();
}