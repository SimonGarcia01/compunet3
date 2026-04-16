import { GameDocument, GameModel } from "./game.model";
import { gamesService } from "./game.service";
import { GameInput, GameInputUpdate } from "./dto/game.interface";
import { UserDocument } from "../users/user.model";
import { UserModel, UserRole } from "../users/user.model";

//Make the mocks for all the dependencies of the service
jest.mock("./game.model", () => ({
  GameModel: {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("GameService Tests", () => {
  it("Should  return the new document of a recently created game", async () => {
    //Arrangek
    const mockGameInput: GameInput = {
      title: "Game",
      genre: "Genre",
      releaseDate: new Date(),
      createdBy: "1",
    };

    const mockReturnedGame: GameDocument = {
      title: "Game",
      genre: "Genre",
      releaseDate: new Date(),
      createdBy: "1",
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    const mockGameCreator: UserDocument = {
      _id: "1",
      name: "User1",
      email: "user1@example.com",
      password: "hashedpassword1",
      roles: [UserRole.USER],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    //It must first make sure the user that creates the game exists
    jest.spyOn(UserModel, "findById").mockResolvedValue(mockGameCreator);

    //This is what the model should return at the end ofthe smethod
    (GameModel.create as jest.Mock).mockResolvedValue(mockReturnedGame);

    //Act
    const result = await gamesService.create(mockGameInput);

    //Assert
    expect(result).toEqual(mockReturnedGame);
  });

  it("Should return the updated document after updating a Game", async () => {
    //Arrange
    const mockGameId: string = "1";
    const mockGameInput: GameInputUpdate = {
      title: "Updated Game",
    };

    const mockUpdaptedGame: GameDocument = {
      title: "Updated Game",
      genre: "Genre",
      releaseDate: new Date(),
      createdBy: {
        _id: "1",
        name: "Test User",
        email: "email@example.com",
      },
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    (GameModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdaptedGame,
    );

    //Arc
    const result = await gamesService.update(mockGameId, mockGameInput);

    //Assert
    expect(result).toEqual(mockUpdaptedGame);
  });

  it("Should return all games that are not marked as deleted with the selected fields", async () => {
    //Arrange
    const mockReturnedGames = [
      {
        title: "Game",
        genre: "Genre",
        releaseDate: new Date(),
        createdBy: {
          _id: "1",
          name: "Test User",
          email: "email@example.com",
        },
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    ];

    (GameModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReturnedGames),
    });

    //Act
    const result = await gamesService.getAll();

    //Assert
    expect(result).toEqual(mockReturnedGames);
  });

  it("Should return null if the entered ID doesn't match any within the database", async () => {
    //Arrange
    const mockGameId: string = "1";
    const mockReturnedGame: null = null;

    (GameModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReturnedGame),
    });

    //act
    const result = await gamesService.getById(mockGameId);

    //Assert
    expect(result).toBeNull();
  });

  it("it should return a false if the entered ID of a game doesn't exist", async () => {
    //Arrange
    const mockGameId: string = "1";

    (GameModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    //act
    const result = await gamesService.delete(mockGameId);

    //Assert
    expect(result).toBe(false);
  });

  it("Should return all the games made by a specific user, empty if he has created none", async () => {
    //Arrange
    const mockUserId: string = "1";
    const mockReturnedGames: GameDocument[] = [];

    (GameModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReturnedGames),
    });
    //act
    const result = await gamesService.getByUserId(mockUserId);

    //Assert
    expect(result).toBeTruthy();
  });

  it("Should return all the games of a specific genre", async () => {
    //Arrange
    const mockGenre: string = "Genre";
    const mockReturnedGames: GameDocument[] = [
      {
        title: "Game",
        genre: "Genre",
        releaseDate: new Date(),
        createdBy: {
          _id: "1",
          name: "Test User",
          email: "email@example.com",
        },
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    ];

    (GameModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReturnedGames),
    });

    //act
    const result = await gamesService.getByGenre(mockGenre);

    //Assert
    expect(result).toEqual(mockReturnedGames);
    //Could test if the first game in the returned array has the
    //search genre, but since I made it, it's not a good test
    expect(result[0].genre).toBe(mockGenre);
  });
});
