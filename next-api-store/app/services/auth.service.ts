import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import apiService from './api.service';

const authService = {
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		const response = await apiService.post<LoginResponse>(
			'/auth/login',
			credentials
		);
		return response;
	},
};

export default authService;
