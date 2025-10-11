"use client"
import { useState, useMemo } from "react";
import { UserData } from "@/types";
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Input } from "@heroui/react";
import { Button, Select, SelectItem, Avatar, DatePicker, addToast } from "@heroui/react";
import {
  UserPlus,
  Mail,
  Phone,
  Pickaxe,
  User,
  Building2
} from "lucide-react";
import { generatePassword } from "@/utils";
import type { DateValue } from "@internationalized/date";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { createUser, updateUser } from "@/actions/createUser";

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  operation: "UPDATE" | "CREATE"
  user: UserData | null
  userId: string
}
const consultantJobs = [
  { key: "tech_consultant", label: "Tech Consultant" },
  { key: "business_analyst", label: "Business Analyst" },
  { key: "strategy_consultant", label: "Strategy Consultant" },
  { key: "data_consultant", label: "Data Consultant" },
  { key: "security_consultant", label: "Security Consultant" },
  { key: "cloud_architect", label: "Cloud Architect" },
  { key: "frontend_architect", label: "Frontend Architect" },
  { key: "backend_specialist", label: "Backend Specialist" },
  { key: "oauth_integrator", label: "OAuth Integrator" },
  { key: "governance_advisor", label: "Governance Advisor" },
  { key: "devops_consultant", label: "DevOps Consultant" },
  { key: "product_owner", label: "Product Owner" },
  { key: "solution_designer", label: "Solution Designer" },
];

function UserModal({ isOpen, onClose, operation, user, userId }: UserModalProps) {
  const [userSate, setUserSate] = useState<UserData | null>(user);
  const [password] = useState(generatePassword(14));
  const [isLoading, setisLoading] = useState(false);
  const [datePicker, setDatePicker] = useState<DateValue | null | undefined>(user?.userBusiness.hire_date ? parseDate(user.userBusiness.hire_date.split("T")[0]) : null);
  const [jobUser, setJobUser] = useState(user?.userBusiness.job_title);


  const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

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

  const handleSelectionChange = (e: any) => {
    setJobUser(e.target.value)
  };

  const onSubmit = async () => {
    try {
      const form = document.getElementById('userForm') as HTMLFormElement;
      const esValido = form.checkValidity();
      userSate?.biografia
      if (esValido) {
        setisLoading(true);
        const res = operation === "CREATE" ? await createUser({
          ...userSate,
          password,
          hire_date: datePicker?.toString() ? new Date(datePicker?.toString()) : null,
          job_title: jobUser
        }) : await updateUser({
          ...userSate,
          biografia: userSate?.biografia ?? null
        }, userId);
        if (res.status !== 201) throw new Error(res.name)
        setUserSate(res.data)
        onClose();
      }
    } catch (error: any) {
      addToast({
        title: error.message,
        description: error.message,
        color: "danger",
        variant: "solid"
      });

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
              defaultValue={userSate?.name}
              placeholder="Ingresa el nombre"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              isRequired
              name="email"
              isDisabled={operation === "CREATE" ? false : true}
              defaultValue={userSate?.email}
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              variant="bordered"
              color={isInvalidEmail ? "danger" : "success"}
              errorMessage="Please enter a valid email"
              isInvalid={isInvalidEmail}
            />
            <Input
              isRequired
              label="Primer apellido"
              name="last_name"
              defaultValue={userSate?.last_name}
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Input
              isRequired
              label="Segundo apellido"
              name="second_last_name"
              defaultValue={userSate?.second_last_name}
              placeholder="Ingresa apellidos"
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Teléfono"
              name="phone"
              defaultValue={userSate?.phone}
              placeholder="+612 345 678"
              startContent={<Phone className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isInvalid={userSate?.phone ? isPhoneInvalid : false}
              errorMessage="Ingrese un telefono valido"
              color={userSate?.phone ? isPhoneInvalid ? "danger" : "success" : "default"}
            />
            <div className="space-y-2">
              <DatePicker
                showMonthAndYearPickers
                label="Fecha de ingreso"
                name="hire_date"
                granularity="day"
                defaultValue={datePicker}
                onChange={setDatePicker}
                maxValue={today(getLocalTimeZone())}
                selectorButtonPlacement="end"
                isRequired
              />
              {/**
               * <Select
                className="max-w-xs"
                defaultSelectedKeys={[user?.userBusiness?.department ?? ""]}
                label="Seleccionar departamento"
                startContent={<Building2 className="w-4 h-4 text-default-400" />}
                isClearable={true} size="sm">
                <SelectItem
                  key="argentina"
                  startContent={
                    <Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />
                  }
                >
                  Argentina
                </SelectItem>
              </Select>
               */}


            </div>
            <Select
              className="max-w-xs"
              onChange={handleSelectionChange}
              defaultSelectedKeys={[jobUser ?? ""]}
              label="Seleccionar puesto"
              startContent={<Pickaxe className="w-4 h-4 text-default-400" />}
              isClearable={true} size="sm">

              {consultantJobs.map((job) => (
                <SelectItem key={job.label}>{job.label}</SelectItem>
              ))}
            </Select>
            {
              operation === "CREATE" ? (
                <Input
                  label="Contraseña"
                  name="password"
                  isReadOnly
                  defaultValue={password}
                  startContent={<User className="w-4 h-4 text-default-400" />}
                  variant="bordered"
                />
              ) : null
            }

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