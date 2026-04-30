import { MenuItems } from '../interfaces/menu-items.interface';

//Props can be injected in the () of the function
export const SidebarMenuItems = ({
	path,
	icon,
	title,
	subtitle,
}: MenuItems) => {
	return (
		<a
			href={path}
			className="w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py -3"
		>
			<div>{icon}</div>

			<div className="flex flex-col">
				<span className="text-lg font-bold text-white leading-5">
					{title}
				</span>
				<span className="text-sm text-white/50 hidden md:block">
					{subtitle}
				</span>
			</div>
		</a>
	);
};
