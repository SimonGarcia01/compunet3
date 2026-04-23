//This is necessary to use the useState hook (client side rendering)
'use client';

import { useState } from 'react';

export default function Counter() {
	//The use state allows us to create a singleton variable that will persist and we can update it
	//For every useState you must define the variable and the function that updates it
	const [count, setCount] = useState<number>(0);

	//In the return we can use the variables and functions defined before
	//The return allows to use HTML-like syntax to create the UI of the page
	return (
		//Tailwind here allows us to use utility classes to style our components, without writing custom CSS
		<div className="flex flex-col items-center justify-center w-full h-full">
			<span className="text-9xl">{count}</span>
			<div className="flex">
				<button
					className="flex items-center justify-center p-2 rounded-xl 
                    bg-gray-700 text-white hover:bg-gray-400 transition-all w-[120px] m-2"
					onClick={() => setCount(count + 1)}
				>
					+
				</button>
				<button
					className="flex items-center justify-center p-2 rounded-xl 
                    bg-gray-700 text-white hover:bg-gray-400 transition-all w-[120px] m-2"
					onClick={() => setCount(count - 1)}
				>
					-
				</button>
			</div>
		</div>
	);
}
