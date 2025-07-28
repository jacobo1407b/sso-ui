"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Tooltip, Input, Chip, Divider, useDisclosure } from "@heroui/react";
import { ArrowLeft, Trash2, Settings, CheckCircle, Copy, EyeOff, Eye } from "lucide-react";
import { Shield, Plus, Globe, Edit } from "lucide-react";
import Grants from "./Grants";
import Delete from "./Delete";
import ApplicationEditModal from "./Edit";

export default function DetailsApp() {

    const router = useRouter();

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isGrantsOpen, onOpen: onGrantsOpen, onClose: onGrantsClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [showSecret, setShowSecret] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const handleSaveGrants = () => {

    }
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
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={onDeleteOpen}
                        startContent={<Trash2 className="w-4 h-4" />}>
                        Eliminar
                    </Button>
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
                                <h2 className="text-2xl font-bold text-foreground">SSO</h2>
                                <p className="text-default-500 mt-1">Single SignOut</p>
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
                                    <p className="text-foreground">System</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-default-500">Creada el</label>
                                    <p className="text-foreground">{new Date().toLocaleDateString("es-ES")}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-default-500">Último uso</label>
                                    <p className="text-foreground">{new Date().toLocaleString("es-ES")}</p>
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
                                            value="BNB4383BG843BF893HG349N"
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
                                                onPress={() => handleCopy("BNB4383BG843BF893HG349N", "clientId")}
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
                                            value={showSecret ? "GB45CT34YBUE56BUV54CT4554EC" : "•".repeat("GB45CT34YBUE56BUV54CT4554EC".length)}
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
                                                onPress={() => handleCopy("GB45CT34YBUE56BUV54CT4554EC", "clientSecret")}
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

                            <div
                                key="1"
                                className="flex items-center gap-3 p-3 rounded-lg bg-default-50"
                            >
                                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">password</p>
                                    <p className="text-sm text-default-500">Para comunicación servidor a servidor</p>
                                </div>
                            </div>
                            <div
                                key="2"
                                className="flex items-center gap-3 p-3 rounded-lg bg-default-50"
                            >
                                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">password</p>
                                    <p className="text-sm text-default-500">Para comunicación servidor a servidor</p>
                                </div>
                            </div>
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
                            <label className="text-sm font-medium text-default-500 mb-2 block">Redirect URIs</label>
                            <div className="space-y-2">

                                <div key="1" className="flex items-center gap-2">
                                    <Chip variant="flat" size="sm" className="font-mono text-xs">
                                        https://app.empresacorp.com/callback
                                    </Chip>
                                </div>

                            </div>
                        </div>

                        <Divider />

                        {/* Scopes */}
                        <div>
                            <label className="text-sm font-medium text-default-500 mb-2 block">Scopes</label>
                            <div className="flex flex-wrap gap-2">

                                <Chip key={"read"} color="primary" variant="flat" size="sm">
                                    read
                                </Chip>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Grants
                isOpen={isGrantsOpen}
                onClose={onGrantsClose}
                currentGrants={[]}
                onSave={handleSaveGrants}
            />
            <ApplicationEditModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                application={{
                    id: "app_001xjK92",
                    name: "SSO Admin Portal",
                    description: "Panel centralizado para gestión de usuarios y sesiones SSO.",
                    clientId: "sso-client-abc123",
                    clientSecret: "Xz8#pLw45@tR12Vq",
                    status: "active",
                    createdAt: "2024-10-18T15:35:00Z",
                    lastUsed: "2025-07-15T09:22:10Z",
                    grants: ["authorization_code", "refresh_token"],
                    redirectUris: [
                        "https://admin.sso-platform.com/callback",
                        "https://dev.sso-platform.com/callback"
                    ],
                    scopes: ["openid", "profile", "email", "admin"],
                    owner: "jacobo.mtz@org.com",
                    environment: "production"
                }}
            />
            <Delete
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
            />
        </div>
    )
}
