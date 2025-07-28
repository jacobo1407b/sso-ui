"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
interface UserDelete {
    isOpen: boolean,
    onClose: () => void
}
function DeleteModal({ isOpen, onClose }: UserDelete) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-danger" />
                        Confirmar eliminación
                    </div>
                </ModalHeader>
                <ModalBody>
                    <p className="text-default-500">
                        ¿Estás seguro de que deseas eliminar la aplicación{" "}
                        <span className="font-semibold text-foreground">SSO</span>? Esta acción no se puede
                        deshacer y se revocarán todas las credenciales asociadas.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="danger" >
                        Eliminar permanentemente
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteModal;