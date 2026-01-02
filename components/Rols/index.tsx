"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Tooltip } from "@heroui/react";
import { Eye } from "lucide-react";

import { getRolsAction } from "@/actions/rolsAction";
import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import { ListRols } from "@/types";


interface iRolsProps {
  rols: Array<ListRols>
  totalPage: number
  page: number
  pageSize: number
}
function Rols({ rols, totalPage, page, pageSize }: iRolsProps) {

  const [totalPages, setTotalPages] = useState(0);
  const [pageSizes, setPageSizes] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataRole, setDataRole] = useState<Array<ListRols>>([]);

  useEffect(() => {
    setTotalPages(totalPage);
    setPageSizes(pageSize);
    setCurrentPage(page);
    setDataRole(rols)
  }, []);


  const handlerSearch = async (value: string) => {
    const result = await getRolsAction(1, pageSize, value ?? undefined);
    setTotalPages(result.total);
    setPageSizes(result.pageSize);
    setCurrentPage(result.page);
    setDataRole(result.data);
  }

  const handlerNavigation = async (page: number) => {
    const result = await getRolsAction(page, pageSize);
    setTotalPages(result.total);
    setPageSizes(result.pageSize);
    setCurrentPage(result.page);
    setDataRole(result.data);
  }


  return (
    <div className="flex flex-col gap-4">

      <UserManagementHeader
        subtitle="Administra Roles"
        title="Administrar Roles y accesos" />
      {/*Buscador */}
      <ReusableTableCard
        onSearch={handlerSearch}
        searchPlaceholder="Buscar por codigo"
        columns={[
          { key: "rol", label: "NOMBRE" },
          { key: "descripcion", label: "DESCRIPCION" },
          { key: "code", label: "CODIGO" },
          { key: "fecha", label: "FECHA DE CREACION" },
          { key: "created", label: "CREADO POR" },
          { key: "actions", label: "ACCIONES" }
        ]}
        data={dataRole}
        rowKey={(row) => row.id}
        renderRow={(row) => [
          row.role_name,
          row.description,
          row.role_code,
          new Date(row.created_date).toLocaleDateString("es-ES"),
          row.created_by,
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Link href={`/rols/${row.id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
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
          page: currentPage,
          total: Math.ceil(totalPages / pageSizes),
          onChange: handlerNavigation,
        }}
        totalCount={totalPage}
      />

    </div>
  )
}

export default Rols