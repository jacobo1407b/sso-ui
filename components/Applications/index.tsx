"use client"
import Link from "next/link";
import { Card, CardBody, TableHeader, TableBody, Table, Pagination, TableColumn, TableRow, TableCell } from "@heroui/react";
import { useDisclosure, Tooltip, Input } from "@heroui/react";
import { Trash2, Eye, Pencil, SearchIcon, PlusIcon, Globe, Settings } from "lucide-react";
import UserModal from "./Modal";
import Delete from "./Delete";
import ApplicationEditModal from "./Edit";

import { Button } from '@heroui/button';

function Aplication() {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Aplicaciones</h1>
          <p className="text-default-500 mt-1">Administra aplicaciones y accesos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="font-medium text-foreground">Flexible</p>
            <p className="text-default-500">Múltiples tipos de grants OAuth 2.0</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="font-medium text-foreground">Configurable</p>
            <p className="text-default-500">Scopes y permisos personalizables</p>
          </div>
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
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={onCreateOpen}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl"
          >
            Crear Aplicación
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
                  page={5}
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
              <TableColumn>DESCRIPCION</TableColumn>
              <TableColumn>CLIENTE</TableColumn>
              <TableColumn>FECHA DE CREACION</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>SSO</TableCell>
                <TableCell>Aplicacion principal SSO</TableCell>
                <TableCell>9476938GU94TU349H32F9U</TableCell>
                <TableCell>07 Julio 2025</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                      <Link href="/aplications/645634V6456G34F53" className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Eye />
                      </Link>
                    </Tooltip>
                    <Tooltip content="reset password">
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
      <Delete isOpen={isDeleteOpen} onClose={onDeleteClose} />
      <ApplicationEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        application={{
          id: "app_001xjK92",
          name: "SSO Admin Portal",
          description: "Panel centralizado para gestión de usuarios y sesiones SSO.",
          clientId: "sso-client-abc123",
          clientSecret: "Xz8#pLw45@tR12Vq",
          status: "active",
          createdAt: "2024-10-18T15:35:00Z",
          lastUsed: "2025-07-15T09:22:10Z",
          grants: ["authorization_code", "refresh_token"],
          redirectUris: [
            "https://admin.sso-platform.com/callback",
            "https://dev.sso-platform.com/callback"
          ],
          scopes: ["openid", "profile", "email", "admin"],
          owner: "jacobo.mtz@org.com",
          environment: "production"
        }}
      />
    </div>
  )
}

export default Aplication