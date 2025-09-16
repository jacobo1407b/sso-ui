"use client"
import { useState } from "react";
import { UserData } from "@/types";
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Input } from "@heroui/react";
import { Button, Select, SelectItem, Avatar } from "@heroui/react";
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
  operation: "UPDATE" | "CREATE"
  user: UserData | null
}


function UserModal({ isOpen, onClose, operation, user }: UserModalProps) {
  const [userSate, setuserSate] = useState<UserData | null>(user)
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {operation === "CREATE" ? "Crear Nuevo Usuario" : "Actualizar Usuario"}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombres"
              name="name"
              defaultValue={user?.name}
              placeholder="Ingresa el nombre"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              label="Apellidos"
              name="last_name"
              defaultValue={user?.last_name}
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              name="email"
              defaultValue={user?.email}
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              label="Teléfono"
              name="phone"
              defaultValue={user?.phone}
              placeholder="+612 345 678"
              startContent={<Phone className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <div className="space-y-2">

              <Select
                className="max-w-xs"
                defaultSelectedKeys={[user?.userBusiness.department ?? ""]}
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
              defaultSelectedKeys={[user?.userBusiness.job_title ?? ""]}
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
            {operation === "CREATE" ? "Crear" : "Actualizar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserModal;