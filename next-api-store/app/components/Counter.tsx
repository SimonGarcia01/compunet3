"use client"
import React, { useState } from 'react'

export const Counter = () => {
    const [count, setCount] = useState<number>(0);
    const increment = () => setCount(count+1);
    const decrement = () => setCount(count-1);
    
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="text-9xl">{count}</span>
        <div className="flex">
            <button 
            onClick={increment}
            className="flex items-center justify-center p-2 rounded-xl bg-gray-700 text-white hover:bg-gray-400 transition-all w-[120px] m-2"
            >+</button>
            <button
            onClick={decrement}
            className="flex items-center justify-center p-2 rounded-xl bg-gray-700 text-white hover:bg-gray-400 transition-all w-[120px] m-2"
            >-</button>
        </div>
    </div>
  )
}
