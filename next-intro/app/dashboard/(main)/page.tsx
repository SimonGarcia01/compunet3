'use client';

import { Result } from '@/app/interfaces/user-response.interface';
import userService from '@/app/services/user.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function MainPage() {
	const [users, setUsers] = useState<Result[]>([]);

	useEffect(() => {
		const getUsers = async () => {
			try {
				const userResponse = await userService.getUsers();
				setUsers(userResponse.results);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};

		getUsers();
	}, []);

	return (
		<div>
			<div className="flex items-center justify-center min-h-screen">
				<div className="col-span-12">
					<div className="overflow-auto lg:overflow-visible">
						<table className="table border-separate space-y-6 text-sm">
							<thead className="bg-gray-800 text-white">
								<tr>
									<th className="p-3">Full Name</th>
									<th className="p-3">Gender</th>
									<th className="p-3">Street Address</th>
									<th className="p-3">Email</th>
									<th className="p-3">Phone Number</th>
									<th className="p-3">Picture</th>
								</tr>
							</thead>
							<tbody>
								{users
									? users.map((user) => (
											<tr key={user.email}>
												<td className="p-3">
													{user.name.first}{' '}
													{user.name.last}
												</td>
												<td className="p-3">
													{user.gender}
												</td>
												<td className="p-3">
													{user.location.street.name}{' '}
													{user.location.postcode}
												</td>
												<td className="p-3">
													{user.email}
												</td>
												<td className="p-3">
													{user.cell}
												</td>
												<td className="p-3">
													<Image
														src={
															user.picture
																.thumbnail
														}
														alt={user.name.first}
														width={48}
														height={48}
													/>
												</td>
											</tr>
										))
									: null}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
