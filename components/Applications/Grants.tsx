"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, CheckboxGroup, Checkbox, ModalFooter, Button } from "@heroui/react";
import { Shield, Globe, Lock, Key, Clock, Zap } from "lucide-react";

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
type GrantType = "authorization_code" | "client_credentials" | "password" | "refresh_token" | "implicit"

interface GrantsModalProps {
    isOpen: boolean
    onClose: () => void
    currentGrants: GrantType[]
    onSave: (grants: GrantType[]) => void
}

function GrantsModal({ isOpen, onClose, currentGrants, onSave }: GrantsModalProps) {
    const [selectedGrants, setSelectedGrants] = useState<GrantType[]>(currentGrants)

    const handleSave = () => {
        onSave(selectedGrants)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Gestionar OAuth Grants
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <p className="text-default-500">
                            Selecciona los tipos de grants OAuth que esta aplicación puede utilizar. Cada grant tiene diferentes casos
                            de uso y niveles de seguridad.
                        </p>
                        <CheckboxGroup
                            value={selectedGrants}
                            onValueChange={(value) => setSelectedGrants(value as GrantType[])}
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
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSave}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                        Guardar cambios
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default GrantsModal;