import axios from "axios";

//Strategy pattern here using interface
//Now all services must implement it
export interface HttpAdapter {
    getPokemon<T>(name:string): Promise<T>
}

//Now lets make a service that doesn't depend on the API
export class ApiServiceAxios implements HttpAdapter {
    //Now it doesn't expect the specific structure of the API
    async getPokemon<T>(name:string): Promise<T> {
        const url= `https://pokeapi.co/api/v2/pokemon/${name}`;

        //Now get the data, but at this point you don't know the structure of the data = Generic T
        const {data} = await axios.get<T>(url);

        return data;
    }
}

export class ApiServiceFetch implements HttpAdapter {
    async getPokemon<T>(name:string): Promise<T> {
        const url= `https://pokeapi.co/api/v2/pokemon/${name}`;
        const response = await fetch(url);
        const data: T = await response.json();
        return data;
    }
}

// export class ApiServiceAxios {
//     async getPokemon(name:string){
//         const url= `https://pokeapi.co/api/v2/pokemon/${name}`;
//         //Method is not a promise, but axios will return a promise
//         //A promise returns a result as long as you wait for it
//         //Now we can use the interface
//         //data is returned by axios, and it holds the structure of PokeAPI
//         const {data} = await axios.get<PokeAPI>(url);
//         //This is desctructuring the pokemon, now we only get the data
//         //Desctructuring can have any values you want, but they must be in the same order as the original object
//         return data;
//     }
// }

// export class ApiServiceFetch {
//     async getPokemon(name:string): Promise<PokeAPI> {
//         const url= `https://pokeapi.co/api/v2/pokemon/${name}`;
//         //Get the info
//         const response = await fetch(url);

//         //Give structure to the data
//         const data: PokeAPI = await response.json();
        
//         //return the data with the structure
//         return data;
//     }
// }