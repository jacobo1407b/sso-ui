"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Shield } from "lucide-react";
import GrantsCheck from "../Common/GrantsCheck";


interface GrantsModalProps {
    isOpen: boolean
    onClose: () => void
    currentGrants: Array<string>
}

function GrantsModal({ isOpen, onClose, currentGrants }: GrantsModalProps) {
    const [selectedGrants, setSelectedGrants] = useState<Array<string>>(currentGrants)
    const [errorGrants, seterrorGrants] = useState("")

    const handleSave = () => {
        if(selectedGrants.length === 0){
            seterrorGrants("Seleccionar un permiso")
        }
        seterrorGrants("")
        //onSave(selectedGrants)
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
                    <GrantsCheck
                        selectedGrants={selectedGrants}
                        setGroupSelected={setSelectedGrants}
                        operationType="UPDATE"
                        errorMsg={errorGrants}
                    />
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