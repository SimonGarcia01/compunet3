import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://randomuser.me/api/',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;
//Add an interceptor at some point
