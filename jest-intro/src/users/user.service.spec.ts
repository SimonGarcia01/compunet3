import { UserModel, UserRole } from "./user.model";
import { userService } from "./user.service";
import bcrypt from "bcrypt";

//Define all the imports (external entities) for the tests
jest.mock("./user.model", () => ({
    //The mock has to know the options and imports so it can be used
    UserRole: {
        ADMIN: "admin",
        USER: "user"
    },

    //mock of the user model
    UserModel: {
        //All mocked methods that
        create: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findById: jest.fn()
    }
}));

jest.mock("bcrypt", () => ({
    hash: jest.fn()
}));

describe("UserService Tests", () => {
    it("Should  return the user when the password is enabled", async () => {

        //Arrange
        const mockUser = {
            _id: "1",
            name: "Test User",
            email: "user@example.com",
            password: "hashedpassword",
            roles: [UserRole.ADMIN]
        };

        //This replaces the findOne function of the model,
        (UserModel.findOne as jest.Mock).mockReturnValue({ 
            //This represents the select function that is changed to the findOne return
            select: jest.fn().mockResolvedValue(mockUser),
        });

        //Act
        const result = await userService.findByEmail(mockUser.email, true);

        //Assert
        expect(result).toEqual(mockUser);
    });

    it("Should create a new user when all data has been correctly define", async () => {
        //Arrange
        const hashedPassword = "hashedpassword1234";
        
        //What is inputed by the user
        const mockUserInput = {
            name: "Test User",
            email: "user@example.com",
            password: "password1234",
            roles: [UserRole.ADMIN],
        };

        //What is expected to be saved
        const mockSavedUser = {
            ...mockUserInput,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        //To only mock the function of interest (without making the entire model)
        jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
        //Mock the return of the hash function
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        //Mock the return of the create function
        (UserModel.create as jest.Mock).mockResolvedValue(mockSavedUser);

        //Act
        const result = await userService.create(mockUserInput);

        //Assert
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
        expect(UserModel.create).toHaveBeenCalledWith({ ...mockUserInput, password: hashedPassword });
        expect(result).toEqual(mockSavedUser);

    });

    it("Should return the update user after updating it", async () => {
        //Arrange
        const mockUserId: string = "1";
        const mockUserInputUpdate ={
            name: "Test User",
            email: "newEmail@example.com",
        };

        const mockUserUpdated = {
            _id: mockUserId,
            name: "Test User",
            email: "newEmail@example.com",
            password: "hashedpassword",
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUserUpdated);

        //Act
        const result = await userService.update(mockUserId, mockUserInputUpdate);

        //Assert
        //Assertion to make sure that the findOneAndUpdate is called correctly
        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockUserId }, 
            mockUserInputUpdate,
            { returnOriginal: false }
        );

        expect(result).toEqual(mockUserUpdated);
    });

    it("Should return all users that are not marked as deleted", async () => {
        // Arrange
        const mockUsers = [
            {
                _id: "1",
                name: "User1",
                email: "user1@example.com",
                password: "hashedpassword1",
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            },
        ];

        (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

        //Act
        const result = await userService.getAll();

        //Assert
        expect(result).toEqual(mockUsers);
    });

    it("Should return the user when the searched id exists", async () => {
        //Arrange
        const mockUserId: string = "1";

        const mockReturnedUser = {
                _id: mockUserId,
                name: "User1",
                email: "user1@example.com",
                password: "hashedpassword1",
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
        };

        (UserModel.findById as jest.Mock).mockResolvedValue(mockReturnedUser);

        //Act
        const result = await userService.getById(mockUserId);

        //Assert
        expect(result).toEqual(mockReturnedUser);
    });

    it("Should return true when a user is marked as deleted", async () => {
        //Arrange
        const mockUserId: string = "1";

        const returnDocument = {
                _id: mockUserId,
                name: "User1",
                email: "user1@example.com",
                password: "hashedpassword1",
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: new Date(),
        };

        (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(returnDocument);

        //Act
        const result = await userService.delete(mockUserId);

        //Assert
        //I would assert that the output document has the deletedAt value set to some time,
        //But it wouldn't be a good test because I made the mock return a document
        expect(result).toBe(true);

    });
});