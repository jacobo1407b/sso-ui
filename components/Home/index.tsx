"use client"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Progress } from "@heroui/progress"
import { Chip } from "@heroui/chip"
import {
    Users,
    Settings,
    Crown,
    TrendingUp,
    Activity,
    Shield,
    AlertTriangle,
    Clock,
    Plus,
    Eye,
    BarChart3,
} from "lucide-react";

import UserManagementHeader from "../Common/UserManagementHeader";

const stats = {
    users: {
        total: 1247,
        active: 1089,
        inactive: 158,
        newThisMonth: 89,
        growth: 12.5,
    },
    applications: {
        total: 24,
        active: 18,
        development: 8,
        staging: 6,
        production: 10,
        growth: 8.3,
    },
    roles: {
        total: 12,
        mostUsed: "Editor",
        permissions: 156,
        customRoles: 8,
    },
}
const recentActivity = [
    {
        id: 1,
        type: "user",
        action: "Usuario creado",
        details: "Ana García se registró en el sistema",
        time: "Hace 2 horas",
        icon: Users,
        color: "text-blue-600",
    },
    {
        id: 2,
        type: "app",
        action: "Aplicación actualizada",
        details: "EmpresaCorp Mobile App - Nuevos scopes añadidos",
        time: "Hace 4 horas",
        icon: Settings,
        color: "text-green-600",
    },
    {
        id: 3,
        type: "role",
        action: "Rol modificado",
        details: "Permisos del rol 'Moderador' actualizados",
        time: "Hace 6 horas",
        icon: Crown,
        color: "text-purple-600",
    },
    {
        id: 4,
        type: "user",
        action: "Acceso suspendido",
        details: "Usuario Carlos Rodríguez - Actividad sospechosa",
        time: "Hace 1 día",
        icon: AlertTriangle,
        color: "text-red-600",
    },
]

const topRoles = [
    { name: "Editor", users: 456, color: "bg-blue-500" },
    { name: "Viewer", users: 289, color: "bg-green-500" },
    { name: "Moderador", users: 178, color: "bg-purple-500" },
    { name: "Admin", users: 45, color: "bg-red-500" },
    { name: "Analista", users: 134, color: "bg-orange-500" },
]

export default function index() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <UserManagementHeader
                subtitle="Resumen general del sistema y actividad reciente"
                title="Panel de Control" />


            {/* Stats principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Usuarios */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">+{stats.users.growth}%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground">{stats.users.total.toLocaleString()}</h3>
                            <p className="text-default-500 font-medium">Total de Usuarios</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600">{stats.users.active} activos</span>
                                <span className="text-red-500">{stats.users.inactive} inactivos</span>
                            </div>
                            <Progress
                                value={(stats.users.active / stats.users.total) * 100}
                                color="success"
                                size="sm"
                                className="mt-2"
                            />
                            <p className="text-xs text-default-400 mt-2">+{stats.users.newThisMonth} nuevos este mes</p>
                        </div>
                    </CardBody>
                </Card>

                {/* Aplicaciones */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">+{stats.applications.growth}%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground">{stats.applications.total}</h3>
                            <p className="text-default-500 font-medium">Aplicaciones OAuth</p>
                            <div className="flex gap-2 flex-wrap">
                                <Chip size="sm" color="success" variant="flat">
                                    {stats.applications.production} Prod
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    {stats.applications.staging} Stage
                                </Chip>
                                <Chip size="sm" color="default" variant="flat">
                                    {stats.applications.development} Dev
                                </Chip>
                            </div>
                            <p className="text-xs text-default-400 mt-2">{stats.applications.active} aplicaciones activas</p>
                        </div>
                    </CardBody>
                </Card>

                {/* Roles */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <Chip size="sm" color="secondary" variant="flat">
                                Más usado: {stats.roles.mostUsed}
                            </Chip>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground">{stats.roles.total}</h3>
                            <p className="text-default-500 font-medium">Roles Definidos</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-600">{stats.roles.customRoles} personalizados</span>
                                <span className="text-default-500">{stats.roles.permissions} permisos</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-2 flex-1 bg-purple-200 dark:bg-purple-800 rounded-full">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Actividad reciente */}
                <div className="lg:col-span-2">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg h-full">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center w-full">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Actividad Reciente
                                </h3>
                                <Button
                                    size="sm"
                                    variant="flat"
                                    startContent={<Eye className="w-4 h-4" />}
                                    className="bg-default-100 dark:bg-default-800"
                                >
                                    Ver todo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex gap-4 p-4 rounded-xl bg-default-50 dark:bg-default-900/30 hover:bg-default-100 dark:hover:bg-default-800/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center">
                                                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground text-sm">{activity.action}</h4>
                                            <p className="text-sm text-default-500 mt-1 truncate">{activity.details}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="w-3 h-3 text-default-400" />
                                                <span className="text-xs text-default-400">{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Roles más utilizados */}
                <div>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg h-full">
                        <CardHeader className="pb-3">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Roles Populares
                            </h3>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="space-y-4">
                                {topRoles.map((role, index) => (
                                    <div key={role.name} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-default-100 dark:bg-default-800 text-sm font-bold text-foreground">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-foreground text-sm">{role.name}</span>
                                                <span className="text-xs text-default-500">{role.users} usuarios</span>
                                            </div>
                                            <div className="w-full bg-default-200 dark:bg-default-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${role.color}`}
                                                    style={{ width: `${(role.users / stats.users.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="flat"
                                className="w-full mt-4 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                startContent={<Crown className="w-4 h-4" />}
                            >
                                Gestionar Roles
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Acciones rápidas */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                    <h3 className="text-xl font-semibold text-foreground">Acciones Rápidas</h3>
                </CardHeader>
                <CardBody className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            variant="flat"
                            className="h-20 flex-col gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                            startContent={<Users className="w-6 h-6" />}
                        >
                            <span className="font-semibold">Crear Usuario</span>
                            <span className="text-xs opacity-70">Añadir nuevo usuario</span>
                        </Button>
                        <Button
                            variant="flat"
                            className="h-20 flex-col gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50"
                            startContent={<Settings className="w-6 h-6" />}
                        >
                            <span className="font-semibold">Nueva App</span>
                            <span className="text-xs opacity-70">Crear aplicación OAuth</span>
                        </Button>
                        <Button
                            variant="flat"
                            className="h-20 flex-col gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                            startContent={<Crown className="w-6 h-6" />}
                        >
                            <span className="font-semibold">Crear Rol</span>
                            <span className="text-xs opacity-70">Definir nuevo rol</span>
                        </Button>
                        <Button
                            variant="flat"
                            className="h-20 flex-col gap-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50"
                            startContent={<BarChart3 className="w-6 h-6" />}
                        >
                            <span className="font-semibold">Reportes</span>
                            <span className="text-xs opacity-70">Ver estadísticas</span>
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
