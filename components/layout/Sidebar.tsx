"use client"

import { Link } from "@heroui/link"
import { Home, Users, X, Menu, LayoutGrid, Cog } from "lucide-react"
import { Button } from "@heroui/button"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface SidebarProps {
    isOpen: boolean
    onToggle?: () => void
    onClose?: () => void
}

const navigationItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Usuarios", href: "/users", icon: Users },
    { name: "Aplicaciones", href: "/aplications", icon: LayoutGrid },
    { name: "Roles", href: "/rols", icon: Cog }
]

export function Sidebar({ isOpen, onToggle, onClose }: SidebarProps) {
    const pathname = usePathname()

    // Close sidebar on route change for mobile
    useEffect(() => {
        if (isOpen && window.innerWidth < 768) {
            // Assuming md breakpoint is 768px
            //onClose()
        }
    }, [pathname, isOpen, onClose])

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 dark:bg-black/60 z-40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
          border-r border-default-200 dark:border-default-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-0 md:w-20"}
          overflow-hidden md:overflow-visible`}
            >
                {/* Header del Sidebar */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-default-200 dark:border-default-800">
                    {isOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-md">E</span>
                            </div>
                            <p className="font-bold text-lg text-foreground">EmpresaCorp</p>
                        </div>
                    )}
                    <Button
                        isIconOnly
                        variant="flat"
                        onClick={onToggle}
                        className="bg-default-100 dark:hover:bg-default-300  dark:text-blue-400 rounded-xl transition-all duration-300 text-foreground"
                        aria-label={isOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Elementos de navegación */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-200
                ${pathname === item.href
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                                    : "text-foreground hover:bg-default-100"
                                }`}
                            aria-current={pathname === item.href ? "page" : undefined}
                        >
                            <item.icon
                                className={`w-5 h-5 flex-shrink-0 ${pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-default-500"}`}
                            />
                            <span className={`${isOpen ? "block" : "hidden"} whitespace-nowrap`}>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer del Sidebar (opcional) */}
                {isOpen && (
                    <div className="px-4 py-4 border-t border-default-200 dark:border-default-800 text-center text-sm text-default-500">
                        © 2024 EmpresaCorp
                    </div>
                )}
            </aside>
        </>
    )
}
