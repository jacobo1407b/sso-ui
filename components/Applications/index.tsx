"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDisclosure, Tooltip, Button, addToast } from "@heroui/react";
import { Trash2, Eye, Pencil, PlusIcon, AlertTriangle } from "lucide-react";
import UserModal from "./Modal";


import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import CommonModal from '@/components/Common/CommonModal'
import { Clients, Grant } from "@/types";
import { formateaFechaRelativa } from "@/utils";
import { deleteAppAction, getAllClients } from "@/actions/clientAction";



interface iAppsProps {
  data: Array<Clients>,
  page: number,
  pageSize: number,
  totalPages: number,
  listGrants: Array<Grant>
}
function Aplication({ data, page, pageSize, totalPages, listGrants }: iAppsProps) {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [temporalData, setTemporalData] = useState<Clients>();
  const [isDeleteApp, setIsDeleteApp] = useState(false)


  const [totalPage, setTotalPage] = useState(0);
  const [pageSizes, setPageSizes] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsData, setclientsData] = useState<Array<Clients>>([]);

  useEffect(() => {
    setTotalPage(totalPages);
    setPageSizes(pageSize);
    setCurrentPage(page);
    setclientsData(data);
  }, [])


  const handlerSelectededit = (data: Clients) => {
    setTemporalData(data);
    onEditOpen()

  }

  const handlerDelete = (data: Clients) => {
    setTemporalData(data);
    onDeleteOpen()
  }

  const onDeleteApp = async () => {
    try {
      setIsDeleteApp(true)
      const dele = await deleteAppAction(temporalData?.client_id ?? "");
      if (dele.code !== 201) throw new Error(dele.name);
      addToast({
        title: "Eliminado correctamente",
        description: "",
        color: "success",
        variant: "solid"
      });
      setIsDeleteApp(false);
      onDeleteClose();
    } catch (error) {

    }

  }

  const handlerNavigation = async (page: number) => {
    const result = await getAllClients(page, pageSize);
    setTotalPage(result.totalCount);
    setPageSizes(result.pageSize);
    setCurrentPage(result.page);
    setclientsData(result.data);
  }

  const handlerSearch = async (value: string) => {
    const result = await getAllClients(1, pageSize, value ?? undefined);
    setTotalPage(result.data.length === 0 ? 1 : result.data.length);
    setPageSizes(result.pageSize);
    setCurrentPage(result.page);
    setclientsData(result.data);
  }

  return (
    <div className="flex flex-col gap-4">
      <UserManagementHeader
        subtitle="Administra aplicaciones y accesos"
        title="Gestión de Aplicaciones" />

      <ReusableTableCard
        onSearch={handlerSearch}
        searchPlaceholder="Buscar por nombre"
        columns={[
          { key: "app_name", label: "NOMBRE" },
          { key: "descripcion", label: "DESCRIPCION" },
          { key: "client_id", label: "CLIENTE" },
          { key: "fecha", label: "FECHA DE CREACION" },
          { key: "actions", label: "ACCIONES" },
        ]}
        data={clientsData}
        rowKey={(row) => row.client_id}
        renderRow={(row) => [
          row.app_name,
          row.description,
          row.client_id,
          //row.created_by,
          formateaFechaRelativa(row.created_date),
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <Link href={`/aplications/${row.client_id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </Link>
            </Tooltip>
            <Tooltip content="Actualizar">
              <span onClick={() => handlerSelectededit(row)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil />
              </span>
            </Tooltip>
            {!row.is_active && (
              <Tooltip color="danger" content="Eliminar aplicación">
                <span onClick={() => handlerDelete(row)} className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2 />
                </span>
              </Tooltip>

            )}
          </div>
        ]}
        pagination={{
          page: currentPage,
          total: Math.ceil(totalPage / pageSizes),
          onChange: handlerNavigation,
        }}
        totalCount={totalPage}
        addButton={{
          label: "Crear Aplicación",
          onClick: () => onCreateOpen(),
          icon: <PlusIcon className="w-5 h-5" />,
        }}
      />



      <UserModal
        isOpen={isCreateOpen}
        onClose={() => {
          onCreateClose()
        }}
        appData={null}
        selectedGrants={[]}
        imageDownloaded=""
        listGrants={listGrants}
      />

      <CommonModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger" /> Confirmar eliminación</div>}
        body={
          <p className="text-default-500">
            ¿Estás seguro de que deseas eliminar la aplicación{" "}
            <span className="font-semibold text-foreground">{temporalData?.app_name}</span>? Esta acción no se puede
            deshacer y se revocarán todas las credenciales asociadas.
          </p>
        }
        footer={
          <>
            <Button variant="light" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" isLoading={isDeleteApp} onPress={onDeleteApp} >Eliminar permanentemente</Button>
          </>
        }
      />
      <UserModal
        listGrants={listGrants}
        isOpen={isEditOpen}
        onClose={onEditClose}
        appData={temporalData ?? null}
        selectedGrants={temporalData?.grants.map((x) => x.id) ?? []}
        imageDownloaded={temporalData?.client_icon_url ?? ""}
      />
    </div>
  )


}

export default Aplication