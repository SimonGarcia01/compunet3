import axios from 'axios';

const axiosInstance = axios.create({
	//baseURL: "https://randomuser.me/api/",
	baseURL: 'http://localhost:9000/api/',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;

//This will be used to add the token to the headers of the request
axiosInstance.interceptors.request.use(
	config => {
		if (globalThis.window !== undefined) {
			//First check the browser's local storage for the token
			const token = localStorage.getItem('authToken');

			//If the token exists, we add it to the headers of the request
			if (token) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		return config;
	},
	error => {
		//If there is an error while adding the token to the headers, we reject the promise with the error
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	response => {
		//If the response is successful, we return the response
		return response;
	},
	error => {
		return Promise.reject(error);
	}
);
