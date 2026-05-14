import React from 'react'
import { IoAccessibility, IoCalculatorOutline, IoPeople } from 'react-icons/io5'
import { SidebarMenuItems } from './SidebarMenuItems';
import { MenuItems } from '../interfaces/menu-items.interface';

const menuItems:MenuItems[]=[
  {
    path:"/dashboard/counter",
    icon:<IoCalculatorOutline/>,
    title:"Counter",
    subtitle:"Simple counter application"
  },
  {
    path:"/dashboard/main",
    icon:<IoAccessibility/>,
    title:"Accesibility",
    subtitle:"User helper"
  },
  {
    path:"/dashboard/students",
    icon:<IoPeople/>,
    title:"Students",
    subtitle:"Students manager"
  }
]


export const Sidebar = () => {
  return (
     <div
            style={{width:'480px'}}
            className="bg-gray-900 z-10 text-slate-300 w-64 left-0 h-screen overflow-y-scroll"
            >
              <div className="mx-4 px-6">
                <h1 className="text-lg md:text-2xl font-bold text-white">Dash<span className="text-blue-500">Students</span></h1>
                <p className="text-slate-500 text-sm">Manage your student's application</p>
              </div>
    
              <div className="px-6 py-10">
                <p className="text-slate-500">Welcome, Gus</p>
                <a href=""
                className="inline-flex space-x-2 items-center p-6">
                 
                  <span
                  className="rounded-full w-8 h-8 bg-amber-100"
                  ></span>
                  <span
                  className="text-sm md:text-base font-bold"
                  >Gus Gonzalez</span>
                </a>
    
              </div>
    
              <div className="w-full px-6">
                {
                  menuItems.map(item => (
                    <SidebarMenuItems key={item.path} {...item}/>
                  ))
                }
    
              </div>
            </div>
  )
}

