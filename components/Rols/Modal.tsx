"use client"
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Input, Dropdown, Checkbox } from "@heroui/react";
import { DropdownTrigger, Button, DropdownItem, DropdownMenu, Switch, Divider, CheckboxGroup } from "@heroui/react";
import {
  Settings,
  Plus,
  BarChart3,
  Database,
  Calendar,
  Shield,
  Users
} from "lucide-react";

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
}
interface Permission {
  id: string
  name: string
  description: string
  category: string
}

// Permisos disponibles organizados por categorías
const availablePermissions: Permission[] = [
  // Usuarios
  { id: "users.read", name: "Ver usuarios", description: "Consultar información de usuarios", category: "Usuarios" },
  {
    id: "users.write",
    name: "Gestionar usuarios",
    description: "Crear, editar y eliminar usuarios",
    category: "Usuarios",
  },
  {
    id: "users.admin",
    name: "Administrar usuarios",
    description: "Acceso completo a gestión de usuarios",
    category: "Usuarios",
  },

  // Roles
  { id: "roles.read", name: "Ver roles", description: "Consultar roles del sistema", category: "Roles" },
  { id: "roles.write", name: "Gestionar roles", description: "Crear y modificar roles", category: "Roles" },
  { id: "roles.assign", name: "Asignar roles", description: "Asignar roles a usuarios", category: "Roles" },

  // Aplicaciones
  { id: "apps.read", name: "Ver aplicaciones", description: "Consultar aplicaciones OAuth", category: "Aplicaciones" },
  {
    id: "apps.write",
    name: "Gestionar aplicaciones",
    description: "Crear y configurar aplicaciones",
    category: "Aplicaciones",
  },
  {
    id: "apps.admin",
    name: "Administrar aplicaciones",
    description: "Control total sobre aplicaciones",
    category: "Aplicaciones",
  },

  // Sistema
  {
    id: "system.settings",
    name: "Configuración",
    description: "Acceso a configuración del sistema",
    category: "Sistema",
  },
  { id: "system.logs", name: "Logs del sistema", description: "Ver registros de actividad", category: "Sistema" },
  { id: "system.admin", name: "Administración total", description: "Acceso completo al sistema", category: "Sistema" },
]

const categoryIcons = {
  Usuarios: Users,
  Roles: Shield,
  Aplicaciones: Settings,
  Reportes: BarChart3,
  Sistema: Database,
}


function UserModal({ isOpen, onClose }: UserModalProps) {

  const permissionsByCategory = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nuevo Rol de Usuario
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Información Básica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del rol"
                  placeholder="Editor de Contenido"
                  variant="bordered"
                  isRequired
                />
                <Input
                  label="Rol Code"
                  placeholder="Editor de Contenido"
                  variant="bordered"
                  isReadOnly
                />

              </div>
              <Input
                label="Descripción"
                placeholder="Puede crear y editar contenido, pero no eliminar..."
                variant="bordered"
                type="textarea"
                description="Descripción detallada del rol y sus responsabilidades"
              />
            </div>
            <Divider />
            {/* Permisos */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permisos del Rol
              </h4>
              <p className="text-sm text-default-500">
                Selecciona los permisos que tendrán los usuarios con este rol. Los permisos están organizados por
                categorías.
              </p>

              <CheckboxGroup
                classNames={{
                  wrapper: "gap-6",
                }}
              >
                {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-default-200 dark:border-default-700">
                        <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h5 className="font-semibold text-foreground">{category}</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                        {permissions.map((permission) => (
                          <Checkbox key={permission.id} value={permission.id} classNames={{ wrapper: "mr-3" }}>
                            <div>
                              <p className="font-medium text-foreground text-sm">{permission.name}</p>
                              <p className="text-xs text-default-500">{permission.description}</p>
                            </div>
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CheckboxGroup>
            </div>
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
            Crear Rol
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserModal;