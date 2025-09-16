import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Badge } from "@heroui/badge"
import { Button } from "@heroui/button";
import { Menu } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown"
import { Avatar } from "@heroui/avatar"
import { ThemeSwitch } from "@/components/theme-switch";
import { Settings, User, LogOut, Bell, HelpCircle } from "lucide-react"
import {
  Logo,
} from "@/components/icons";


interface NavbarProps {
  onSidebarToggle?: () => void
}

export const Navbar = ({ onSidebarToggle }: NavbarProps) => {
  const router = useRouter();
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
          className="bg-default-100 hover:bg-default-200 dark:bg-default-800 dark:hover:bg-default-700 rounded-xl transition-all duration-300 text-foreground md:hidden" // Visible solo en móvil
          aria-label="Abrir/cerrar menú lateral"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Logo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>

      </NavbarContent>


      <NavbarContent className=" basis-1 pl-4" justify="end">
        <ThemeSwitch />
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
              name="Usuario"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
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
            <DropdownItem onPress={() => {
              router.push('/signin');
            }} key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
};
