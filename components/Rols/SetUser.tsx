import { UserData } from '@/types';
import { useState } from 'react';

import { Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Avatar, CheckboxGroup, Checkbox } from "@heroui/react";
import { UserPlus, Search, UserCheck } from "lucide-react";


interface AddUsersModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    availableUsers: UserData[]
    selectedUsers: string[]
    onSelectionChange: (users: string[]) => void
    isSetting: boolean
}

function SetUser({ isOpen, onClose, onSave, availableUsers, selectedUsers, onSelectionChange, isSetting }: AddUsersModalProps) {

    const [searchQuery, setSearchQuery] = useState("")

    const filteredUsers = availableUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleSave = () => {
        onSave()
        setSearchQuery("")
    }

    const handleClose = () => {
        onClose()
        setSearchQuery("")
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Agregar Usuarios al Rol
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            placeholder="Buscar usuarios disponibles..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            startContent={<Search className="w-4 h-4 text-default-400" />}
                            variant="bordered"
                            isClearable
                            onClear={() => setSearchQuery("")}
                        />

                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <UserCheck className="w-12 h-12 text-default-300 mx-auto mb-4" />
                                    <p className="text-default-500">
                                        {searchQuery ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                                    </p>
                                </div>
                            ) : (
                                <CheckboxGroup
                                    value={selectedUsers}
                                    onValueChange={onSelectionChange}
                                    classNames={{
                                        wrapper: "gap-2",
                                    }}
                                >
                                    {filteredUsers.map((user) => (
                                        <Checkbox key={user.user_id} value={user.user_id} classNames={{ wrapper: "mr-3" }}>
                                            <div className="flex items-center gap-3 p-2">
                                                <Avatar src={user.profile_picture} size="sm" name={user.name} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    <p className="text-sm text-default-500">{user.email}</p>
                                                    {
                                                        user?.userBusiness?.department && (
                                                            <Chip size="sm" variant="flat" className="mt-1">
                                                                {user.userBusiness.department}
                                                            </Chip>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            )}
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    <strong>{selectedUsers.length}</strong> usuario{selectedUsers.length > 1 ? "s" : ""} seleccionado
                                    {selectedUsers.length > 1 ? "s" : ""}
                                </p>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isSetting}
                        onPress={handleSave}
                        isDisabled={selectedUsers.length === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                        Agregar {selectedUsers.length} Usuario{selectedUsers.length > 1 ? "s" : ""}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SetUser