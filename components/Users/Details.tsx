"use client"
import { useCallback, useState } from "react";
import { useRouter } from 'next/navigation';
import { useDisclosure, Button, Card, CardBody, Chip, Tabs, Tab } from "@heroui/react";
import { AlertTriangle, Edit, Trash2, User, Mail, MapPin, Calendar, Phone, Activity, Clock, Eye, Shield, Upload } from "lucide-react";
import { Download, Settings } from "lucide-react";

import CommonModal from '@/components/Common/CommonModal'
import UserModal from "./Modal";

import UserManagementHeader from "../Common/UserManagementHeader";
import { UserData } from '@/types';
import Link from 'next/link';




interface iDetailsUserProps {
    user: UserData
    userKey: string,
    rols: Array<string>
}
function DetailsUser({ user, userKey, rols }: iDetailsUserProps) {
    const router = useRouter();
    const [isDragActive, setIsDragActive] = useState(false);
    const [userProfile, setuserProfile] = useState(user.profile_picture);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();


    const onDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(true)
    }, [])

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)
    }, [])

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const onDropHandler = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleAvatarUpload(files[0])
        }
    }, [])
    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            handleAvatarUpload(files[0])
        }
    }
    const handleAvatarUpload = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                console.error("La imagen es demasiado grande. Máximo 2MB.")
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const newAvatar = e.target?.result as string
                if (user) {
                    //setUser({ ...user, avatar: newAvatar })
                    setuserProfile(newAvatar);
                    // Aquí enviarías la imagen al backend
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="space-y-6">
            <UserManagementHeader
                subtitle="Información completa y actividad del usuario"
                title="Detalles del Usuario"
                isProfile
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="flat"
                            onPress={onCreateOpen}
                            startContent={<Edit className="w-4 h-4" />}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                            Editar
                        </Button>
                        {userKey === "false" ? (
                            <Button onPress={onDeleteOpen} color="danger" variant="flat" startContent={<Trash2 className="w-4 h-4" />}>
                                Eliminar
                            </Button>
                        ) : null}

                    </div>
                }
            />

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar y información básica */}
                        <div className="flex flex-col items-center md:items-start gap-4">

                            <div className="relative group">
                                <div
                                    className={`relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ${isDragActive ? "scale-105 border-blue-500" : "hover:scale-105"
                                        }`}
                                    onDragEnter={onDragEnter}
                                    onDragLeave={onDragLeave}
                                    onDragOver={onDragOver}
                                    onDrop={onDropHandler}
                                    onClick={() => document.getElementById("avatar-upload")?.click()}
                                >
                                    {userProfile && userProfile !== "/placeholder.svg?height=120&width=120" ? (
                                        <img
                                            src={userProfile || "/placeholder.svg"}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                                            <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}

                                    {/* Overlay de hover */}
                                    {userKey === "1" && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <Upload className="w-6 h-6 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Cambiar foto</span>
                                            </div>
                                        </div>
                                    )}


                                    {/* Indicador de drag activo */}
                                    {isDragActive && (
                                        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded-full flex items-center justify-center">
                                            <div className="text-center text-blue-600 dark:text-blue-400">
                                                <Upload className="w-6 h-6 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Suelta aquí</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input file oculto */}
                                {
                                    userKey === "1" && (
                                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                                    )
                                }


                                {/* Badge de estado */}
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-foreground">{user.name.split(" ")[0]} {user.last_name}</h2>
                                <p className="text-default-500 text-lg">{user?.userBusiness?.job_title}</p>
                                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                    {/*<Chip color={roleColorMap[user.role]} variant="flat" size="sm">
                                        {user.role === "admin" ? "Administrador" : user.role === "moderator" ? "Moderador" : "Usuario"}
                                    </Chip>
                                    <Chip color="primary" variant="flat" size="sm">
                                        active
                                    </Chip>
                                    */}

                                </div>
                            </div>
                        </div>

                        {/* Información de contacto y estadísticas */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información de contacto */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Información de Contacto
                                    </h3>
                                    <div className="space-y-3">

                                        {user.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-default-500" />
                                                <span className="text-foreground">{user.email}</span>
                                            </div>
                                        )}
                                        {user.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-default-500" />
                                                <span className="text-foreground">{user.phone}</span>
                                            </div>
                                        )}
                                        {user.location.city && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-default-500" />
                                                <span className="text-foreground">{user?.location?.city}</span>
                                            </div>
                                        )}

                                        {user?.userBusiness?.hire_date && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-default-500" />
                                                <span className="text-foreground">
                                                    Miembro desde {new Date(user?.userBusiness?.hire_date).toLocaleDateString("es-ES")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Estadísticas
                                    </h3>
                                    <div className="space-y-4">
                                        {/*<div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-default-500">Tareas completadas</span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {20}/{100}
                                                </span>
                                            </div>
                                            <Progress
                                                value={20}
                                                color="primary"
                                                className="max-w-md"
                                                classNames={{
                                                    track: "drop-shadow-md border border-default",
                                                    indicator: "bg-gradient-to-r from-blue-500 to-indigo-600",
                                                }}
                                            />
                                        </div>*/}
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">
                                                Último acceso: {user.last_login ? new Date(user.last_login).toLocaleString("es-ES") : 'No se ha iniciado sesión'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">{user.sessions} inicios de sesión</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Biografía</h3>
                                <p className="text-default-600 leading-relaxed">{user.biografia}</p>
                            </div>
                        </div>

                    </div>
                </CardBody>
            </Card>
            {userKey === "1" ? (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardBody className="p-0">
                        <Tabs
                            aria-label="Options" color="primary" variant="bordered"
                        >
                            <Tab
                                key="overview"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Resumen</span>
                                    </div>
                                }
                            >
                                <div className="p-6 space-y-6">

                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Shield className="w-5 h-5" />
                                            Permisos
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {rols.map((x) => (
                                                <Chip key={x} variant="flat" size="sm" className="bg-blue-50 dark:bg-blue-900/30">
                                                    {x}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>


                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="flat"
                                                startContent={<Download className="w-4 h-4" />}
                                                className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                            >
                                                Exportar datos
                                            </Button>
                                            <Button
                                                variant="flat"
                                                href='/settings'
                                                as={Link}
                                                startContent={<Settings className="w-4 h-4" />}
                                                className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                            >
                                                Configurar acceso
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            {/*<Tab
                            key="activity"
                            title={
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-4 h-4" />
                                    <span>Actividad</span>
                                </div>
                            }
                        >
                            <div className="p-6">
                                <div className="space-y-4">

                                    <div key="1" className="flex gap-4 p-4 rounded-xl bg-default-50 dark:bg-default-900/30">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">Eliminar</h4>
                                            <p className="text-sm text-default-500 mt-1">detalles1234</p>
                                            <p className="text-xs text-default-400 mt-2">
                                                {new Date().toLocaleString("es-ES")}
                                            </p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </Tab>*/}
                        </Tabs>
                    </CardBody>
                </Card>
            ) : null}



            <UserModal
                isOpen={isCreateOpen}
                onClose={() => {
                    onCreateClose()
                }}
                user={user}
                operation='UPDATE'
                userId={user.user_id}
            />
            <CommonModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                title={
                    <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger" /> Confirmar eliminación</div>}
                body={
                    <p className="text-default-500">
                        ¿Estás seguro de que deseas eliminar al usuario{" "}
                        <span className="font-semibold text-foreground">{user?.name} {user?.last_name}</span>? Esta acción no se puede
                        deshacer.
                    </p>
                }
                footer={
                    <>
                        <Button variant="light" onPress={onDeleteClose}>Cancelar</Button>
                        <Button color="danger" >Eliminar permanentemente</Button>
                    </>
                }
            />
        </div>
    )
}

export default DetailsUser;