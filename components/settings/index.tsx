"use client"

import { useState } from "react"
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Switch,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    RadioGroup,
    Radio,
    Divider,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Chip,
    Avatar,
    Select,
    SelectItem
} from "@heroui/react"
import {
    Globe,
    Palette,
    Monitor,
    Sun,
    Moon,
    Save,
    RotateCcw,
    Shield,
    Key,
    Eye,
    EyeOff,
    QrCode,
    Fingerprint,
    Activity,
    CheckCircle,
    Trash2,
    RefreshCw,
    AlertTriangle,
} from "lucide-react"
import UserManagementHeader from "../Common/UserManagementHeader";


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


function Settings() {
    // Estados para las preferencias básicas
    const [language, setLanguage] = useState("es")
    const [theme, setTheme] = useState("system")
    const [accentColor, setAccentColor] = useState("blue")

    // Estados para seguridad
    const [totpEnabled, setTotpEnabled] = useState(false)
    const [totpSetupStep, setTotpSetupStep] = useState<"qr" | "verify" | "complete">("qr")
    const [totpCode, setTotpCode] = useState("")
    const [totpError, setTotpError] = useState("")
    const [isVerifyingTotp, setIsVerifyingTotp] = useState(false)
    const [totpSecret] = useState("JBSWY3DPEHPK3PXP") // En producción esto vendría del backend
    const [webauthnEnabled, setWebauthnEnabled] = useState(true)
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


    /*const accentColors = [
        { key: "blue", label: "Azul", color: "bg-blue-500" },
        { key: "indigo", label: "Índigo", color: "bg-indigo-500" },
        { key: "slate", label: "Pizarra", color: "bg-slate-500" },
        { key: "emerald", label: "Esmeralda", color: "bg-emerald-500" },
        { key: "orange", label: "Naranja", color: "bg-orange-500" },
        { key: "purple", label: "Púrpura", color: "bg-purple-500" },
    ]*/

    // Sesiones activas simuladas
    const activeSessions = [
        {
            id: 1,
            device: "Chrome en Windows 11",
            location: "Madrid, España",
            ip: "192.168.1.100",
            lastActive: "Activo ahora",
            current: true,
        },
        {
            id: 2,
            device: "Safari en iPhone 15",
            location: "Madrid, España",
            ip: "192.168.1.101",
            lastActive: "Hace 2 horas",
            current: false,
        },
        {
            id: 3,
            device: "Edge en Surface Pro",
            location: "Barcelona, España",
            ip: "10.0.0.45",
            lastActive: "Hace 1 día",
            current: false,
        },
    ]

    const handleSavePreferences = () => {
        console.log("Guardando preferencias...")
    }

    const handleResetPreferences = () => {
        console.log("Restaurando valores por defecto...")
    }

    const handlePasswordChange = () => {
        console.log("Cambiando contraseña:", passwordForm)
        // Reset form
        setPasswordForm({ current: "", new: "", confirm: "" })
    }

    const handleTerminateSession = (sessionId: number) => {
        console.log("Terminando sesión:", sessionId)
    }

    const handleSetupTotp = () => {
        setTotpSetupStep("qr")
        setTotpCode("")
        setTotpError("")
        onTotpOpen()
    }

    const handleVerifyTotp = async () => {
        if (totpCode.length !== 6) {
            setTotpError("El código debe tener 6 dígitos")
            return
        }

        setIsVerifyingTotp(true)
        setTotpError("")

        // Simular verificación del código TOTP
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simular validación (en producción esto sería una llamada al backend)
        const isValidCode = totpCode === "123456" // Código de prueba

        if (isValidCode) {
            setTotpEnabled(true)
            setTotpSetupStep("complete")
            setTimeout(() => {
                onTotpClose()
                setTotpSetupStep("qr")
                setTotpCode("")
            }, 11000)
        } else {
            setTotpError("Código incorrecto. Verifica tu aplicación autenticadora.")
        }

        setIsVerifyingTotp(false)
    }

    const handleDisableTotp = () => {
        setTotpEnabled(false)
        console.log("TOTP deshabilitado")
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
                            variant="flat"
                            startContent={<RotateCcw className="w-4 h-4" />}
                            onPress={handleResetPreferences}
                            className="bg-default-100 dark:bg-default-800"
                        >
                            Restaurar
                        </Button>
                        <Button
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
                                    //selectedKeys={value}
                                    variant="bordered"
                                //onSelectionChange={setValue}
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
                                    onValueChange={setTheme}
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
                            onValueChange={(checked) => {
                                if (checked) {
                                    handleSetupTotp()
                                } else {
                                    handleDisableTotp()
                                }
                            }}
                            color="success"
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
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<RefreshCw className="w-4 h-4" />}
                            className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        >
                            Actualizar
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="pt-0">
                    <div className="space-y-4">
                        {activeSessions.map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-default-50 to-default-100 dark:from-default-900/30 dark:to-default-800/30 border border-default-200 dark:border-default-700 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        icon={<Monitor className="w-5 h-5" />}
                                        size="lg"
                                        classNames={{
                                            base: "bg-indigo-100 dark:bg-indigo-900/30 shadow-sm",
                                            icon: "text-indigo-600 dark:text-indigo-400",
                                        }}
                                    />
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-foreground text-lg">{session.device}</h3>
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
                                            {session.location} • {session.ip}
                                        </p>
                                        <p className="text-xs text-default-400 mt-1">{session.lastActive}</p>
                                    </div>
                                </div>
                                {!session.current && (
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        startContent={<Trash2 className="w-4 h-4" />}
                                        onPress={() => handleTerminateSession(session.id)}
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

            {/* Modal TOTP Setup */}
            <Modal isOpen={isTotpOpen} onClose={onTotpClose} size="2xl" isDismissable={false}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            Configurar Aplicación Autenticadora
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {totpSetupStep === "qr" && (
                            <div className="text-center space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Paso 1: Escanea el código QR</h3>
                                    <p className="text-sm text-default-500 mb-4">
                                        Abre tu aplicación autenticadora (Google Authenticator, Authy, Microsoft Authenticator) y escanea
                                        este código QR
                                    </p>
                                    <div className="w-48 h-48 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-default-200 shadow-lg">
                                        <div className="w-44 h-44 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                            <div className="grid grid-cols-8 gap-1">
                                                {/* Simulación de QR Code */}
                                                {Array.from({ length: 64 }).map((_, i) => (
                                                    <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                                        <strong>¿No puedes escanear el código?</strong>
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                                        {totpSecret}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        Ingresa este código manualmente en tu aplicación
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-foreground">Aplicaciones recomendadas:</h4>
                                    <div className="flex justify-center gap-4 text-xs">
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-1">
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">G</span>
                                            </div>
                                            <span className="text-default-500">Google Auth</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-1">
                                                <span className="text-red-600 dark:text-red-400 font-bold">A</span>
                                            </div>
                                            <span className="text-default-500">Authy</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-1">
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">M</span>
                                            </div>
                                            <span className="text-default-500">Microsoft</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {totpSetupStep === "verify" && (
                            <div className="text-center space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Paso 2: Verifica el código</h3>
                                    <p className="text-sm text-default-500 mb-6">
                                        Ingresa el código de 6 dígitos que aparece en tu aplicación autenticadora
                                    </p>

                                    <div className="max-w-xs mx-auto space-y-4">
                                        <Input
                                            label="Código de verificación"
                                            placeholder="000000"
                                            value={totpCode}
                                            onValueChange={(value) => {
                                                setTotpCode(value.replace(/\D/g, "").slice(0, 6))
                                                if (totpError) setTotpError("")
                                            }}
                                            variant="bordered"
                                            size="lg"
                                            maxLength={6}
                                            classNames={{
                                                input: "text-center text-2xl font-mono tracking-widest",
                                                inputWrapper: totpError ? "border-danger" : "",
                                            }}
                                            isInvalid={!!totpError}
                                            errorMessage={totpError}
                                        />

                                        {totpError && (
                                            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
                                                <p className="text-sm text-danger-600 dark:text-danger-400 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {totpError}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        <strong>Consejo:</strong> Los códigos cambian cada 30 segundos. Asegúrate de usar el código más
                                        reciente.
                                    </p>
                                </div>
                            </div>
                        )}

                        {totpSetupStep === "complete" && (
                            <div className="text-center space-y-6 py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">¡Configuración completada!</h3>
                                    <p className="text-sm text-default-500">
                                        Tu aplicación autenticadora ha sido configurada correctamente. Tu cuenta ahora está protegida con
                                        autenticación de dos factores.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        <strong>Importante:</strong> Guarda códigos de respaldo en un lugar seguro para recuperar el acceso
                                        si pierdes tu dispositivo.
                                    </p>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {totpSetupStep === "qr" && (
                            <>
                                <Button variant="light" onPress={onTotpClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => setTotpSetupStep("verify")}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600"
                                >
                                    Continuar
                                </Button>
                            </>
                        )}

                        {totpSetupStep === "verify" && (
                            <>
                                <Button variant="light" onPress={() => setTotpSetupStep("qr")} isDisabled={isVerifyingTotp}>
                                    Atrás
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleVerifyTotp}
                                    isLoading={isVerifyingTotp}
                                    isDisabled={totpCode.length !== 6}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                                >
                                    {isVerifyingTotp ? "Verificando..." : "Verificar Código"}
                                </Button>
                            </>
                        )}

                        {totpSetupStep === "complete" && (
                            <Button color="success" onPress={onTotpClose} className="w-full">
                                Finalizar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal WebAuthn Setup */}
            <Modal isOpen={isWebauthnOpen} onClose={onWebauthnClose} size="2xl">
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
            </Modal>
        </div>
    )
}

export default Settings