"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { RotateCcwKey, KeySquare } from "lucide-react"
import { generatePassword } from "@/utils";

interface UserDelete {
    isOpen: boolean,
    onClose: () => void
}
function ResetPass({ isOpen, onClose }: UserDelete) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <RotateCcwKey className="w-5 h-5 text-danger" />
                        Reset Password
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <Input
                            value={generatePassword(16)}
                            label="Contraseña"
                            isDisabled
                            startContent={<KeySquare className="w-4 h-4 text-default-400" />}
                            variant="bordered"
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="danger">
                        Reset
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ResetPass;