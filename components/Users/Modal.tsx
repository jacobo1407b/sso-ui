"use client"
import { useState, useMemo, useEffect } from "react";
import { ApiResponse, User as UserData } from "@/types";
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Input, Textarea } from "@heroui/react";
import { Button, Select, SelectItem, DatePicker } from "@heroui/react";
import { UserPlus, Mail, Phone, Pickaxe, User } from "lucide-react";
import { generatePassword } from "@/utils";
//import type { DateValue } from "@internationalized/date";
//import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import RequestServer from "@/lib/client/api-client";
import { handleError } from "@/lib/errorHandler";

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  operation: "UPDATE" | "CREATE"
  user: UserData | null
  userId: string
  onUpdateState: (operation: "CREATE" | "UPDATE", user: UserData) => void
  isMain: boolean
}
const consultantJobs = [
  { key: "tech_consultant", label: "Consultor" },
  { key: "sso_admin", label: "SSO Administrador" }
];

function UserModal({ isOpen, onClose, operation, user, userId, onUpdateState, isMain }: UserModalProps) {
  const [userSate, setUserSate] = useState<UserData | null>(null);
  const [password] = useState(generatePassword(14));
  const [isLoading, setisLoading] = useState(false);
  //const [datePicker, setDatePicker] = useState<DateValue | null | undefined>(user?.userBusiness.hire_date ? parseDate(user.userBusiness.hire_date.split("T")[0]) : null);
  const [jobUser, setJobUser] = useState("");

  useEffect(() => {
    setUserSate(user);
    setJobUser(user?.userBusiness?.job_title ?? '');
  }, [user]);

  const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const sanitize = (str: string) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  const isInvalidEmail = useMemo(() => {
    if (userSate?.email === "") return false;

    return validateEmail(userSate?.email ?? "") ? false : true;
  }, [userSate?.email]);

  const validatePhone = (value: string) => /^[0-9]{10}$/.test(value);
  const isPhoneInvalid = useMemo(() => {
    return validatePhone(userSate?.phone ?? "") ? false : true;
  }, [userSate?.phone]);


  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    if (!target.name) return;
    setUserSate(prev => ({
      ...prev!,
      [target.name]: target.value,
    }));
  };

  /*const handleSelectionChange = (e: any) => {
    setJobUser(e.target.value)
  };*/

  const onSubmit = async () => {
    try {
      const form = document.getElementById('userForm') as HTMLFormElement;
      if (form.checkValidity()) {
        setisLoading(true);
        let payload = {};
        if (operation === "CREATE") {
          payload = {
            ...userSate,
            password,
            hire_date: new Date(),
            job_title: jobUser,
            username: `${sanitize(userSate?.name ?? '')}.${sanitize(userSate?.last_name ?? '')}.${new Date().getFullYear().toString().slice(-2)}`
          }
        } else {
          payload = {
            name: userSate?.name,
            last_name: userSate?.last_name,
            second_last_name: userSate?.second_last_name,
            phone: userSate?.phone,
            job_title: jobUser,
            department: null,
            biografia: userSate?.biografia ?? null
          }
        }
        const requ = await new RequestServer<ApiResponse<UserData>>("Users/UpdateUser")
          .setUriParams({ id: userId })
          .setQueryParams({ operation })
          .setPayload(payload)
          .exec();
        setUserSate(requ.data);
        onUpdateState(operation, requ.data);
        onClose();
      }
    } catch (error: any) {
      handleError(error)
    } finally {
      setisLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {operation === "CREATE" ? "Crear Nuevo Usuario" : "Actualizar Usuario"}
          </div>
        </ModalHeader>
        <ModalBody>
          <form id="userForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onChange={handleFormChange}>
            <Input
              isRequired
              label="Nombres"
              name="name"
              value={userSate?.name ?? ''}
              placeholder="Ingresa el nombre"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />

            <Input
              isRequired
              name="email"
              isDisabled={operation !== 'CREATE'}
              value={userSate?.email ?? ''}
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              variant="bordered"
              color={isInvalidEmail ? 'danger' : 'success'}
              errorMessage="Please enter a valid email"
              isInvalid={isInvalidEmail}
            />

            <Input
              isRequired
              label="Primer apellido"
              name="last_name"
              value={userSate?.last_name ?? ''}
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />

            <Input
              isRequired
              label="Segundo apellido"
              name="second_last_name"
              value={userSate?.second_last_name ?? ''}
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Teléfono"
              name="phone"
              value={userSate?.phone ?? ''}
              placeholder="+612 345 678"
              startContent={<Phone className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isInvalid={userSate?.phone ? isPhoneInvalid : false}
              errorMessage="Ingrese un telefono valido"
              color={!userSate?.phone ? 'default' : isPhoneInvalid ? 'danger' : 'success'}
            />
            {isMain && (
              <Textarea
                variant="bordered"
                name="biografia"
                aria-describedby="textarea-controlled-description"
                aria-label="Announcement"
                placeholder="Biografia"
                value={userSate?.biografia ?? ""}
              />
            )}


            {
              /**
               *  <div className="space-y-2">
                <DatePicker
                  showMonthAndYearPickers
                  label="Fecha de ingreso"
                  name="hire_date"
                  granularity="day"
                  value={datePicker}
                  onChange={setDatePicker}
                  maxValue={today(getLocalTimeZone())}
                  selectorButtonPlacement="end"
                  isRequired
                />
              </div>
              */
            }

            {operation === 'CREATE' && (
              <Input
                label="Contraseña"
                name="password"
                isReadOnly
                value={password}
                startContent={<User className="w-4 h-4 text-default-400" />}
                variant="bordered"
              />
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            onPress={onSubmit}
            isLoading={isLoading}
            color="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {operation === "CREATE" ? "Crear" : "Actualizar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserModal;