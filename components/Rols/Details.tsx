"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader, Button, Chip, useDisclosure, Tabs, Tab, addToast } from "@heroui/react";
import { ArrowLeft, Shield, Users, AlertTriangle, Eye, Crown } from "lucide-react";
import { setUseRolAction } from "@/actions/rolsAction";
import { RolDetails, UserData, UserRol } from "@/types"
import Permisions from "./Permisions";
import RolUser from "./RolUser";
import SetUser from "./SetUser"







interface RoleDetailsProps {
  roleId: string,
  rolData: RolDetails,
  users: Array<UserData>
}

export default function RoleDetails({ roleId, rolData, users }: RoleDetailsProps) {
  const router = useRouter()
  const [role, setRole] = useState<RolDetails | null>(null)
  const [isSetting, setIsSetting] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<UserRol[]>([])
  const [availableUsers, setAvailableUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { isOpen: isAddUsersOpen, onOpen: onAddUsersOpen, onClose: onAddUsersClose } = useDisclosure()

  // Simular carga de datos
  useEffect(() => {
    const loadRoleData = async () => {
      //await new Promise((resolve) => setTimeout(resolve, 1000))
      setRole(rolData)
      setAssignedUsers(rolData.users)

      const filtrado = users.filter(
        item1 => !rolData.users.some(item2 => item2.user_id === item1.user_id)
      );
      setAvailableUsers(filtrado)
      setIsLoading(false)
    }

    loadRoleData()
  }, [roleId])

  const handleGoBack = () => {
    router.push("/rols")
  }

  const handleRevokeUser = async (userId: string) => {
    const payload = [{
      user: userId,
      type: "DELETE"
    }];
    const result = await setUseRolAction(roleId, { rols: payload });
    if (result.code !== 201) throw new Error("Error")

    setAssignedUsers((prev) => prev.filter((user) => user.user_id !== userId));
    const revokedUser: any = assignedUsers.find((user) => user.user_id === userId);
    if (revokedUser) {
      setAvailableUsers((prev) => [...prev, { ...revokedUser }])
    }
  }

  const handleAddUsers = async () => {
    try {
      setIsSetting(true)
      const setter = selectedUsers.map((u) => {
        return {
          user: u,
          type: "CREATE"
        }
      });
      const result = await setUseRolAction(roleId, { rols: setter });
      if (result.code !== 201) throw new Error("Error");
      const usersToAdd = availableUsers.filter((user) => selectedUsers.includes(user.user_id));
      const updatedUsers: any = usersToAdd.map((user) => ({
        ...user,
        grant_date: new Date(),
      }));
      setAssignedUsers((prev) => [...prev, ...updatedUsers]);
      setAvailableUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.user_id)))
      onAddUsersClose()
      setSelectedUsers([])
      addToast({
        title: "Usuarios asignados",
        description: "Usuarios asignados correctamente",
        color: "success",
        variant: "solid"
      });
    } catch (error) {
      console.log(error)
    }
    finally {
      setIsSetting(false)
    }
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-default-500">Cargando detalles del rol...</p>
        </div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="text-center space-y-4 py-12">
        <AlertTriangle className="w-16 h-16 text-danger mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Rol no encontrado</h2>
        <p className="text-default-500">El rol que buscas no existe o ha sido eliminado.</p>
        <Button color="primary" onPress={handleGoBack}>
          Volver a roles
        </Button>
      </div>
    )
  }

  // Agrupar permisos por categoría
  /*const permissionsByCategory = role.permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )*/

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="flat"
            onPress={handleGoBack}
            className="bg-default-100 hover:bg-default-200 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detalles del Rol</h1>
            <p className="text-default-500 mt-1">Información completa y gestión del rol</p>
          </div>
        </div>
        {/*<div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Edit className="w-4 h-4" />}
            onPress={handleEdit}
            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            Editar
          </Button>
          <Button color="danger" variant="flat" startContent={<Trash2 className="w-4 h-4" />} onPress={handleDelete}>
            Eliminar
          </Button>
        </div>*/}
      </div>

      {/* Información principal del rol */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
              >
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{role.role_name}</h2>
                <p className="text-default-500 mt-1 font-mono text-sm bg-default-100  px-2 py-1 rounded">
                  {role.role_code}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del esquema */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Descripción</h3>
                <p className="text-default-600 leading-relaxed">{role.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="text-sm font-medium text-default-500">Módulo</label>
                  <p className="text-foreground font-medium">{role.module}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-500">Tipo de rol</label>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color={role.is_system ? "warning" : "primary"} variant="flat">
                      {role.is_system ? "Sistema" : "Custom"}
                    </Chip>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-500">Creado el</label>
                  <p className="text-foreground">{new Date(role.created_date).toLocaleDateString("es-ES")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-500">Creado por</label>
                  <p className="text-foreground">{role.created_by}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Estadísticas</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{role.users.length}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Usuarios asignados</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                        {role.permissions.length}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Permisos otorgados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs para información detallada */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardBody className="p-0">
          <Tabs
            color="primary"
            variant="bordered"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}

          >
            <Tab
              key="overview"
              title={
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Resumen</span>
                </div>
              }
            >
              <Permisions permissions={role.permissions} />
            </Tab>

            <Tab
              key="users"
              title={
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Usuarios ({assignedUsers.length})</span>
                </div>
              }
            >
              <RolUser assignedUsers={assignedUsers}
                onAddUsersOpen={onAddUsersOpen}
                handleRevokeUser={handleRevokeUser}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Modal de edición de rol 
      <RoleEditModal isOpen=isEditOpen} onClose={onEditClose} onSave={handleSaveRole} role={role} />*}

      {/* Modal de edición de permisos 
      <PermissionsEditModal
        isOpen={isEditPermissionsOpen}
        onClose={onEditPermissionsClose}
        onSave={handleSavePermissions}
        currentPermissions={role.permissions}
        allPermissions={allPermissions}
      />*/}

      {/* Modal para agregar usuarios */}
      <SetUser
        isOpen={isAddUsersOpen}
        onClose={onAddUsersClose}
        onSave={handleAddUsers}
        availableUsers={availableUsers}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        isSetting={isSetting}
      />
    </div>
  )
}


