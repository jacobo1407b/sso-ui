"use client"
import Link from "next/link";
import { useState } from "react";
import { useDisclosure, Button } from "@heroui/react";
import { User, Chip, Tooltip } from "@heroui/react"
import { UserPlus, Eye, RotateCcwKey, Trash2, AlertTriangle } from "lucide-react";

import CommonModal from '@/components/Common/CommonModal'
import UserModal from "./Modal";

import ResetPass from "./ResetPass";

import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import { UserData } from "@/types";

const mockUsers = [
  {
    user_id: "usr_001",
    username: "jacobo.hernandez",
    name: "Jacobo",
    last_name: "Hernández",
    second_last_name: "Mendieta",
    email: "jacobo@example.com",
    phone: "+52 55 1234 5678",
    profile_picture: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "active",
    last_login: "2025-08-23T14:00:00Z",
    userBusiness: {
      job_title: "Consultor tecnico"
    }
  },
  {
    user_id: "usr_002",
    username: "mariana.lopez",
    name: "Mariana",
    last_name: "López",
    second_last_name: "Ramírez",
    email: "mariana@example.com",
    phone: "+52 55 9876 5432",
    profile_picture: "https://randomuser.me/api/portraits/women/11.jpg",
    status: "inactive",
    last_login: "2025-07-15T09:30:00Z",
    userBusiness: {
      job_title: "Consultor funcional"
    }
  },
  {
    user_id: "usr_003",
    username: "carlos.torres",
    name: "Carlos",
    last_name: "Torres",
    second_last_name: "Gómez",
    email: "carlos@example.com",
    phone: "+52 55 1122 3344",
    profile_picture: "https://randomuser.me/api/portraits/men/49.jpg",
    status: "active",
    last_login: "2025-09-10T18:45:00Z",
    userBusiness: {
      job_title: "Compras"
    }
  }
];


export default function Users() {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const [currentUser, setcurrentUser] = useState<UserData | null>(null)

  const handlerDeteleUser = (user: any) => {
    setcurrentUser(user)
    onDeleteOpen();
  }
  return (
    <div className="flex flex-col gap-4">
      <UserManagementHeader
        subtitle="Administra los usuarios de tu organización"
        title="Gestión de Usuarios" />

      <ReusableTableCard
        searchPlaceholder="Buscar por nombre"
        columns={[
          { key: "name", label: "NOMBRE" },
          { key: "role", label: "PUESTO" },
          { key: "phone", label: "TELÉFONO" },
          { key: "status", label: "ESTADO" },
          { key: "lastAccess", label: "ÚLTIMO ACCESO" },
          { key: "actions", label: "ACCIONES" },
        ]}
        //https://i.pravatar.cc/150?u=a042581f4e29026024d
        data={mockUsers}
        rowKey={(row) => row.user_id}
        renderRow={(row) => [
          <User
            avatarProps={{
              radius: "lg",
              src: row.profile_picture,
            }}
            name={row.name}
            description={row.email}
          />,
          <p className="text-bold text-sm capitalize">{row.userBusiness.job_title}</p>,
          <p className="text-bold text-sm capitalize text-default-400">{row.phone}</p>,
          <Chip className="capitalize" color="success" size="sm" variant="flat">
            {row.status}
          </Chip>,
          <p className="text-bold text-sm capitalize">{row.last_login}</p>,
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Link href={`/users/${row.user_id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </Link>
            </Tooltip>
            <Tooltip content="reset password">
              <span onClick={onResetOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <RotateCcwKey />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span onClick={() => handlerDeteleUser(row)} className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 />
              </span>
            </Tooltip>
          </div>,
        ]}
        pagination={{
          page: 1,
          total: mockUsers.length,
          onChange: (p) => console.log("Page:", p),
        }}
        totalCount={20}
        addButton={{
          label: "Nuevo Usuario",
          onClick: () => onCreateOpen(),
          icon: <UserPlus className="w-5 h-5" />,
        }}
      />


      <UserModal
        isOpen={isCreateOpen}
        onClose={() => {
          onCreateClose()
        }}
        operation="CREATE"
        user={null}
      />

      <CommonModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger" /> Confirmar eliminación</div>}
        body={
          <p className="text-default-500">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <span className="font-semibold text-foreground">{currentUser?.name} {currentUser?.last_name}</span>? Esta acción no se puede
            deshacer.
          </p>
        }
        footer={
          <>
            <Button variant="light" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" >Eliminar permanentemente</Button>
          </>
        }
      />


      <ResetPass
        isOpen={isResetOpen}
        onClose={onResetClose} />

      {/* Modal de confirmación de eliminación 
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              Confirmar eliminación
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-default-500">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <span className="font-semibold text-foreground">{selectedUser?.name}</span>? Esta acción no se puede
              deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleConfirmDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>*/}
    </div>
  )
}
