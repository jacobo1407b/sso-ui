"use client"
import { useRouter } from 'next/navigation';
import { useDisclosure, Button, Card, CardBody, Avatar, Chip, Progress, Tabs, Tab } from "@heroui/react";
import { ArrowLeft, Edit, Trash2, User, Mail, MapPin, Calendar, Phone, Activity, Clock, Eye, Shield } from "lucide-react";
import { Download, Settings } from "lucide-react";

import DeleteModal from "./Delete";
import UserModal from "./Modal";

function DetailsUser() {
    const router = useRouter();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="flat"
                        onPress={() => router.back()}
                        className="bg-default-100 hover:bg-default-200 rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Detalles del Usuario</h1>
                        <p className="text-default-500 mt-1">Información completa y actividad del usuario</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="flat"
                        onPress={onCreateOpen}
                        startContent={<Edit className="w-4 h-4" />}
                        className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    >
                        Editar
                    </Button>
                    <Button onPress={onDeleteOpen} color="danger" variant="flat" startContent={<Trash2 className="w-4 h-4" />}>
                        Eliminar
                    </Button>
                </div>
            </div>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar y información básica */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-32 h-32" name="Jacobo" />
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-foreground">Jacobo Hernandez</h2>
                                <p className="text-default-500 text-lg">Tech consultant</p>
                                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                    {/*<Chip color={roleColorMap[user.role]} variant="flat" size="sm">
                                        {user.role === "admin" ? "Administrador" : user.role === "moderator" ? "Moderador" : "Usuario"}
                                    </Chip>*/}
                                    <Chip color="primary" variant="flat" size="sm">
                                        active
                                    </Chip>
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
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">jhernandez@test.com</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">241-208-9096</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">Apizaco</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">
                                                Miembro desde {new Date().toLocaleDateString("es-ES")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Estadísticas
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
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
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">
                                                Último acceso: {new Date().toLocaleString("es-ES")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-default-500" />
                                            <span className="text-foreground">{20} inicios de sesión</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Biografía</h3>
                                <p className="text-default-600 leading-relaxed">Administradora de sistemas con más de 5 años de experiencia en gestión de infraestructura y equipos de desarrollo.</p>
                            </div>
                        </div>

                    </div>
                </CardBody>
            </Card>
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

                                        <Chip key="adm" variant="flat" size="sm" className="bg-blue-50 dark:bg-blue-900/30">
                                            adm
                                        </Chip>
                                        <Chip key="adm" variant="flat" size="sm" className="bg-blue-50 dark:bg-blue-900/30">
                                            adm
                                        </Chip>

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
                                            startContent={<Settings className="w-4 h-4" />}
                                            className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                        >
                                            Configurar acceso
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab
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
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
            <UserModal
                isOpen={isCreateOpen}
                onClose={() => {
                    onCreateClose()
                }}
            />
            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
            />
        </div>
    )
}

export default DetailsUser;