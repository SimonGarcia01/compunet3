export interface LoginRequest {
	email: string;
	password?: string;
}

export interface LoginResponse {
	id: string;
	email: string;
	token: string;
}

export interface AuthUser extends LoginRequest {}
