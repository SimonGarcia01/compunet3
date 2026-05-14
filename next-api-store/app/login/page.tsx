'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthStore } from '../_store/store/auth.store';

export default function LoginPage() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();

	const { login } = useAuthStore();

	const handleSubmit = async (event: React.SubmitEvent) => {
		//Prevent refreshing the page
		event.preventDefault();
		//Prevent multiple submits
		setLoading(true);
		//Reset the error state
		setError('');
		try {
			await login(email, password);
			router.push('/dashboard');
		} catch (error) {
			setError('An error occured while logging in. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	return <div>Form goes here</div>;
}
