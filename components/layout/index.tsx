"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} onClose={closeSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        <Navbar onSidebarToggle={toggleSidebar} />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">{children}</main>
      </div>
    </div>
  )
}
