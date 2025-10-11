"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Tooltip, Input, Chip, Divider, useDisclosure } from "@heroui/react";
import { ArrowLeft, Trash2, Settings, CheckCircle, Copy, EyeOff, Eye } from "lucide-react";
import { Shield, Plus, Globe, Edit, AlertTriangle } from "lucide-react";
import { Lock, Key, Clock } from "lucide-react";

import Grants from "./Grants";
import CommonModal from '@/components/Common/CommonModal';
import Modal from "./Modal";
import { clientApp, Grant } from "@/types";


interface iDetailsProps {
    appOne: clientApp
    list: Array<Grant>
}

function getIcon(icontext: string) {
    switch (icontext) {
        case "Globe":
            return <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400"  />
        case "Lock":
            return <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        case "Key":
            return <Key className="w-5 h-5 text-blue-600 dark:text-blue-400"  />
        case "Clock":
            return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400"  />
        default:
            return "";
    }
}

export default function DetailsApp({ appOne, list }: iDetailsProps) {

    const router = useRouter();

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isGrantsOpen, onOpen: onGrantsOpen, onClose: onGrantsClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [showSecret, setShowSecret] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
        } catch (err) {
            console.error("Error al copiar:", err)
        }
    }

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
                        <h1 className="text-3xl font-bold text-foreground">Detalles de Aplicación</h1>
                        <p className="text-default-500 mt-1">Configuración y credenciales de la aplicación</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!appOne.is_active && (
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={onDeleteOpen}
                            startContent={<Trash2 className="w-4 h-4" />}>
                            Eliminar
                        </Button>
                    )}

                    <Button
                        variant="flat"
                        startContent={<Edit className="w-4 h-4" />}
                        onPress={onEditOpen}
                        className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    >
                        Editar
                    </Button>
                </div>
            </div>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{appOne.app_name}</h2>
                                <p className="text-default-500 mt-1">{appOne.description}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información básica */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Información General</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-default-500">Propietario</label>
                                    <p className="text-foreground">{appOne.created_by}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-default-500">Creada el</label>
                                    <p className="text-foreground">{new Date().toLocaleDateString("es-ES")}</p>
                                </div>

                            </div>
                        </div>

                        {/* Credenciales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Credenciales</h3>
                            <div className="space-y-4">
                                {/* Client ID */}
                                <div>
                                    <label className="text-sm font-medium text-default-500 mb-2 block">Client ID</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={appOne.client_id}
                                            isReadOnly
                                            variant="bordered"
                                            classNames={{
                                                input: "font-mono text-sm",
                                            }}
                                        />
                                        <Tooltip content={copiedField === "clientId" ? "¡Copiado!" : "Copiar Client ID"}>
                                            <Button
                                                isIconOnly
                                                variant="flat"
                                                onPress={() => handleCopy(appOne.client_id, "clientId")}
                                                className={`${copiedField === "clientId"
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                    : "bg-default-100"
                                                    }`}
                                            >
                                                {copiedField === "clientId" ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Client Secret */}
                                <div>
                                    <label className="text-sm font-medium text-default-500 mb-2 block">Client Secret</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={showSecret ? appOne.client_secret : "•".repeat(appOne.client_secret.length)}
                                            isReadOnly
                                            variant="bordered"
                                            classNames={{
                                                input: "font-mono text-sm",
                                            }}
                                            endContent={
                                                <Button isIconOnly variant="light" size="sm" onPress={() => setShowSecret(!showSecret)}>
                                                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                            }
                                        />
                                        <Tooltip content={copiedField === "clientSecret" ? "¡Copiado!" : "Copiar Client Secret"}>
                                            <Button
                                                isIconOnly
                                                variant="flat"
                                                onPress={() => handleCopy(appOne.client_secret, "clientSecret")}
                                                className={`${copiedField === "clientSecret"
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                    : "bg-default-100"
                                                    }`}
                                            >
                                                {copiedField === "clientSecret" ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            {/* Grants y configuración */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OAuth Grants */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                OAuth Grants
                            </h3>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={onGrantsOpen}
                                startContent={<Plus className="w-4 h-4" />}
                                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            >
                                Gestionar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody className="pt-0 ">
                        <div className="space-y-3">
                            {appOne.grants?.map((x) => {
                                return (
                                    <div
                                        key={x.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-default-50"
                                    >
                                        {getIcon(x.icon_text)}

                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{x.grants_name}</p>
                                            <p className="text-sm text-default-500">{x.description}</p>
                                        </div>
                                    </div>
                                )
                            }) ?? null}
                        </div>

                    </CardBody>
                </Card>

                {/* Configuración adicional */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold text-foreground">Configuración</h3>
                    </CardHeader>
                    <CardBody className="pt-0 space-y-4">
                        {/* Redirect URIs */}
                        <div>
                            <label className="text-sm font-medium text-default-500 mb-2 block">Redirect URI</label>
                            <div className="space-y-2">

                                <div key="1" className="flex items-center gap-2">
                                    <Chip variant="flat" size="sm" className="font-mono text-xs">
                                        {appOne.redirect_callback}
                                    </Chip>
                                </div>

                            </div>
                        </div>

                        <Divider />

                        {/* Scopes */}
                        {/**
                         * <div>
                            <label className="text-sm font-medium text-default-500 mb-2 block">Scopes</label>
                            <div className="flex flex-wrap gap-2">

                                <Chip key={"read"} color="primary" variant="flat" size="sm">
                                    read
                                </Chip>
                            </div>
                        </div>
                         */}

                    </CardBody>
                </Card>
            </div>

            <Grants
                isOpen={isGrantsOpen}
                onClose={onGrantsClose}
                currentGrants={appOne?.grants?.map((x) => x.id) ?? []}
                listGrants={list}
                client_id={appOne.client_id}
            />
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
                appData={appOne}
                selectedGrants={appOne?.grants?.map((x) => x.id) ?? []}
                imageDownloaded={appOne.client_icon_url}
                listGrants={list}
            />

            <CommonModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                title={
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-danger" />
                        Confirmar eliminación
                    </div>}
                body={
                    <p className="text-default-500">
                        ¿Estás seguro de que deseas eliminar la aplicación{" "}
                        <span className="font-semibold text-foreground">{appOne.app_name}</span>? Esta acción no se puede
                        deshacer y se revocarán todas las credenciales asociadas.
                    </p>
                }
                footer={
                    <>
                        <Button variant="light" onPress={onDeleteClose}>
                            Cancelar
                        </Button>
                        <Button color="danger" >
                            Eliminar permanentemente
                        </Button>
                    </>
                }
            />
        </div>
    )
}
