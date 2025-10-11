"use client"

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardBody, CardHeader, Button, Switch, RadioGroup, Radio, Divider, Input, useDisclosure, Chip, Avatar, Select, SelectItem, addToast } from "@heroui/react"
import { Globe, Palette, Monitor, Sun, Moon, Save, Shield, Key, Eye, EyeOff, QrCode, Fingerprint, Activity, CheckCircle, Trash2, ShieldAlert } from "lucide-react"
import UserManagementHeader from "../Common/UserManagementHeader";
import TotpModal from "./Totp";
import { MfaTotp, UserDetails } from "@/types";
import { deleteSessionAction, cancelTotp } from "@/actions/preferencesAction";
import { totpAction, putPreferences } from '@/actions/preferencesAction';
import { generateQr, formateaFechaRelativa } from "@/utils";


const supportedLanguages = [
    {
        code: "en",
        name: "English",
        flag: "/us.svg"
    },
    {
        code: "es",
        name: "Español",
        flag: "/mx.svg"
    },
    {
        code: "pt",
        name: "Português",
        flag: "/br.svg"
    },
    {
        code: "fr",
        name: "Français",
        flag: "/fr.svg"
    },
    {
        code: "de",
        name: "Deutsch",
        flag: "/de.svg"
    }
];

interface iSettingsProps {
    data: UserDetails
}

function Settings({ data }: iSettingsProps) {
    // Estados para las preferencias básicas
    const [language, setLanguage] = useState(data.preferences.lang)
    const [theme, setThemePage] = useState(data.preferences.theme)
    const [isChangePreferences, setIsChangePreferences] = useState(false);
    const { setTheme } = useTheme();

    // Estados para seguridad
    const [totpEnabled, setTotpEnabled] = useState(data.totp?.verified_status === "VERIFIED" ? true : false);
    const [topData, setTopData] = useState<MfaTotp>();



    // En producción esto vendría del backend

    const [webauthnEnabled, setWebauthnEnabled] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Estados para formularios
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        new: "",
        confirm: "",
    })

    // Modales
    const { isOpen: isTotpOpen, onOpen: onTotpOpen, onClose: onTotpClose } = useDisclosure()
    const { isOpen: isWebauthnOpen, onOpen: onWebauthnOpen, onClose: onWebauthnClose } = useDisclosure()



    const handlerLanguage = (e: any) => {
        setLanguage(e.target.value)
    }
    const handleSavePreferences = async () => {
        if (language !== data.preferences.lang || theme !== data.preferences.theme) {
            setIsChangePreferences(true);
            const pref = await putPreferences(data.preferences.id, {
                theme,
                lang: language
            });
            if (pref.code === 201) {
                setTheme(theme);
                setIsChangePreferences(false);
            }

        }
    }



    const handlePasswordChange = () => {
        console.log("Cambiando contraseña:", passwordForm)
        // Reset form
        setPasswordForm({ current: "", new: "", confirm: "" })
    }

    const handleTerminateSession = async (sessionId: string) => {
        try {
            const resp = await deleteSessionAction(sessionId)
            if (resp.code !== 201) throw new Error("NA")
            addToast({
                title: "Correcto",
                description: 'Session terminada',
                color: "success",
                variant: "solid"
            });
        } catch (error: any) {
            addToast({
                title: error.message,
                description: error.message,
                color: "danger",
                variant: "solid"
            });
        }
    }

    const handleSetupTotp = async () => {
        const fa = await totpAction();
        const url = await generateQr(fa.data.otpauth_url)
        setTopData({
            ...fa.data,
            otpauth_url: url
        })
        onTotpOpen()
    }
    const compareFailetDate = (fecha: string | undefined) => {
        const now = new Date().getTime();
        const fail = new Date(fecha ?? "").getTime();

        if (fail > now) return true;
        return false;
    }


    const handleDisableTotp = async () => {

        await cancelTotp(data.totp?.id ?? "")
        setTotpEnabled(false)
    }

    const handleSetupWebauthn = () => {
        setWebauthnEnabled(true)
        onWebauthnClose()
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <UserManagementHeader
                subtitle="Gestiona tus preferencias personales y configuración de seguridad"
                title="Configuración de Cuenta"
                actions={
                    <div className="flex gap-3">
                        <Button
                            isLoading={isChangePreferences}
                            color="primary"
                            startContent={<Save className="w-4 h-4" />}
                            onPress={handleSavePreferences}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                }
            />




            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Preferencias Generales */}
                <div className="space-y-6">
                    {/* Idioma */}
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                        <CardHeader className="pb-3">
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Idioma y Región
                            </h2>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-3 block">Idioma de la interfaz</label>
                                <Select
                                    className="max-w-xs"
                                    placeholder="Select an language"
                                    selectedKeys={[language]}
                                    variant="bordered"
                                    onChange={handlerLanguage}
                                    aria-label="d"
                                >
                                    {supportedLanguages.map((country) => (
                                        <SelectItem key={country.code}
                                            startContent={
                                                <Avatar alt={country.name} className="w-6 h-6" src={country.flag} />
                                            }>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <p className="text-xs text-default-500 mt-2">Los cambios se aplicarán después de recargar la página</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Apariencia */}
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                        <CardHeader className="pb-3">
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                Apariencia
                            </h2>
                        </CardHeader>
                        <CardBody className="pt-0 space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-4 block">Tema del sistema</label>
                                <RadioGroup
                                    value={theme}
                                    onValueChange={setThemePage}
                                    orientation="horizontal"
                                    classNames={{ wrapper: "gap-6" }}
                                >
                                    <Radio value="light" classNames={{ wrapper: "mr-3" }}>
                                        <div className="flex items-center gap-2">
                                            <Sun className="w-4 h-4" />
                                            <span className="font-medium">Claro</span>
                                        </div>
                                    </Radio>
                                    <Radio value="dark" classNames={{ wrapper: "mr-3" }}>
                                        <div className="flex items-center gap-2">
                                            <Moon className="w-4 h-4" />
                                            <span className="font-medium">Oscuro</span>
                                        </div>
                                    </Radio>
                                    <Radio value="system" classNames={{ wrapper: "mr-3" }}>
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4" />
                                            <span className="font-medium">Sistema</span>
                                        </div>
                                    </Radio>
                                </RadioGroup>
                            </div>

                            <Divider />

                            {/*<div>
                                <label className="text-sm font-medium text-foreground mb-4 block">Color de acento</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {accentColors.map((color) => (
                                        <button
                                            key={color.key}
                                            onClick={() => setAccentColor(color.key)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${accentColor === color.key
                                                ? "border-current shadow-lg scale-105"
                                                : "border-default-200 dark:border-default-700 hover:border-default-300 hover:scale-102"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full ${color.color} shadow-md`} />
                                                <span className="text-sm font-medium">{color.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>*/}
                        </CardBody>
                    </Card>
                </div>

                {/* Seguridad */}
                <div className="space-y-6">
                    {/* Cambiar Contraseña */}
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                        <CardHeader className="pb-3">
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                Cambiar Contraseña
                            </h2>
                        </CardHeader>
                        <CardBody className="pt-0 space-y-6">
                            <Input
                                label="Contraseña actual"
                                placeholder="Ingresa tu contraseña actual"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.current}
                                onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, current: value }))}
                                variant="bordered"
                                size="lg"
                                startContent={<Key className="w-4 h-4 text-default-400" />}
                                endContent={
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="w-4 h-4 text-default-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-default-400" />
                                        )}
                                    </Button>
                                }
                                classNames={{
                                    inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                                }}
                            />

                            <Input
                                label="Nueva contraseña"
                                placeholder="Ingresa tu nueva contraseña"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordForm.new}
                                onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, new: value }))}
                                variant="bordered"
                                size="lg"
                                startContent={<Key className="w-4 h-4 text-default-400" />}
                                endContent={
                                    <Button isIconOnly variant="light" size="sm" onPress={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? (
                                            <EyeOff className="w-4 h-4 text-default-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-default-400" />
                                        )}
                                    </Button>
                                }
                                classNames={{
                                    inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                                }}
                            />

                            <Input
                                label="Confirmar nueva contraseña"
                                placeholder="Confirma tu nueva contraseña"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordForm.confirm}
                                onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, confirm: value }))}
                                variant="bordered"
                                size="lg"
                                startContent={<Key className="w-4 h-4 text-default-400" />}
                                endContent={
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4 text-default-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-default-400" />
                                        )}
                                    </Button>
                                }
                                classNames={{
                                    inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                                }}
                            />

                            <div className="pt-2">
                                <Button
                                    color="primary"
                                    size="lg"
                                    onPress={handlePasswordChange}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    isDisabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                                    startContent={<Key className="w-5 h-5" />}
                                >
                                    Actualizar Contraseña
                                </Button>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    <strong>Recomendaciones:</strong> Usa al menos 8 caracteres, incluye mayúsculas, minúsculas, números y
                                    símbolos especiales.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                </div>
            </div>
            {/* Autenticación Multifactor */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        Autenticación Multifactor
                    </h2>
                </CardHeader>
                <CardBody className="pt-0 space-y-6">
                    {/* TOTP */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 shadow-sm">
                                <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Aplicación Autenticadora</h3>
                                <p className="text-sm text-default-500">Google Authenticator, Authy, etc.</p>
                                {totpEnabled && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            Configurado y activo
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Switch
                            isSelected={totpEnabled}
                            isDisabled={compareFailetDate(data.totp?.last_attempt_date)}
                            onValueChange={(checked) => {
                                if (checked) {
                                    handleSetupTotp()
                                } else {
                                    handleDisableTotp()
                                }
                            }}
                            color={data.totp?.verified_status === "VERIFIED" ? "success" : "danger"}
                            size="lg"
                        />
                    </div>

                    {/* WebAuthn */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 shadow-sm">
                                <Fingerprint className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Llaves de Seguridad</h3>
                                <p className="text-sm text-default-500">YubiKey, Touch ID, Windows Hello</p>
                                {webauthnEnabled && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            Configurado y activo
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Switch
                            isDisabled
                            isSelected={webauthnEnabled}
                            onValueChange={webauthnEnabled ? undefined : onWebauthnOpen}
                            color="success"
                            size="lg"
                        />
                    </div>

                    {(totpEnabled || webauthnEnabled) && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Tu cuenta está protegida con MFA</span>
                            </div>
                        </div>
                    )}
                    {
                        compareFailetDate(data.totp?.last_attempt_date) && (
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-sm font-medium">Por seguridad, se ha bloqueado temporalmente la configuración de autenticación multifactor (MFA) debido a múltiples intentos fallidos.</span>
                                </div>
                            </div>

                        )
                    }
                </CardBody>
            </Card>
            {/* Sesiones Activas */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            Sesiones Activas
                        </h2>
                        {/*<Button
                            size="sm"
                            variant="flat"
                            startContent={<RefreshCw className="w-4 h-4" />}
                            className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        >
                            Actualizar
                        </Button>*/}
                    </div>
                </CardHeader>
                <CardBody className="pt-0">
                    <div className="space-y-4">
                        {data.sesions.map((session) => (
                            <div
                                key={session.token_id}
                                className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-default-50 to-default-100 border border-default-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        icon={<Monitor className="w-5 h-5" />}
                                        size="lg"
                                        
                                    />
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-foreground text-lg">{session.agent}</h3>
                                            {session.current && (
                                                <Chip
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    startContent={<div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                                                >
                                                    Sesión actual
                                                </Chip>
                                            )}
                                        </div>
                                        <p className="text-sm text-default-600 font-medium">
                                            • {session.ip_address}
                                        </p>
                                        <p className="text-xs text-default-400 mt-1">{formateaFechaRelativa(session.created_date)}</p>
                                    </div>
                                </div>
                                {!session.current && (
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        startContent={<Trash2 className="w-4 h-4" />}
                                        onPress={() => handleTerminateSession(session.token_id)}
                                        className="hover:bg-danger-100 dark:hover:bg-danger-900/30"
                                    >
                                        Terminar
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            <TotpModal
                isOpen={isTotpOpen}
                onClose={onTotpClose}
                setTotpEnabled={setTotpEnabled}
                topData={topData}
                status={data.totp?.verified_status ?? "UNVERIFIED"}
                fails={data.totp?.failed_attempts ?? 0}
                last_attemp_date={data.totp?.last_attempt_date ?? ""}
            />
            {/* Modal WebAuthn Setup */}
            {/*<Modal isOpen={isWebauthnOpen} onClose={onWebauthnClose} size="2xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-5 h-5" />
                            Configurar Llave de Seguridad
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="text-center space-y-6">
                            <div>
                                <Fingerprint className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Registrar dispositivo de seguridad</h3>
                                <p className="text-sm text-default-500">
                                    Conecta tu llave de seguridad USB, usa Touch ID, Face ID, o Windows Hello para completar el registro
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <p className="text-sm text-purple-700 dark:text-purple-400">
                                    <strong>Dispositivos compatibles:</strong> YubiKey, Google Titan, Touch ID, Face ID, Windows Hello,
                                    Android Fingerprint
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onWebauthnClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleSetupWebauthn}>
                            Registrar Dispositivo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>*/}
        </div>
    )
}

export default Settings