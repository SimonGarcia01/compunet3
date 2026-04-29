import { IoCalculatorOutline } from 'react-icons/io5';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-slate-100 overflow-y-scroll w-screen h-screen text-slate-300 selection:bg-blue-600 selection:text-white">
			<div className="flex">
				<div
					style={{ width: '480px' }}
					className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 h-screen overflow-y-scroll"
				>
					<div className="mx-4 px-4">
						<h1 className="text-lg md:text-2xl font-bold text-white">
							Dash<span className="text-blue-500">Students</span>
						</h1>
						<p className="text-slate-500 text-sm">
							Manage your student's application
						</p>
					</div>

					<div className="px-6 py-10">
						<p className="text-slate-500">Welcome, Simon!</p>
						<a
							href=""
							className="inline-flex space-x-2 items-center p-6"
						>
							<span className="rounded-full w-8 h-8 bg-amber-100"></span>
							<span className="text-sm md:text-base font-bold">
								Shimi
							</span>
						</a>
					</div>

					<div className="w-full flex-col">
						<a
							href="/dashboard/counter"
							className="w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py -3"
						>
							<div>
								<IoCalculatorOutline />
							</div>

							<div className="flex flex-col">
								<span className="text-lg font-bold text-white leading-5">
									Counter
								</span>
								<span className="text-sm text-white/50 hidden md:block">
									Simple example of a counter
								</span>
							</div>
						</a>
					</div>
				</div>

				<div className="p-2 w-full text-slate-900">{children}</div>
			</div>
		</div>
	);
}
