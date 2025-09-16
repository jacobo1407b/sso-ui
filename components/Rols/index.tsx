"use client"

import Link from "next/link";
import { Tooltip } from "@heroui/react";
import {  Eye } from "lucide-react";


import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";


const rols = [
  {
    id: "1",
    rol: "SSO admin",
    descripcion: "Aplicacion principal SSO",
    code: "SSO_ADMIN",
    created: "system",
    fecha: "07 Julio 2025"
  },
];

function Rols() {


  return (
    <div className="flex flex-col gap-4">

      <UserManagementHeader
        subtitle="Administra Roles"
        title="Administrar Roles y accesos" />
      {/*Buscador */}
      <ReusableTableCard
        searchPlaceholder="Buscar por nombre"
        columns={[
          { key: "rol", label: "NOMBRE" },
          { key: "descripcion", label: "DESCRIPCION" },
          { key: "code", label: "CODIGO" },
          { key: "fecha", label: "FECHA DE CREACION" },
          { key: "created", label: "CREADO POR" },
          { key: "actions", label: "ACCIONES" }
        ]}
        data={rols}
        rowKey={(row) => row.id}
        renderRow={(row) => [
          row.rol,
          row.descripcion,
          row.code,
          row.created,
          row.fecha,
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Link href="/rols/645634V6456G34F53" className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </Link>
            </Tooltip>
            {/*<Tooltip content="reset password">
              <span onClick={onEditOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span onClick={onDeleteOpen} className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 />
              </span>
            </Tooltip>*/}
            
          </div>
        ]}
        pagination={{
          page: 5,
          total: 50,
          onChange: (p) => console.log("Page:", p),
        }}
        totalCount={20}
      />

    </div>
  )
}

export default Rols