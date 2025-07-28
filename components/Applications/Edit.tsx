"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Dropdown } from "@heroui/react";
import { DropdownTrigger, Button, DropdownMenu, DropdownItem, Divider, ModalFooter } from "@heroui/react";
import { Edit } from "lucide-react";

type GrantType = "authorization_code" | "client_credentials" | "password" | "refresh_token" | "implicit"

interface ApplicationData {
    id: string
    name: string
    description: string
    clientId: string
    clientSecret: string
    status: "active" | "inactive" | "suspended"
    createdAt: string
    lastUsed: string
    grants: GrantType[]
    redirectUris: string[]
    scopes: string[]
    owner: string
    environment: "development" | "staging" | "production"
}

interface ApplicationEditModalProps {
    isOpen: boolean
    onClose: () => void
    application: ApplicationData
    //onSave: (application: Partial<ApplicationData>) => void
}

function ApplicationEditModal({ isOpen, onClose, application }: ApplicationEditModalProps) {
    const [formData, setFormData] = useState({
        name: application.name,
        description: application.description,
        status: application.status,
        environment: application.environment,
        redirectUris: application.redirectUris.join("\n"),
        scopes: application.scopes.join(", "),
    })

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Editar Aplicación
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre de la aplicación"
                                size="sm"
                                variant="bordered"
                                isRequired
                            />

                        </div>

                        <Input
                            label="Descripción"
                            value={formData.description}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                            variant="bordered"
                            placeholder="Descripción de la aplicación..."
                        />


                        <Divider />

                        {/* Configuración OAuth */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Configuración OAuth</h4>

                            <div>
                                <Input
                                    label="Redirect URI"
                                    variant="bordered"
                                    placeholder="https://app.ejemplo.com/callback"
                                    type="textarea"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Scopes"
                                    variant="bordered"
                                    placeholder="read, write, admin"
                                    description="Separados por comas"
                                />
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
                        Guardar cambios
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ApplicationEditModal;
