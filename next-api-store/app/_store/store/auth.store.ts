import { create } from 'zustand';
import { AuthStore } from '../interfaces/types';
import authService from '@/app/services/auth.service';

export const useAuthStore = create<AuthStore>()(set => ({
	user: null,
	token: null,
	isAuthenticated: false,
	login: async (email: string, password: string) => {
		const {
			id,
			email: string,
			token,
		} = await authService.login({ email, password });
		localStorage.setItem('authToken', token);
		set({
			user: { email },
			token,
			isAuthenticated: true,
		});
	},
}));
