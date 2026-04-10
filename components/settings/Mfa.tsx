import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Switch, useDisclosure } from "@heroui/react"
import { Fragment } from "react";
import { Shield, QrCode, Fingerprint, CheckCircle, ShieldAlert } from "lucide-react"
import { generateQr } from "@/utils";
import { ApiResponse, Create2FA } from '@/types';

import TotpModal from './Totp';
import RequestServer from '@/lib/client/api-client';
import { handleError } from '@/lib/errorHandler';

interface MfaProps {
    verified_status: string | undefined
    failed_attempts: number | undefined
    last_attempt_date: string | undefined
    enabled: boolean | undefined
}

function Mfa({
    enabled = false,
    verified_status = "UNVERIFIED",
    failed_attempts = 0,
    last_attempt_date
}: MfaProps) {

    const [totpEnabled, setTotpEnabled] = useState(enabled);
    const [topData, setTopData] = useState<Create2FA>();
    const [webauthnEnabled, setWebauthnEnabled] = useState(false)

    const { isOpen: isWebauthnOpen, onOpen: onWebauthnOpen, onClose: onWebauthnClose } = useDisclosure();
    const { isOpen: isTotpOpen, onOpen: onTotpOpen, onClose: onTotpClose } = useDisclosure();

    const handleSetupTotp = async () => {
        try {
            const fa = await new RequestServer<ApiResponse<Create2FA>>("Mfa/GetTotp")
                .exec();

            const url = await generateQr(fa.data.otpauth_url)
            setTopData({
                ...fa.data,
                otpauth_url: url
            })
            onTotpOpen()
        } catch (error: any) {
            handleError(error);
        }

    }
    const handleDisableTotp = async () => {
        new RequestServer("Mfa/cancel")
            .setQueryParams({ id: topData?.id })
        setTotpEnabled(false)
    }

    const compareFailetDate = (fecha: string | undefined) => {
        const now = new Date().getTime();
        const fail = new Date(fecha ?? "").getTime();

        if (fail > now) return true;
        return false;
    }
    return (
        <Fragment>
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        Autenticación Multifactor
                    </h2>
                </CardHeader>
                <CardBody className="pt-0 space-y-6">
                    {/* TOTP */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 shadow-sm">
                                <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Aplicación Autenticadora</h3>
                                <p className="text-sm text-default-500">Google Authenticator, Authy, etc.</p>
                                {totpEnabled && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            Configurado y activo
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Switch
                            isSelected={totpEnabled}
                            isDisabled={compareFailetDate(last_attempt_date)}
                            onValueChange={(checked) => {
                                if (checked) {
                                    handleSetupTotp()
                                } else {
                                    handleDisableTotp()
                                }
                            }}
                            color={verified_status === "VERIFIED" ? "success" : "danger"}
                            size="lg"
                        />
                    </div>

                    {/* WebAuthn */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 shadow-sm">
                                <Fingerprint className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Llaves de Seguridad</h3>
                                <p className="text-sm text-default-500">YubiKey, Touch ID, Windows Hello</p>
                                {webauthnEnabled && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            Configurado y activo
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Switch
                            isDisabled
                            isSelected={webauthnEnabled}
                            onValueChange={webauthnEnabled ? undefined : onWebauthnOpen}
                            color="success"
                            size="lg"
                        />
                    </div>

                    {(totpEnabled || webauthnEnabled) && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Tu cuenta está protegida con MFA</span>
                            </div>
                        </div>
                    )}
                    {
                        compareFailetDate(last_attempt_date) && (
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-sm font-medium">Por seguridad, se ha bloqueado temporalmente la configuración de autenticación multifactor (MFA) debido a múltiples intentos fallidos.</span>
                                </div>
                            </div>

                        )
                    }
                </CardBody>
            </Card>
            <TotpModal
                isOpen={isTotpOpen}
                onClose={onTotpClose}
                setTotpEnabled={setTotpEnabled}
                topData={topData}
                status={verified_status}
                fails={failed_attempts}
                last_attemp_date={last_attempt_date ?? ""}
            />
        </Fragment>
    )
}

export default Mfa