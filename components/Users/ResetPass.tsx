"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, addToast } from "@heroui/react";
import { RotateCcwKey, KeySquare } from "lucide-react"
import { generatePassword } from "@/utils";
import { setPassword } from "@/actions/createUser";

interface UserDelete {
    isOpen: boolean,
    onClose: () => void,
    userId: string
}

function ResetPass({ isOpen, onClose, userId }: UserDelete) {
    const [password] = useState(generatePassword(16));
    const [isLoading, setIsLoading] = useState(false)

    const onUpdatePass = async () => {
        try {
            setIsLoading(true)
            const result = await setPassword(userId, password);
            if (result.code !== 201) throw new Error("NA");
            addToast({
                title: "Correcto",
                description: "Contraseña actualizada",
                color: "success",
                variant: "solid"
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: error.message,
                description: error.message,
                color: "danger",
                variant: "solid"
            });
        } finally {
            setIsLoading(false)
        }

    }
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
                            value={password}
                            label="Contraseña"
                            isReadOnly
                            startContent={<KeySquare className="w-4 h-4 text-default-400" />}
                            variant="bordered"
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="danger" isLoading={isLoading} onPress={onUpdatePass}>
                        Reset
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ResetPass;