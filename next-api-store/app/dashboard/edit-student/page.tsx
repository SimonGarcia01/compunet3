'use client';

import studentService from '@/app/services/student.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StudentForm {
	name: string;
	age: number;
	email: string;
	gender: string;
}

export default function functionEditStudentPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const id = searchParams.get('id');

	//This is the state for the student form
	const [student, setStudent] = useState<StudentForm>({
		name: '',
		age: 0,
		email: '',
		gender: '',
	});

	//This is the state for the loading of the page
	const [loading, setLoading] = useState<boolean>(true);

	//This is the state for updating a student
	const [updating, setUpdating] = useState<boolean>(false);

	useEffect(() => {
		if (id) {
			//Eventhough use effect doesn't allow async functions,
			//We can define an async function inside the use effect and call it immediately
			const fetchStudent = async () => {
				try {
					//Tries to get the student by ID, if it succeeds it updates the student state
					const data = await studentService.getById(id);
					setStudent({
						name: data.name,
						age: data.age,
						email: data.email,
						gender: data.gender,
					});
				} catch (error) {
					console.error('Error while fetching students: ', error);
				} finally {
					//After we try to get a student we set loading to false
					setLoading(false);
				}
			};

			fetchStudent();
		}
	}, [id]);

	//This method is responsible for handling the change of the inputs and selects
	// It takes the event of the change and updates the student state accordingly
	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target;

		if (name === 'age') {
			setStudent(prev => ({ ...prev, [name]: Number(value) }));
		} else {
			setStudent(prev => ({ ...prev, [name]: value }));
		}
	};

	//This method is responsible for handling the submit of the form
	const handleSubmit = async (event: React.SubmitEvent) => {
		//Default behavior of the form is to refresh the page, we prevent that
		event.preventDefault();

		if (!id) return;
		//This set updating is so the button can be disable while we are updating the student
		setUpdating(true);
		try {
			await studentService.update(id, student);
			alert('The student has been updated successfully');
			router.push('/dashboard/students');
		} catch (error) {
			console.log('Error while updating the student: ', error);
		} finally {
			//After we try to update the student, we set updating to false
			setUpdating(false);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-screen">
				Student Loading
			</div>
		);

	return (
		<div className="flex justify-center items-center min-h-screen">
			<form
				onSubmit={handleSubmit}
				className="bg-slate-200 p-6 rounded shadow-md w-full max-w-md"
			>
				<h1 className="text-2xl mb-4">Edit Student</h1>
				<div className="mb-4">
					<label htmlFor="name" className="text-gray-700 block">
						Name:
					</label>
					<input
						type="text"
						id="name"
						//The actual value of the input, we set it as undefined for now
						value={student.name}
						//This hears the change event of the input
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="age" className="text-gray-700 block">
						Age:
					</label>
					<input
						type="number"
						id="age"
						value={student.age}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="text-gray-700 block">
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={student.email}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="gender" className="text-gray-700 block">
						Gender:
					</label>
					<select
						name="gender"
						id="gender"
						value={student.gender}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					>
						<option value="">Select Gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</div>
				<button
					type="submit"
					disabled={updating}
					className="w-full bg-slate-700 text-white p-2 rounded disabled:opacity-50"
				>
					{updating ? 'Updating...' : 'Update Student'}
				</button>
			</form>
		</div>
	);
}
