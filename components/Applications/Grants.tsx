"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, addToast } from "@heroui/react";
import { Shield } from "lucide-react";
import GrantsCheck from "../Common/GrantsCheck";
import { SetGrants } from "@/actions/clientAction";
import { Grant } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { handleError } from "@/lib/errorHandler";


interface GrantsModalProps {
    isOpen: boolean
    onClose: () => void
    currentGrants: Array<string>,
    listGrants: Array<Grant>
    client_id: string
}

function GrantsModal({ isOpen, onClose, currentGrants, listGrants, client_id }: GrantsModalProps) {
    const [selectedGrants, setSelectedGrants] = useState<Array<string>>(currentGrants)
    const [errorGrants, seterrorGrants] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handlerChange = async () => {
        try {
            if (selectedGrants.length == 0) {
                seterrorGrants('Seleccione un Grant')
            } else {
                setIsLoading(true)
                seterrorGrants('')
                const deletes = currentGrants
                    .filter(id => !selectedGrants.includes(id))
                    .map(id => ({ grant: id, type: "DELETE" }));

                const inserts = selectedGrants
                    .filter(id => !currentGrants.includes(id))
                    .map(id => ({ grant: id, type: "UPDATE" }));

                const resultado = [...deletes, ...inserts];
                if (resultado.length !== 0) {
                    const payload = {
                        grantsType: resultado
                    }
                    await fetcher(() => SetGrants(client_id, payload));

                    addToast({
                        title: "correcto",
                        description: "Cambios guardados exitosamente",
                        color: "success",
                        variant: "solid"
                    });
                    onClose()
                }

            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setIsLoading(false)
        }

        //handleSave
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
                        listGrants={listGrants}

                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isLoading}
                        onPress={handlerChange}
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