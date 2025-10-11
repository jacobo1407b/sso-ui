import { useState, useEffect } from 'react'
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, addToast, Image } from "@heroui/react"
import { QrCode, CheckCircle, AlertTriangle, } from "lucide-react";
import { MfaTotp } from '@/types';
import { cancelTotp, validateTotp } from '@/actions/preferencesAction';



interface iTotpProps {
    isOpen: boolean;
    onClose: () => void
    setTotpEnabled: any
    topData?: MfaTotp,
    status: string,
    fails: number,
    last_attemp_date: string
}
function TotpModal({ isOpen, onClose, topData, fails, setTotpEnabled }: iTotpProps) {


    const [totpSetupStep, setTotpSetupStep] = useState<"qr" | "verify" | "complete">("qr");
    const [totpCode, setTotpCode] = useState("")
    const [totpError, setTotpError] = useState("")
    const [isVerifyingTotp, setIsVerifyingTotp] = useState(false)

    const handleVerifyTotp = async () => {
        if (totpCode.length !== 6) {
            setTotpError("El código debe tener 6 dígitos")
            return
        }

        setIsVerifyingTotp(true)
        setTotpError("")


        const resp = await validateTotp(topData?.id ?? "", totpCode)
        if (resp.code !== 200 && fails + 1 < 5) {
            setTotpError(`Código incorrecto. ${fails} fallos acumulados`)
        }
        if (resp.code !== 200 && fails + 1 === 5) {
            setTotpError(`Demasiados intentos fallidos. La configuración ha sido parcialmente bloqueada por seguridad.`)
        }
        if (resp.code === 200) {
            setTotpSetupStep("complete");
            setTotpEnabled(true);
            
        }
        setIsVerifyingTotp(false)

        // Simular validación (en producción esto sería una llamada al backend)


        /*if (isValidCode) {
            //setTotpEnabled(true)
            
            setTimeout(() => {
                //onTotpClose()
                setTotpSetupStep("qr")
                setTotpCode("")
            }, 11000)
        } else {
            setTotpError("Código incorrecto. Verifica tu aplicación autenticadora.")
        }*/

        
    }

    const handlerCancelTotp = async () => {
        console.log(await cancelTotp(topData?.id ?? ""))
        onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={fails + 1 === 5 ? onClose : undefined} size="2xl" isDismissable={false}>
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
                                    <img
                                        src={topData?.otpauth_url}
                                        alt="Código QR para autenticación"
                                        className="w-44 h-44 rounded-lg"
                                        onError={(e) => {
                                            // Fallback al QR simulado si hay error
                                            e.currentTarget.style.display = "none"
                                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                                    <strong>¿No puedes escanear el código?</strong>
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                                    {topData?.code}
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
                            <Button variant="light" onPress={handlerCancelTotp}>
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
                                isDisabled={totpCode.length !== 6 || fails + 1 === 5}
                                className="bg-gradient-to-r from-green-500 to-emerald-600"
                            >
                                {isVerifyingTotp ? "Verificando..." : "Verificar Código"}
                            </Button>
                        </>
                    )}

                    {totpSetupStep === "complete" && (
                        <Button color="success" onPress={onClose} className="w-full">
                            Finalizar
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TotpModal