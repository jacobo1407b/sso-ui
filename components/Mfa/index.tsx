"use client"

import type React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Shield, Smartphone, Key, Fingerprint } from "lucide-react";
import { validateTotp } from "@/actions/preferencesAction";
import { refreshMfa } from "@/actions/loginAction";

interface MfaVerificationProps {
  userEmail?: string
  userName?: string
  userAvatar?: string
  availableMethods?: ("totp" | "webauthn" | "sms")[]
  totp_id: string
  callbackUrl?: string
}

export default function MfaVerification({
  userEmail,
  userName,
  userAvatar,
  availableMethods,
  totp_id,
  callbackUrl
}: MfaVerificationProps) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedMethod, setSelectedMethod] = useState<"totp" | "webauthn" | "sms">("totp")
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 5

  // Countdown timer para el código
  useEffect(() => {
    if (selectedMethod === "totp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setTimeLeft(30) // Reset timer
    }
  }, [timeLeft, selectedMethod])

  const handleCodeChange = (value: string) => {
    // Solo permitir números y máximo 6 dígitos
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setCode(numericValue)
    if (error) setError("")
  }

  const handleVerification = async () => {
    if (code.length !== 6) {
      setError("El código debe tener 6 dígitos")
      return
    }

    if (attempts >= maxAttempts) {
      setError("Demasiados intentos fallidos. Inténtalo más tarde.")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      // Simular llamada a API
      const resp = await validateTotp(totp_id, code);
      console.log(resp)
      //cerrar session y mandar a loguin y limpiar el state if(resp.code === 401)
      if (resp.code == 403 && resp.name === "ERR_2FA_TOTP") {

        setAttempts(attempts + 1)
        setError(`Código incorrecto. ${maxAttempts - attempts - 1} intentos restantes.`)
        setCode("")
      }
      if (resp.code === 403 && resp.name === "ERR_2FA_TOTP_MAX_ATTEMPTS" || resp.name === "ERR_2FA_TOTP_LOCKED") {
        setAttempts(4)
        setError(`Demasiados intentos fallidos: usuario bloqueado temporalmente`)
        setCode("")
      }

      if (resp.code === 200) {
        await refreshMfa();
        const url = callbackUrl || "/";
        router.push(url);
      }

    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleWebAuthn = async () => {
    setIsVerifying(true)
    setError("")

    try {
      // Simular WebAuthn
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En producción aquí iría la lógica de WebAuthn

      router.push("/")

    } catch (err) {
      setError("Error con la autenticación biométrica. Usa otro método.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length === 6 && !isVerifying) {
      handleVerification()
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="flex flex-col gap-4 pb-2 pt-8">
        {/* Logo y botón de regreso */}


        {/* Información del usuario */}
        <div className="text-center space-y-3">
          <Avatar src={userAvatar} size="lg" name={userName} className="mx-auto" />
          <div>
            <p className="text-sm text-default-500">{userEmail}</p>
          </div>
        </div>

        {/* Título */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-2xl font-bold text-foreground">Verificación Requerida</h1>
          <p className="text-sm text-default-500">Tu cuenta está protegida con autenticación de dos factores</p>
        </div>
      </CardHeader>

      <CardBody className="gap-6 px-8 pb-8">
        {/* Métodos disponibles */}
        <div className="flex gap-2 justify-center">
          {(availableMethods?.length ?? 0) > 1 && availableMethods?.map((method) => (
            <Button
              key={method}
              disabled={method === "webauthn" ? true : false}
              size="sm"
              variant={selectedMethod === method ? "solid" : "flat"}
              color={selectedMethod === method ? "primary" : "default"}
              onPress={() => setSelectedMethod(method)}
              startContent={
                method === "totp" ? (
                  <Smartphone className="w-4 h-4" />
                ) : method === "webauthn" ? (
                  <Fingerprint className="w-4 h-4" />
                ) : (
                  <Key className="w-4 h-4" />
                )
              }
            >
              {method === "totp" ? "App" : method === "webauthn" ? "Biométrico" : "SMS"}
            </Button>
          ))}
        </div>

        {selectedMethod === "totp" && (
          <div className="space-y-6">
            {/* Campo de código */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-default-600 mb-4">
                  Ingresa el código de 6 dígitos de tu aplicación autenticadora
                </p>
              </div>

              <Input
                placeholder="000000"
                value={code}
                onValueChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                variant="bordered"
                size="lg"
                maxLength={6}
                startContent={<Key className="w-5 h-5 text-default-400" />}
                classNames={{
                  input: "text-center text-2xl font-mono tracking-widest",
                  inputWrapper: `border-2 ${error
                    ? "border-danger"
                    : code.length === 6
                      ? "border-success"
                      : "hover:border-blue-300 focus-within:border-blue-500"
                    } bg-white dark:bg-slate-700`,
                }}
                isInvalid={!!error}
                errorMessage={error}
              />
            </div>

            {/* Botón de verificación */}
            <Button
              color="primary"
              size="lg"
              isLoading={isVerifying}
              isDisabled={code.length !== 6 || attempts >= maxAttempts}
              onPress={handleVerification}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              startContent={!isVerifying && <Shield className="w-5 h-5" />}
            >
              {isVerifying ? "Verificando..." : "Verificar Código"}
            </Button>

            {/* Información adicional */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">¿No ves el código?</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Abre tu aplicación autenticadora (Google Authenticator, Authy, Microsoft Authenticator) y busca
                      la entrada de EmpresaCorp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === "webauthn" && (
          <div className="space-y-6 text-center">
            <div className="py-8">
              <Fingerprint className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Autenticación Biométrica</h3>
              <p className="text-sm text-default-500 mb-6">
                Usa tu huella dactilar, Face ID, Touch ID o llave de seguridad para continuar
              </p>
            </div>

            <Button
              color="primary"
              size="lg"
              isLoading={isVerifying}
              onPress={handleWebAuthn}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              startContent={!isVerifying && <Fingerprint className="w-5 h-5" />}
            >
              {isVerifying ? "Autenticando..." : "Usar Autenticación Biométrica"}
            </Button>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-400">
                <strong>Dispositivos compatibles:</strong> Touch ID, Face ID, Windows Hello, YubiKey, Google Titan
              </p>
            </div>
          </div>
        )}


        {/* Footer con información de seguridad */}
        <div className="text-center pt-4 border-t border-default-200 dark:border-default-700">
          <div className="flex items-center justify-center gap-2 text-xs text-default-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Conexión segura - Tu información está protegida</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
