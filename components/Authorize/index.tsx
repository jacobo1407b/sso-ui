"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Shield, CheckCircle, Mail, User, Lock, Database } from "lucide-react";

import UserInformation from "./UserInformation"
import AppInformation from "./AppInformation"

import { AutorizeAction } from "@/actions/loginAction"

interface OAuthConsentProps {
  // Información de la aplicación solicitante
  appName: string
  appLogo?: string
  appDescription: string

  // Información del usuario
  userName: string
  userEmail: string
  userAvatar?: string

  clientId: string
  // Permisos solicitados
  requestedScopes?: Array<{
    scope: string
    name: string
    description: string
    icon: any
    required: boolean
  }>
  state: string
}

function OAuthConsent({
  appName,
  appLogo,
  appDescription,
  userName,
  userEmail,
  userAvatar,
  clientId,
  requestedScopes = [
    {
      scope: "profile",
      name: "Información del perfil",
      description: "Nombre, foto de perfil e información básica",
      icon: User,
      required: true,
    },
    {
      scope: "email",
      name: "Dirección de correo",
      description: "Tu dirección de correo electrónico",
      icon: Mail,
      required: true,
    }
  ],
  state
}: OAuthConsentProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)



  const handleApprove = async () => {
    try {
      setIsProcessing(true)
      const resp = await AutorizeAction(clientId, state);
      window.open(
        `${resp.redirectUri}?code=${resp.authorizationCode}&state=${state}`,
        "_blank"
      );
      router.push("/")
    } catch (error) {
      console.error("Error al procesar autorización:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  /*const handleDeny = () => {
    if (onDeny) {
      onDeny()
    } else {
      // Redirigir de vuelta a la app con error
      console.log("Autorización denegada")
      router.push("/")
    }
  }*/



  const requiredScopes = requestedScopes.filter((scope) => scope.required)

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="flex flex-col gap-4 pb-2 pt-6">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-default-500">
            <Lock className="w-3 h-3" />
            <span>Conexión segura</span>
          </div>
        </div>

        <AppInformation
          appDescription={appDescription}
          appLogo={appLogo}
          appName={appName}
        />
      </CardHeader>

      <CardBody className="gap-6 px-6 pb-6">
        {/* Información del usuario */}
        <UserInformation userAvatar={userAvatar} userEmail={userEmail} userName={userName} />

        {/* Permisos solicitados */}
        <div className="space-y-4">

          <div className="space-y-3">
            {/* Permisos requeridos */}
            {requiredScopes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-default-600">Permisos requeridos:</p>
                {requiredScopes.map((scope) => (
                  <div
                    key={scope.scope}
                    className="flex items-start gap-3 p-3 rounded-lg bg-default-50"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                      <scope.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{scope.name}</p>
                      </div>
                      <p className="text-xs text-default-500 mt-1">{scope.description}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
          <Button
            color="primary"
            size="lg"
            onPress={handleApprove}
            isLoading={isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            startContent={!isProcessing && <Shield className="w-5 h-5" />}
          >
            {isProcessing ? "Procesando..." : "Autorizar"}
          </Button>
        </div>



        {/* Footer con información de la sesión */}
        <div className="text-center pt-4 border-t border-default-200">
          <div className="flex items-center justify-center gap-2 text-xs text-default-400">
            <Database className="w-3 h-3" />
            <span>Los datos se comparten de forma segura mediante OAuth 2.0</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}


export default OAuthConsent