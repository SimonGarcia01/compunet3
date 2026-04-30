import { User } from '../interfaces/user-response.interface';
import apiService from './api.service';

const userService = {
	getUsers: async () => {
		const users = apiService.get<User[]>(`?results=20`);
		return users;
	},
};

export default userService;
