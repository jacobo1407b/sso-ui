"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Chip, Tooltip, useDisclosure } from "@heroui/react"
import { UserPlus, Eye, RotateCcwKey } from "lucide-react";
import AvatarCustom from "../Avatar";

import UserModal from "./Modal";
import { formateaFechaRelativa } from "@/utils";

import ResetPass from "./ResetPass";

import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import {GetAll} from "@/actions/userAction";




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
  last_update_avatar: number | null
  userBusiness: UserBusiness
}

interface UserBusiness {
  job_title: string
}


export default function Users(artifact: iUsersProps) {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const [userId, setUserId] = useState("");

  const [userData, setUserData] = useState<Array<usersList>>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1)


  useEffect(() => {
    setUserData(artifact.users);
    setTotalPages(artifact.totalCount);
    setPageSize(artifact.pageSize)
    setCurrentPage(artifact.page)
  }, [])


  const handlerReset = (userId: string) => {
    setUserId(userId);
    onResetOpen()
  }

  const handlerNavigation = async (page: number) => {
    const result = await GetAll(page, artifact.pageSize);
    setUserData(result.data);
    setTotalPages(result.totalCount);
    setPageSize(result.pageSize);
    setCurrentPage(result.page);
  }
  const handlerSearch = async (value: string) => {
    const result = await GetAll(1, artifact.pageSize, value ?? undefined);
    setUserData(result.data);
    setTotalPages(result.data.length === 0 ? 1 : result.data.length);
    setPageSize(result.pageSize);
    setCurrentPage(result.page);
  }

  return (
    <div className="flex flex-col gap-4">
      <UserManagementHeader
        subtitle="Administra los usuarios de tu organización"
        title="Gestión de Usuarios" />

      <ReusableTableCard
        onSearch={handlerSearch}
        searchPlaceholder="Buscar por nombre"
        columns={[
          { key: "name", label: "NOMBRE" },
          { key: "role", label: "PUESTO" },
          { key: "phone", label: "TELÉFONO" },
          { key: "status", label: "ESTADO" },
          { key: "lastAccess", label: "ÚLTIMO ACCESO" },
          { key: "actions", label: "ACCIONES" },
        ]}
        data={userData}
        rowKey={(row) => row.user_id}
        renderRow={(row) => [
          <AvatarCustom
            profile_picture={row.profile_picture}
            last_update_avatar={row.last_update_avatar}
            email={row.email}
            name={row.name}
            user_id={row.user_id}
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
          page: currentPage,
          total: Math.ceil(totalPages / pageSize),
          onChange: handlerNavigation,
        }}
        totalCount={totalPages}
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
