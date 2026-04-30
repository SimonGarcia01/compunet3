'use client';

import { User } from '@/app/interfaces/user-response.interface';
import userService from '@/app/services/user.service';
import { useEffect } from 'react';

export default function MainPage() {
	const users: User[] = [];

	useEffect(() => {
		const getUsers = async () => {
			const users = await userService.getUsers();
			return users;
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
											<tr>
												<td className="p-3">
													{user.}
												</td>
												<td className="p-3">Female</td>
												<td className="p-3">
													Gulliver Street
												</td>
												<td className="p-3">
													dianita.linda@gmail.com
												</td>
												<td className="p-3">
													3188374730
												</td>
												<td className="p-3">
													http://photo.com
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
