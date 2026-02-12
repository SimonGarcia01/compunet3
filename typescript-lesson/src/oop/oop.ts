class Bird {
    //If no access modifier is added, = public by default
    private feathers: string;
    private color: string;

    constructor(){
        //Default constructor
    }

    //Getters
    getFeathers():string {
        return this.feathers;
    }

    //Setters
    setFeathers(feathers:string): void {
        this.feathers = feathers;
    }

    //Special getter and setter using get and set keywords
    get getColor():string {
        return this.color;
    }

    set colorValue(color: string) {
        this.color = color;
    }
}

const bird1 = new Bird();
//Usual getter and setter use
bird1.setFeathers("soft");
bird1.getFeathers();

//Using the get and set keywords
bird1.colorValue = "red";
bird1.getColor