"use client"

import { useState, useRef } from "react";
import { Button } from "@heroui/react"
import { Save } from "lucide-react"


import Password from "./Password";
import Session from "./Session";
import Mfa from "./Mfa";
import Preferences from "./preferences";
import UserManagementHeader from "../Common/UserManagementHeader";

import { handleError } from "@/lib/errorHandler";
import { UserDetails } from "@/types";





interface iSettingsProps {
    data: UserDetails
}

function Settings({ data }: iSettingsProps) {
    // Estados para las preferencias básicas
    const hijoRef: any = useRef(null);
    const [isChangePreferences, setIsChangePreferences] = useState(false);


    const handleButtonClick = async () => {
        try {
            setIsChangePreferences(true);
            await hijoRef?.current?.handleSavePreferences();

        } catch (error: any) {
            handleError(error);
        }
        finally {
            setIsChangePreferences(false);
        }

    };
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Header */}
            <UserManagementHeader
                subtitle="Gestiona tus preferencias personales y configuración de seguridad"
                title="Configuración de Cuenta"
                actions={
                    <div className="flex gap-3">
                        <Button
                            isLoading={isChangePreferences}
                            color="primary"
                            startContent={<Save className="w-4 h-4" />}
                            onPress={handleButtonClick}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                }
            />




            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Preferencias Generales */}
                <Preferences
                    ref={hijoRef}
                    languageProp={data.preferences.lang}
                    themeProp={data.preferences.theme}
                    id={data.preferences.id}
                />

                {/* Seguridad */}
                <Password />
            </div>
            {/* Autenticación Multifactor */}
            <Mfa
                verified_status={data?.totp?.verified_status ?? undefined}
                failed_attempts={data.totp?.failed_attempts ?? undefined}
                last_attempt_date={data.totp?.last_attempt_date}
                enabled={data.totp ? true : false}
            />
            {/* Sesiones Activas */}
            <Session sessions={data.sesions} />

            {/* Modal WebAuthn Setup */}
            {/*<Modal isOpen={isWebauthnOpen} onClose={onWebauthnClose} size="2xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-5 h-5" />
                            Configurar Llave de Seguridad
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="text-center space-y-6">
                            <div>
                                <Fingerprint className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Registrar dispositivo de seguridad</h3>
                                <p className="text-sm text-default-500">
                                    Conecta tu llave de seguridad USB, usa Touch ID, Face ID, o Windows Hello para completar el registro
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <p className="text-sm text-purple-700 dark:text-purple-400">
                                    <strong>Dispositivos compatibles:</strong> YubiKey, Google Titan, Touch ID, Face ID, Windows Hello,
                                    Android Fingerprint
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onWebauthnClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleSetupWebauthn}>
                            Registrar Dispositivo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>*/}
        </div>
    )
}

export default Settings