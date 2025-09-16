"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  CheckboxGroup,
  Checkbox,
  Divider,
  User,
} from "@heroui/react"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  Eye,
  UserMinus,
  UserPlus,
  Search,
  Crown,
  Database,
  BarChart3,
  Lock,
  UserCheck,
} from "lucide-react"

// Tipos de datos
interface RoleData {
  id: string
  role_name: string
  role_code: string
  description: string
  module: string
  created_date: string
  created_by: string
  is_system: boolean
  level: "basic" | "intermediate" | "advanced" | "admin"
  permissions: Permission[]
  userCount: number
  isActive: boolean
  color: string
  updatedAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface UserData {
  id: string
  name: string
  email: string
  avatar: string
  department: string
  status: "active" | "inactive" | "pending"
  assignedAt: string
}

// Datos simulados
const mockRole: RoleData = {
  id: "1",
  role_name: "Editor de Contenido",
  role_code: "CONTENT_EDITOR",
  description: "Puede crear, editar y publicar contenido, pero no puede eliminar o gestionar usuarios",
  module: "Content Management",
  created_date: "2024-01-10",
  created_by: "admin@empresa.com",
  is_system: true,
  level: "intermediate",
  permissions: [
    { id: "content.read", name: "Ver contenido", description: "Consultar todo el contenido", category: "Contenido" },
    { id: "content.write", name: "Crear contenido", description: "Crear nuevo contenido", category: "Contenido" },
    {
      id: "content.edit",
      name: "Editar contenido",
      description: "Modificar contenido existente",
      category: "Contenido",
    },
    {
      id: "content.publish",
      name: "Publicar contenido",
      description: "Publicar contenido al sitio",
      category: "Contenido",
    },
    { id: "media.upload", name: "Subir archivos", description: "Subir imágenes y documentos", category: "Media" },
    { id: "reports.read", name: "Ver reportes", description: "Acceso a reportes básicos", category: "Reportes" },
  ],
  userCount: 12,
  isActive: true,
  color: "#3b82f6",
  updatedAt: "2024-01-18",
}

const mockAssignedUsers: UserData[] = [
  {
    id: "1",
    name: "María López",
    email: "maria.lopez@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
    status: "active",
    assignedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Contenido",
    status: "active",
    assignedAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Comunicaciones",
    status: "active",
    assignedAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Juan Martínez",
    email: "juan.martinez@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
    status: "inactive",
    assignedAt: "2024-01-08",
  },
]

const mockAvailableUsers: UserData[] = [
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura.sanchez@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Diseño",
    status: "active",
    assignedAt: "",
  },
  {
    id: "6",
    name: "Pedro González",
    email: "pedro.gonzalez@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
    status: "active",
    assignedAt: "",
  },
  {
    id: "7",
    name: "Sofia Ruiz",
    email: "sofia.ruiz@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Contenido",
    status: "active",
    assignedAt: "",
  },
]

const allPermissions: Permission[] = [
  // Contenido
  { id: "content.read", name: "Ver contenido", description: "Consultar todo el contenido", category: "Contenido" },
  { id: "content.write", name: "Crear contenido", description: "Crear nuevo contenido", category: "Contenido" },
  { id: "content.edit", name: "Editar contenido", description: "Modificar contenido existente", category: "Contenido" },
  {
    id: "content.delete",
    name: "Eliminar contenido",
    description: "Eliminar contenido existente",
    category: "Contenido",
  },
  {
    id: "content.publish",
    name: "Publicar contenido",
    description: "Publicar contenido al sitio",
    category: "Contenido",
  },

  // Media
  { id: "media.upload", name: "Subir archivos", description: "Subir imágenes y documentos", category: "Media" },
  { id: "media.delete", name: "Eliminar archivos", description: "Eliminar archivos del sistema", category: "Media" },

  // Usuarios
  { id: "users.read", name: "Ver usuarios", description: "Consultar información de usuarios", category: "Usuarios" },
  { id: "users.write", name: "Gestionar usuarios", description: "Crear, editar usuarios", category: "Usuarios" },

  // Reportes
  { id: "reports.read", name: "Ver reportes", description: "Acceso a reportes básicos", category: "Reportes" },
  {
    id: "reports.generate",
    name: "Generar reportes",
    description: "Crear reportes personalizados",
    category: "Reportes",
  },

  // Sistema
  {
    id: "system.settings",
    name: "Configuración",
    description: "Acceso a configuración del sistema",
    category: "Sistema",
  },
  { id: "system.admin", name: "Administración total", description: "Acceso completo al sistema", category: "Sistema" },
]



const levelLabels = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  admin: "Administrador",
}

const statusColorMap = {
  active: "success",
  inactive: "danger",
  pending: "warning",
} as const

const categoryIcons = {
  Contenido: Settings,
  Media: Database,
  Usuarios: Users,
  Reportes: BarChart3,
  Sistema: Lock,
}

interface RoleDetailsProps {
  roleId: string
}

export default function RoleDetails({ roleId }: RoleDetailsProps) {
  const router = useRouter()
  const [role, setRole] = useState<RoleData | null>(null)
  const [assignedUsers, setAssignedUsers] = useState<UserData[]>([])
  const [availableUsers, setAvailableUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isAddUsersOpen, onOpen: onAddUsersOpen, onClose: onAddUsersClose } = useDisclosure()
  const {
    isOpen: isEditPermissionsOpen,
    onOpen: onEditPermissionsOpen,
    onClose: onEditPermissionsClose,
  } = useDisclosure()

  const rowsPerPage = 5

  // Simular carga de datos
  useEffect(() => {
    const loadRoleData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRole(mockRole)
      setAssignedUsers(mockAssignedUsers)
      setAvailableUsers(mockAvailableUsers)
      setIsLoading(false)
    }

    loadRoleData()
  }, [roleId])

  const handleGoBack = () => {
    router.push("/roles")
  }

  const handleEdit = () => {
    onEditOpen()
  }

  const handleDelete = () => {
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    console.log("Rol eliminado:", role?.id)
    onDeleteClose()
    router.push("/roles")
  }

  const handleSaveRole = (roleData: Partial<RoleData>) => {
    if (role) {
      setRole({ ...role, ...roleData })
    }
    onEditClose()
  }

  const handleRevokeUser = (userId: string) => {
    setAssignedUsers((prev) => prev.filter((user) => user.id !== userId))
    const revokedUser = assignedUsers.find((user) => user.id === userId)
    if (revokedUser) {
      setAvailableUsers((prev) => [...prev, { ...revokedUser, assignedAt: "" }])
    }
    console.log("Usuario revocado:", userId)
  }

  const handleAddUsers = () => {
    const usersToAdd = availableUsers.filter((user) => selectedUsers.includes(user.id))
    const updatedUsers = usersToAdd.map((user) => ({
      ...user,
      assignedAt: new Date().toISOString().split("T")[0],
    }))

    setAssignedUsers((prev) => [...prev, ...updatedUsers])
    setAvailableUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
    onAddUsersClose()
    console.log(
      "Usuarios agregados:",
      usersToAdd.map((u) => u.name),
    )
  }

  const handleSavePermissions = (newPermissions: Permission[]) => {
    if (role) {
      setRole({ ...role, permissions: newPermissions })
    }
    onEditPermissionsClose()
  }

  // Filtrar usuarios asignados
  const filteredAssignedUsers = assignedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Paginación
  const pages = Math.ceil(filteredAssignedUsers.length / rowsPerPage)
  const items = filteredAssignedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

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
  const permissionsByCategory = role.permissions.reduce(
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
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="flat"
            onPress={handleGoBack}
            className="bg-default-100 hover:bg-default-200  dark:hover:bg-default-700 rounded-xl"
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
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: role.color }}
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
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{role.userCount}</p>
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
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Permisos del Rol
                    </h3>
                    {/*<Button
                      size="sm"
                      variant="flat"
                      startContent={<Edit className="w-4 h-4" />}
                      onPress={onEditPermissionsOpen}
                      className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      Editar Permisos
                    </Button>*/}
                  </div>

                  <div className="space-y-4">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                      const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-default-200 dark:border-default-700">
                            <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-semibold text-foreground">{category}</h4>
                            <Chip size="sm" variant="flat" color="primary">
                              {permissions.length}
                            </Chip>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-default-50 dark:bg-default-900/30"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground text-sm">{permission.name}</p>
                                  <p className="text-xs text-default-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
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
              <div className="p-6 space-y-6">
                {/* Header con búsqueda y botón agregar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Search className="w-4 h-4 text-default-400" />}
                      variant="bordered"
                      isClearable
                      onClear={() => setSearchQuery("")}
                    />
                  </div>
                  <Button
                    color="primary"
                    startContent={<UserPlus className="w-4 h-4" />}
                    onPress={onAddUsersOpen}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    Agregar Usuarios
                  </Button>
                </div>

                {/* Tabla de usuarios */}
                <Table
                  aria-label="Usuarios asignados al rol"
                  bottomContent={
                    pages > 1 ? (
                      <div className="flex w-full justify-center">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="primary"
                          page={page}
                          total={pages}
                          onChange={(page) => setPage(page)}
                        />
                      </div>
                    ) : null
                  }
                  classNames={{
                    wrapper: "min-h-[222px]",
                  }}
                >
                  <TableHeader>
                    <TableColumn>USUARIO</TableColumn>
                    <TableColumn>DEPARTAMENTO</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>ASIGNADO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="No hay usuarios asignados a este rol">
                    {items.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <User
                            avatarProps={{ radius: "lg", src: user.avatar }}
                            description={user.email}
                            name={user.name}
                          >
                            {user.email}
                          </User>
                        </TableCell>
                        <TableCell>
                          <Chip variant="flat" size="sm">
                            {user.department}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                            {user.status === "active"
                              ? "Activo"
                              : user.status === "inactive"
                                ? "Inactivo"
                                : "Pendiente"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-default-500">
                            {new Date(user.assignedAt).toLocaleDateString("es-ES")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleRevokeUser(user.id)}
                            className="hover:bg-danger-100 dark:hover:bg-danger-900/30"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
      <AddUsersModal
        isOpen={isAddUsersOpen}
        onClose={onAddUsersClose}
        onSave={handleAddUsers}
        availableUsers={availableUsers}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
      />

      {/* Modal de confirmación de eliminación */}
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
              ¿Estás seguro de que deseas eliminar el rol{" "}
              <span className="font-semibold text-foreground">{role.role_name}</span>? Esta acción no se puede deshacer
              y afectará a {role.userCount} usuarios asignados.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleConfirmDelete}>
              Eliminar permanentemente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

// Modal para editar rol
interface RoleEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (role: Partial<RoleData>) => void
  role: RoleData
}

function RoleEditModal({ isOpen, onClose, onSave, role }: RoleEditModalProps) {
  const [formData, setFormData] = useState({
    role_name: role.role_name,
    role_code: role.role_code,
    description: role.description,
    module: role.module,
    level: role.level,
    isActive: role.isActive,
    color: role.color,
  })

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Rol
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del rol"
                value={formData.role_name}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role_name: value }))}
                variant="bordered"
                isRequired
              />
              <Input
                label="Código del rol"
                value={formData.role_code}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role_code: value.toUpperCase() }))}
                variant="bordered"
                isRequired
                description="Identificador único en mayúsculas"
              />
            </div>

            <Input
              label="Descripción"
              value={formData.description}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              variant="bordered"
              type="textarea"
            />

            <Input
              label="Módulo"
              value={formData.module}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, module: value }))}
              variant="bordered"
              isRequired
              description="Módulo al que pertenece este rol"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nivel de acceso</label>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="w-full justify-start">
                      {levelLabels[formData.level]}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    selectionMode="single"
                    selectedKeys={[formData.level]}
                    onSelectionChange={(keys) => {
                      const level = Array.from(keys)[0] as RoleData["level"]
                      setFormData((prev) => ({ ...prev, level }))
                    }}
                  >
                    <DropdownItem key="basic">Básico</DropdownItem>
                    <DropdownItem key="intermediate">Intermedio</DropdownItem>
                    <DropdownItem key="advanced">Avanzado</DropdownItem>
                    <DropdownItem key="admin">Administrador</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Color del rol</label>
                <div className="flex gap-2">
                  {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6b7280"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? "border-foreground" : "border-default-300"
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Modal para editar permisos
interface PermissionsEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (permissions: Permission[]) => void
  currentPermissions: Permission[]
  allPermissions: Permission[]
}

function PermissionsEditModal({
  isOpen,
  onClose,
  onSave,
  currentPermissions,
  allPermissions,
}: PermissionsEditModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions.map((p) => p.id))

  const handleSave = () => {
    const newPermissions = allPermissions.filter((p) => selectedPermissions.includes(p.id))
    onSave(newPermissions)
  }

  // Agrupar permisos por categoría
  const permissionsByCategory = allPermissions.reduce(
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
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Editar Permisos del Rol
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-default-500">
              Selecciona los permisos que tendrán los usuarios con este rol. Los permisos están organizados por
              categorías.
            </p>

            <CheckboxGroup
              value={selectedPermissions}
              onValueChange={setSelectedPermissions}
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

            <Divider />

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Permisos seleccionados:</strong> {selectedPermissions.length} de {allPermissions.length}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            Guardar Permisos
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Modal para agregar usuarios
interface AddUsersModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  availableUsers: UserData[]
  selectedUsers: string[]
  onSelectionChange: (users: string[]) => void
}

function AddUsersModal({
  isOpen,
  onClose,
  onSave,
  availableUsers,
  selectedUsers,
  onSelectionChange,
}: AddUsersModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSave = () => {
    onSave()
    setSearchQuery("")
  }

  const handleClose = () => {
    onClose()
    setSearchQuery("")
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Agregar Usuarios al Rol
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              placeholder="Buscar usuarios disponibles..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Search className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isClearable
              onClear={() => setSearchQuery("")}
            />

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-default-300 mx-auto mb-4" />
                  <p className="text-default-500">
                    {searchQuery ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                  </p>
                </div>
              ) : (
                <CheckboxGroup
                  value={selectedUsers}
                  onValueChange={onSelectionChange}
                  classNames={{
                    wrapper: "gap-2",
                  }}
                >
                  {filteredUsers.map((user) => (
                    <Checkbox key={user.id} value={user.id} classNames={{ wrapper: "mr-3" }}>
                      <div className="flex items-center gap-3 p-2">
                        <Avatar src={user.avatar} size="sm" name={user.name} />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-default-500">{user.email}</p>
                          <Chip size="sm" variant="flat" className="mt-1">
                            {user.department}
                          </Chip>
                        </div>
                      </div>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>{selectedUsers.length}</strong> usuario{selectedUsers.length > 1 ? "s" : ""} seleccionado
                  {selectedUsers.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isDisabled={selectedUsers.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            Agregar {selectedUsers.length} Usuario{selectedUsers.length > 1 ? "s" : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
