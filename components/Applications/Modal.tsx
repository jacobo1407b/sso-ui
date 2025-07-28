"use client"

import { useState } from "react"
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
  Divider,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react"
import { Plus, CheckCircle, Copy, Globe, Lock, Key, Clock, Zap, Shield, EyeOff, Eye } from "lucide-react"

interface ApplicationData {
  name: string
  description: string
  environment: "development" | "staging" | "production"
  redirectUris: string[]
  scopes: string[]
  grants: GrantType[]
}

type GrantType = "authorization_code" | "client_credentials" | "password" | "refresh_token" | "implicit"

const availableGrants: { value: GrantType; label: string; description: string; icon: any }[] = [
  {
    value: "authorization_code",
    label: "Authorization Code",
    description: "Para aplicaciones web con backend seguro",
    icon: Globe,
  },
  {
    value: "client_credentials",
    label: "Client Credentials",
    description: "Para comunicación servidor a servidor",
    icon: Lock,
  },
  {
    value: "password",
    label: "Resource Owner Password",
    description: "Para aplicaciones de confianza (no recomendado)",
    icon: Key,
  },
  {
    value: "refresh_token",
    label: "Refresh Token",
    description: "Para renovar tokens de acceso automáticamente",
    icon: Clock,
  },
  {
    value: "implicit",
    label: "Implicit Grant",
    description: "Para aplicaciones SPA (obsoleto)",
    icon: Zap,
  },
]

// Componente Modal para crear aplicación
interface CreateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

function CreateApplicationModal({ isOpen, onClose }: CreateApplicationModalProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    name: "",
    description: "",
    environment: "development",
    redirectUris: [],
    scopes: [],
    grants: ["authorization_code"],
  })

  const [redirectUriInput, setRedirectUriInput] = useState("");
  const [scopesInput, setScopesInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);


  const isFormValid = formData.name.trim() !== "" && formData.grants.length > 0


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
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Aplicación OAuth
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Información Básica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre de la aplicación"
                  placeholder="Mi Aplicación Web"
                  size="sm"
                  variant="bordered"
                  isRequired
                />
              </div>
              <Input
                label="Descripción"
                placeholder="Aplicación web para gestión de usuarios..."
                variant="bordered"
              />
              <div>
                <label className="text-sm font-medium text-default-500 mb-2 block">Client ID</label>
                <div className="flex gap-2">
                  <Input
                    value="BNB4383BG843BF893HG349N"
                    isReadOnly
                    readOnly
                    size="md"
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
                        : "bg-default-100 dark:bg-default-800"
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
              <div>
                <label className="text-sm font-medium text-default-500 mb-2 block">Client Secret</label>
                <div className="flex gap-2">
                  <Input
                    size="md"
                    value={showSecret ? "GB45CT34YBUE56BUV54CT4554EC" : "•".repeat("GB45CT34YBUE56BUV54CT4554EC".length)}
                    isReadOnly
                    readOnly
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
                      variant="light"
                      onPress={() => handleCopy("GB45CT34YBUE56BUV54CT4554EC", "clientSecret")}
                      className={`${copiedField === "clientSecret"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-default-100 dark:bg-default-800"
                        }`}
                    >
                      {copiedField === "clientSecret" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </Tooltip>
                </div></div>
            </div>

            <Divider />

            {/* OAuth Grants */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                OAuth Grants
              </h4>
              <p className="text-sm text-default-500">
                Selecciona los tipos de grants que tu aplicación necesita. Cada grant tiene diferentes casos de uso.
              </p>
              <CheckboxGroup
                value={formData.grants}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, grants: value as GrantType[] }))}
                classNames={{
                  wrapper: "gap-4",
                }}
              >
                {availableGrants.map((grant) => (
                  <Checkbox key={grant.value} value={grant.value} classNames={{ wrapper: "mr-3" }}>
                    <div className="flex items-start gap-3">
                      <grant.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{grant.label}</p>
                        <p className="text-sm text-default-500">{grant.description}</p>
                      </div>
                    </div>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>

            <Divider />

            {/* Configuración OAuth */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Configuración OAuth</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    label="Redirect URI"
                    placeholder="https://miapp.com/callback&#10;https://miapp.com/auth"
                    value={redirectUriInput}
                    onValueChange={setRedirectUriInput}
                    variant="bordered"
                    type="textarea"
                  />
                </div>
                <div>
                  <Input
                    label="Scopes"
                    placeholder="read, write, admin"
                    value={scopesInput}
                    onValueChange={setScopesInput}
                    variant="bordered"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            Crear Aplicación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateApplicationModal;