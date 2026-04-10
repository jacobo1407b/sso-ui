import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import { useDB } from "@/components/IndexedDBProvider";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@heroui/button";
import { Menu } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

import { Avatar } from "@heroui/avatar"
import { Settings, User, LogOut, HelpCircle } from "lucide-react"

import { logout } from "@/actions/authAction";
import { handleError } from "@/lib/errorHandler";
import RequestServer from "@/lib/client/api-client";



interface NavbarProps {
  onSidebarToggle?: () => void
  url_avatar: string
  username?: string
  last_update_avatar: number | null
  user_id: string
}

export const Navbar = ({ onSidebarToggle, url_avatar, username, last_update_avatar, user_id }: NavbarProps) => {
  const router = useRouter();

  const [blobImage, setBlobImage] = useState<string | undefined>();

  const db = useDB();


  useEffect(() => {
    if (!db.ready) return; // 👈 esperar a que la DB esté lista
    if (last_update_avatar && url_avatar) {
      validImageDownload(url_avatar); // aquí ya puedes usar tu API
    }
  }, [db.ready, last_update_avatar, url_avatar]);


  const validImageDownload = async (pub: string) => {
    const result = await db.getByPub("profiles", pub);

    // Caso 3: existe y está vigente
    if (result && result.image && result.fecha === last_update_avatar) {
      setBlobImage(URL.createObjectURL(result.image as Blob));
      return;
    }

    // Caso 1 y 2: no existe o está desactualizado/sin imagen
    console.log("Descargando imagen desde la red...");

    const imgBlob = await new RequestServer<Blob>("Util/Download")
    .setQueryParams({file:pub})
    .exec();
    //const imgBlob = await DownloadImage(pub);;
    setBlobImage(URL.createObjectURL(imgBlob));

    const newRecord = {
      fecha: last_update_avatar as number,
      image: imgBlob,
      pub,
      user_id: user_id,
    };

    if (!result?.id) {
      // Caso 1: no existe → crear
      await db.add("profiles", newRecord);
    } else {
      // Caso 2: existe pero desactualizado → actualizar
      await db.update("profiles", result.id, { ...result, ...newRecord });
    }
  };


  const onCloseSession = async () => {
    try {
      await logout();
      router.push("/signin")
    } catch (error: any) {
      handleError(error)
    }

  }
  return (
    <HeroUINavbar
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-default-200 dark:border-default-800"
      maxWidth="full"
      height="4rem">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <Button
          isIconOnly
          variant="flat"
          onPress={onSidebarToggle}
          className="bg-default-100 hover:bg-default-200  rounded-xl transition-all duration-300 text-foreground md:hidden" // Visible solo en móvil
          aria-label="Abrir/cerrar menú lateral"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <NavbarBrand as="li" className="gap-3 max-w-fit">

        </NavbarBrand>

      </NavbarContent>


      <NavbarContent className=" basis-1 pl-4" justify="end">

        {/*<Badge content="3" color="danger" size="sm" placement="top-right">
          <Button
            isIconOnly
            variant="flat"
            className="bg-default-100 hover:bg-default-200  rounded-xl text-foreground" // Usar text-foreground
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </Badge>*/}

        {/* Configuración */}
        <Button
          isIconOnly
          as={Link}
          href="/settings"
          variant="flat"
          className="bg-default-100 hover:bg-default-200 rounded-xl text-foreground" // Usar text-foreground
          aria-label="Configuración"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Perfil de usuario */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-105"
              color="primary"
              name={username}
              size="sm"
              src={blobImage}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Acciones de perfil" variant="flat">
            <DropdownItem href="/users/1" as={Link} key="profile" startContent={<User className="w-4 h-4 text-default-500" />}>
              Mi perfil
            </DropdownItem>
            <DropdownItem href="/settings" as={Link} key="settings" startContent={<Settings className="w-4 h-4 text-default-500" />}>
              Configuración
            </DropdownItem>
            <DropdownItem key="help" startContent={<HelpCircle className="w-4 h-4 text-default-500" />}>
              Ayuda y soporte
            </DropdownItem>
            <DropdownItem onPress={onCloseSession} key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
};
