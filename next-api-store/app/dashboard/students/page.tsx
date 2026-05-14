'use client';
import { useStudentStore } from '@/app/_store/store/students.store';
import { useEffect } from 'react';
import Link from 'next/link';
import { IoPencilOutline } from 'react-icons/io5';

export default function StudentsPage() {
	const { student, getStudent } = useStudentStore();

	useEffect(() => {
		getStudent(10, 1);
		console.log(student);
	}, [getStudent]);

	return (
		<div>
			<div className="flex items-center justify-center min-h-screen">
				<div className="col-span-12">
					<div className="overflow-auto lg:overflow-visible">
						<table className="table border-separate space-y-6 text-sm">
							<thead className="bg-gray-800 text-white">
								<tr>
									<th className="p-3">Full Name</th>
									<th className="p-3">Age</th>
									<th className="p-3">Gender</th>
									<th className="p-3">Email</th>
									<th className="p-3">Subjects</th>
									<th className="p-3">Edit</th>
								</tr>
							</thead>
							<tbody>
								{student
									? student.map(student => (
											<tr key={student.id}>
												<td className="p-3">
													{student.name}
												</td>
												<td className="p-3">
													{student.age}
												</td>
												<td className="p-3">
													{student.gender}
												</td>
												<td className="p-3">
													{student.email}
												</td>
												<td className="p-3">
													{student.subjects.join(',')}
												</td>
												<td className="p-3">
													<Link
														href={`/dashboard/edit-student?id=${student.id}`}
													>
														<IoPencilOutline />
													</Link>
												</td>
											</tr>
										))
									: ''}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
