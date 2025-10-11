"use client"
import { useState } from "react"
import { Button, Chip, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, User } from "@heroui/react"
import { UserMinus, UserPlus, Search } from "lucide-react"
import { UserRol } from "@/types"



interface iRolUserProps {
    assignedUsers: Array<UserRol>
    onAddUsersOpen: () => void
    handleRevokeUser: (userId: string) => void
}

function RolUser({ assignedUsers, onAddUsersOpen, handleRevokeUser }: iRolUserProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(1)

    const rowsPerPage = 5

    const filteredAssignedUsers = assignedUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const pages = Math.ceil(filteredAssignedUsers.length / rowsPerPage)
    const items = filteredAssignedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

    return (
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
                    <TableColumn>ASIGNADO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay usuarios asignados a este rol">
                    {items.map((user) => (
                        <TableRow key={user.user_id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: user.profile_picture }}
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
                                <span className="text-sm text-default-500">
                                    {new Date(user.grant_date).toLocaleDateString("es-ES")}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    isIconOnly
                                    isDisabled={user.name === "ADMIN"}
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    onPress={() => handleRevokeUser(user.user_id)}
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
    )
}

export default RolUser