import axios from "axios";
import type { PokeAPI } from "../interfaces/pokeapi";

export class ApiService {
    async getPokemon(name:string){
        const url= `https://pokeapi.co/api/v2/pokemon/${name}`;
        //Method is not a promise, but axios will return a promise
        //A promise returns a result as long as you wait for it
        //Now we can use the interface
        const pokemon = await axios.get<PokeAPI>(url);
        return pokemon;
    }
}