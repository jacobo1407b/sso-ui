"use client"

import Link from "next/link";
import { useDisclosure, Card, CardBody, TableHeader, TableBody, Table, Pagination, TableColumn } from "@heroui/react";
import { Tooltip, TableRow, TableCell, Input, Button } from "@heroui/react";

import { Crown, SearchIcon, Trash2, Eye, Pencil } from "lucide-react";
import UserModal from "./Modal";
import DeleteModal from "./Delete";


function Rols() {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Roles</h1>
          <p className="text-default-500 mt-1">Administrar Roles y accesos</p>
        </div>

      </div>
      {/*Buscador */}
      <div className="flex justify-between gap-3 items-end">

        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          variant="bordered"
        />

        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<Crown className="w-5 h-5" />}
            onPress={onCreateOpen}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
          >
            Crear Rol
          </Button>
        </div>
      </div>
      {/* Tabla de usuarios */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardBody className="p-0">
          <Table
            aria-label="Tabla de usuarios"
            bottomContent={
              <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={1}
                  total={1}
                />
                <span className="text-small text-default-400">Total: 20</span>
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn>ROL NAME</TableColumn>
              <TableColumn>ROL CODE</TableColumn>
              <TableColumn>FECHA DE CREACION</TableColumn>
              <TableColumn>CREADO POR</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>SSO_ADMIN</TableCell>
                <TableCell>SSO ADMINISTRADOR</TableCell>
                <TableCell>19 Julio 2025</TableCell>
                <TableCell>System</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Editar">
                      <span onClick={onEditOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Pencil />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <span onClick={onDeleteOpen} className="text-lg text-danger cursor-pointer active:opacity-50">
                        <Trash2 />
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <UserModal
        isOpen={isCreateOpen}
        onClose={() => {
          onCreateClose()
        }}
      />

      <UserModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose()
        }}
      />

      <DeleteModal isOpen={isDeleteOpen} onClose={onDeleteClose} />
    </div>
  )
}

export default Rols