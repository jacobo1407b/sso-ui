"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Link } from "@heroui/link"
import { Avatar } from "@heroui/avatar"
import { Chip } from "@heroui/chip"
import { Checkbox } from "@heroui/checkbox"
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Mail,
  User,
  ExternalLink,
  Lock,
  Globe,
  Database,
} from "lucide-react"

interface OAuthConsentProps {
  // Información de la aplicación solicitante
  appName?: string
  appLogo?: string
  appDescription?: string
  appDeveloper?: string
  appWebsite?: string

  // Información del usuario
  userName?: string
  userEmail?: string
  userAvatar?: string

  // Permisos solicitados
  requestedScopes?: Array<{
    scope: string
    name: string
    description: string
    icon: any
    required: boolean
  }>

  // Callbacks
  onApprove?: (approvedScopes: string[]) => void
  onDeny?: () => void
  onGoBack?: () => void
}

function OAuthConsent({
  appName = "MiApp Empresarial",
  appLogo = "https://archive.trufflesuite.com/assets/logo.png",
  appDescription = "Aplicación de gestión empresarial para equipos de trabajo",
  appDeveloper = "TechCorp Solutions",
  appWebsite = "https://miapp.com",
  userName = "Ana García",
  userEmail = "ana.garcia@empresacorp.com",
  userAvatar = "https://randomuser.me/api/portraits/women/64.jpg",
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
  onApprove,
  onDeny,
  onGoBack,
}: OAuthConsentProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedScopes, setSelectedScopes] = useState<string[]>(
    requestedScopes.filter((scope) => scope.required).map((scope) => scope.scope),
  )
  const [showDetails, setShowDetails] = useState(false)

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      setSelectedScopes([...selectedScopes, scope])
    } else {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope))
    }
  }

  const handleApprove = async () => {
    setIsProcessing(true)

    try {
      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (onApprove) {
        onApprove(selectedScopes)
      } else {
        // Simular redirección de vuelta a la app con código de autorización
        console.log("Autorización aprobada con scopes:", selectedScopes)
        // En producción esto redirigiría de vuelta a la aplicación con el código
        router.push("/")
      }
    } catch (error) {
      console.error("Error al procesar autorización:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeny = () => {
    if (onDeny) {
      onDeny()
    } else {
      // Redirigir de vuelta a la app con error
      console.log("Autorización denegada")
      router.push("/")
    }
  }

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.push("/login")
    }
  }

  const requiredScopes = requestedScopes.filter((scope) => scope.required)
  const optionalScopes = requestedScopes.filter((scope) => !scope.required)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="flex flex-col gap-4 pb-2 pt-6">
          {/* Header con botón de regreso */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-default-500">
              <Lock className="w-3 h-3" />
              <span>Conexión segura</span>
            </div>
          </div>

          {/* Información de la aplicación */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar
                  src={appLogo}
                  size="lg"
                  name={appName}
                  className="w-20 h-20 shadow-lg border-4 border-white dark:border-slate-700"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <Globe className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
              <p className="text-sm text-default-500 mt-1">{appDescription}</p>
              {/*<div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-default-400">por {appDeveloper}</span>
                <Link href={appWebsite} size="sm" isExternal className="text-xs">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>*/}
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="text-center space-y-2 pt-2">
            <h2 className="text-lg font-semibold text-foreground">
              <span className="text-blue-600 dark:text-blue-400">{appName}</span> quiere acceder a tu cuenta
            </h2>
            <p className="text-sm text-default-500">
              Esta aplicación solicita permisos para acceder a tu información de EmpresaCorp
            </p>
          </div>
        </CardHeader>

        <CardBody className="gap-6 px-6 pb-6">
          {/* Información del usuario */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Avatar src={userAvatar} size="md" name={userName} />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{userName}</p>
              <p className="text-sm text-default-500">{userEmail}</p>
            </div>
            <Chip size="sm" color="success" variant="flat">
              Conectado
            </Chip>
          </div>

          {/* Permisos solicitados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Esta aplicación podrá:</h3>
              <Button
                size="sm"
                variant="light"
                onPress={() => setShowDetails(!showDetails)}
                className="text-blue-600 dark:text-blue-400"
              >
                {showDetails ? "Ocultar detalles" : "Ver detalles"}
              </Button>
            </div>

            <div className="space-y-3">
              {/* Permisos requeridos */}
              {requiredScopes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-default-600">Permisos requeridos:</p>
                  {requiredScopes.map((scope) => (
                    <div
                      key={scope.scope}
                      className="flex items-start gap-3 p-3 rounded-lg bg-default-50 dark:bg-default-900/30"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                        <scope.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{scope.name}</p>
                        </div>
                        {showDetails && <p className="text-xs text-default-500 mt-1">{scope.description}</p>}
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    </div>
                  ))}
                </div>
              )}


            </div>
          </div>

          {/* Advertencia de seguridad */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">Información importante</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Solo autoriza aplicaciones en las que confíes. Puedes revocar estos permisos en cualquier momento
                  desde tu configuración de cuenta.
                </p>
              </div>
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

          {/* Enlaces adicionales */}
          <div className="flex justify-center gap-4 text-xs text-default-500 pt-2">
            <Link href="/privacy" size="sm">
              Política de Privacidad
            </Link>
            <span>•</span>
            <Link href="/terms" size="sm">
              Términos de Uso
            </Link>
            <span>•</span>
            <Link href="/help" size="sm">
              Ayuda
            </Link>
          </div>

          {/* Footer con información de la sesión */}
          <div className="text-center pt-4 border-t border-default-200 dark:border-default-700">
            <div className="flex items-center justify-center gap-2 text-xs text-default-400">
              <Database className="w-3 h-3" />
              <span>Los datos se comparten de forma segura mediante OAuth 2.0</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}


export default OAuthConsent