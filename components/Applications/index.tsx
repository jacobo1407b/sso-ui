"use client"
import Link from "next/link";
import { useDisclosure, Tooltip, Button } from "@heroui/react";
import { Trash2, Eye, Pencil, PlusIcon, AlertTriangle } from "lucide-react";
import UserModal from "./Modal";


import UserManagementHeader from "../Common/UserManagementHeader";
import ReusableTableCard from "../Common/CommonTable";
import CommonModal from '@/components/Common/CommonModal'

const mockApps = [
  {
    client_secret: "sec_001_xyz",
    client_id: "azc_app_001",
    app_name: "EcoMap Viewer",
    description: "Visualizador de mapas ecológicos en zonas urbanas.",
    redirect_callback: "https://ecomap.mx/auth/callback",
    scopes: "read:maps read:zones",
    is_active: true,
    app_type: "public",
    client_icon_url: "https://ecomap.mx/assets/icons/map.svg",
    created_by: "jacobo.hernandez@infra-tech.mx",
    grants: [
      {
        id: "grant_001",
        description: "Acceso a mapas ecológicos.",
        grants_name: "Lectura de mapas",
        icon_text: "🗺️",
        grant_code: "read:maps",
        created_date: "2025-09-10T08:00:00Z"
      }
    ]
  },
  {
    client_secret: "sec_002_abc",
    client_id: "azc_app_002",
    app_name: "InfraAlert Manager",
    description: "Gestión de alertas en infraestructura urbana.",
    redirect_callback: "https://infraalert.mx/oauth/callback",
    scopes: "write:alerts manage:tokens",
    is_active: false,
    app_type: "confidential",
    client_icon_url: "https://infraalert.mx/assets/icons/alert.svg",
    created_by: "jacobo.hernandez@infra-tech.mx",
    grants: [
      {
        id: "grant_002",
        description: "Creación y edición de alertas.",
        grants_name: "Gestión de alertas",
        icon_text: "🚨",
        grant_code: "write:alerts",
        created_date: "2025-09-11T09:30:00Z"
      },
      {
        id: "grant_003",
        description: "Administración de tokens de acceso.",
        grants_name: "Gestión de tokens",
        icon_text: "🔑",
        grant_code: "manage:tokens",
        created_date: "2025-09-11T09:35:00Z"
      }
    ]
  },
  {
    client_secret: "sec_003_def",
    client_id: "azc_app_003",
    app_name: "PermisOS",
    description: "Sistema de gestión de permisos y roles.",
    redirect_callback: "https://permisos.mx/auth/callback",
    scopes: "read:roles write:roles audit:logs",
    is_active: true,
    app_type: "confidential",
    client_icon_url: "https://permisos.mx/assets/icons/roles.svg",
    created_by: "jacobo.hernandez@infra-tech.mx",
    grants: [
      {
        id: "grant_004",
        description: "Lectura de roles asignados.",
        grants_name: "Lectura de roles",
        icon_text: "📋",
        grant_code: "read:roles",
        created_date: "2025-09-12T10:00:00Z"
      },
      {
        id: "grant_005",
        description: "Modificación de roles y permisos.",
        grants_name: "Escritura de roles",
        icon_text: "✏️",
        grant_code: "write:roles",
        created_date: "2025-09-12T10:05:00Z"
      },
      {
        id: "grant_006",
        description: "Auditoría de logs de acceso.",
        grants_name: "Auditoría de logs",
        icon_text: "📊",
        grant_code: "audit:logs",
        created_date: "2025-09-12T10:10:00Z"
      }
    ]
  }
];


function Aplication() {

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()


  return (
    <div className="flex flex-col gap-4">
      <UserManagementHeader
        subtitle="Administra aplicaciones y accesos"
        title="Gestión de Aplicaciones" />

      <ReusableTableCard
        searchPlaceholder="Buscar por nombre"
        columns={[
          { key: "app_name", label: "NOMBRE" },
          { key: "descripcion", label: "DESCRIPCION" },
          { key: "client_id", label: "CLIENTE" },
          { key: "fecha", label: "FECHA DE CREACION" },
          { key: "actions", label: "ACCIONES" },
        ]}
        data={mockApps}
        rowKey={(row) => row.client_id}
        renderRow={(row) => [
          row.app_name,
          row.description,
          row.client_id,
          row.created_by,
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <Link href="/aplications/645634V6456G34F53" className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </Link>
            </Tooltip>
            <Tooltip content="Actualizar">
              <span onClick={onEditOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar aplicación">
              <span onClick={onDeleteOpen} className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 />
              </span>
            </Tooltip>
          </div>,
        ]}
        pagination={{
          page: 5,
          total: 50,
          onChange: (p) => console.log("Page:", p),
        }}
        totalCount={mockApps.length}
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
      />

      <CommonModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger" /> Confirmar eliminación</div>}
        body={
          <p className="text-default-500">
            ¿Estás seguro de que deseas eliminar la aplicación{" "}
            <span className="font-semibold text-foreground">SSO</span>? Esta acción no se puede
            deshacer y se revocarán todas las credenciales asociadas.
          </p>
        }
        footer={
          <>
            <Button variant="light" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" >Eliminar permanentemente</Button>
          </>
        }
      />
      <UserModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        appData={{
          client_secret: "s3cr3t_9f8g7h2k1l0x",
          client_id: "app_azc_2025_001",
          app_name: "EcoInfra Monitor",
          description: "Aplicación para monitorear infraestructura ecológica urbana en CDMX y Guatemala.",
          redirect_callback: "https://ecoinfra.mx/auth/callback",
          scopes: "read:infra write:alerts manage:tokens",
          is_active: true,
          app_type: "public",
          client_icon_url: "https://ecoinfra.mx/assets/icons/eco-monitor.svg",
          created_by: "jacobo.hernandez@infra-tech.mx"
        }}
        selectedGrants={['1', '2']}
        imageDownloaded="https://ecoinfra.mx/assets/icons/eco-monitor.svg"
      />
    </div>
  )
}

export default Aplication