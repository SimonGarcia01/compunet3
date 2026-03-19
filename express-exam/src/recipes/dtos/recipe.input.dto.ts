export interface InputRecipe {
    name: string,
    description: string,
    difficulty: Difficulty,
    preparationTimeMinutes: number,
    servings: number 
}

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}