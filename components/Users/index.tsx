"use client"
import Link from "next/link";
import { useDisclosure, Card, CardBody, TableHeader, TableBody, Table, Pagination, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Button, User, Chip, Tooltip, Input } from "@heroui/react"
import { UserPlus, Eye, RotateCcwKey, Trash2, SearchIcon } from "lucide-react";
import UserModal from "./Modal";
import DeleteModal from "./Delete";
import ResetPass from "./ResetPass";

export default function Users() {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-default-500 mt-1">Administra los usuarios de tu organización</p>
        </div>

      </div>
      {/* Buscador */}
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
            startContent={<UserPlus className="w-5 h-5" />}
            onPress={onCreateOpen}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
          >
            Nuevo Usuario
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
                  total={50}
                />
                <span className="text-small text-default-400">Total: 20</span>
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>PUESTO</TableColumn>
              <TableColumn>TELÉFONO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ÚLTIMO ACCESO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>
                  <User
                    avatarProps={{ radius: "lg", src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' }}
                    description="jhernandez@gmail.com"
                    name="Jacobo Hernandez"
                  >
                    jhernandez@gmail.com
                  </User>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">Tech Consultant</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize text-default-400">241-208-9096</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip className="capitalize" color="success" size="sm" variant="flat">
                    Activo
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">19 Julio 25 05:30 PM</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                      <Link href="/users/2345854" className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Eye />
                      </Link>
                    </Tooltip>
                    <Tooltip content="reset password">
                      <span onClick={onResetOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <RotateCcwKey />
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

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
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
