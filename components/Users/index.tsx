"use client"
import Link from "next/link";
import { useState } from "react";
import { useDisclosure, Button } from "@heroui/react";
import { User, Chip, Tooltip } from "@heroui/react"
import { UserPlus, Eye, RotateCcwKey, Trash2, AlertTriangle } from "lucide-react";

import CommonModal from '@/components/Common/CommonModal'
import UserModal from "./Modal";
import { formateaFechaRelativa } from "@/utils";

import ResetPass from "./ResetPass";

import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import { UserData } from "@/types";



interface iUsersProps {
  users: Array<usersList>,
  page: number,
  pageSize: number,
  totalCount: number
}
interface usersList {
  user_id: string
  username: string
  name: string
  last_name: string
  second_last_name: string
  email: string
  phone: string
  profile_picture: string
  status: string
  last_login: string
  userBusiness: UserBusiness
}

interface UserBusiness {
  job_title: string
}


export default function Users(artifact: iUsersProps) {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  //const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const [currentUser, setcurrentUser] = useState<UserData | null>(null);
  const [userId, setUserId] = useState("");

  /*const handlerDeteleUser = (user: any) => {
    setcurrentUser(user)
    onDeleteOpen();
  }*/

  const handlerReset = (userId: string) => {
    setUserId(userId);
    onResetOpen()
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
        data={artifact.users}
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
          <p className="text-bold text-sm capitalize">{row?.userBusiness?.job_title}</p>,
          <p className="text-bold text-sm capitalize text-default-400">{row.phone}</p>,
          <Chip className="capitalize" color="success" size="sm" variant="flat">
            {row.status}
          </Chip>,
          <p className="text-bold text-sm capitalize">{formateaFechaRelativa(row.last_login)}</p>,
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Link href={`/users/${row.user_id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </Link>
            </Tooltip>
            <Tooltip content="reset password">
              <span onClick={() => handlerReset(row.user_id)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <RotateCcwKey />
              </span>
            </Tooltip>
            {/*row.name == "false" && (
              <Tooltip color="danger" content="Delete user">
                <span onClick={() => handlerDeteleUser(row)} className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2 />
                </span>
              </Tooltip>
            )*/}

          </div>,
        ]}
        pagination={{
          page: artifact.page,
          total: Math.ceil(artifact.totalCount / artifact.pageSize),
          onChange: (p) => console.log("Page:", p),
        }}
        totalCount={artifact.totalCount}
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
        userId=""
      />

      {/**
       * <CommonModal
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
       */}


      <ResetPass
        isOpen={isResetOpen}
        onClose={onResetClose}
        userId={userId}
      />

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
