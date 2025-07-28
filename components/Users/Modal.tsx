"use client"
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Input } from "@heroui/react";
import { Button, Select, SelectItem } from "@heroui/react";
import { Avatar } from "@heroui/react"
import {
  UserPlus,
  Mail,
  Phone,
  Pickaxe,
  User,
  Building2
} from "lucide-react"



interface UserModalProps {
  isOpen: boolean
  onClose: () => void
}


function UserModal({ isOpen, onClose }: UserModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Crear Nuevo Usuario
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              placeholder="Ingresa el nombre"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              label="Apellidos"
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              label="Teléfono"
              placeholder="+34 612 345 678"
              startContent={<Phone className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <div className="space-y-2">

              <Select
                className="max-w-xs"
                label="Seleccionar departamento"
                startContent={<Building2 className="w-4 h-4 text-default-400" />}
                isClearable={true} size="sm">
                <SelectItem
                  key="argentina"
                  startContent={
                    <Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />
                  }
                >
                  Argentina
                </SelectItem>
              </Select>
              
            </div>
            <Select
                className="max-w-xs"
                label="Seleccionar puesto"
                startContent={<Pickaxe className="w-4 h-4 text-default-400" />}
                isClearable={true} size="sm">
                <SelectItem
                  key="argentina"
                >
                  Tecnico
                </SelectItem>
              </Select>
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
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserModal;