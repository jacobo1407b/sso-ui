import { useState } from "react"
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react"
import { Key, Eye, EyeOff, } from "lucide-react";
import RequestServer from "@/lib/client/api-client";
import { handleError } from "@/lib/errorHandler";
import { ApiResponse } from "@/types";
import { useRouter } from 'next/navigation';


function Password() {

    const [passwordForm, setPasswordForm] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [isLoad, setIsLoad] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handlePasswordChange = async () => {
        try {
            setIsLoad(true)
            await new RequestServer<ApiResponse<boolean>>("SSO/changePassword")
                .setPayload({
                    password: passwordForm.new,
                    current_password: passwordForm.current,
                    password_repit: passwordForm.confirm,
                })
                .exec();
            router.push('/signin');
        } catch (error: any) {
            handleError(error)
        }
        finally {
            setIsLoad(false)
        }
    }


    return (
        <div className="space-y-6">
            {/* Cambiar Contraseña */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        Cambiar Contraseña
                    </h2>
                </CardHeader>
                <CardBody className="pt-0 space-y-6">
                    <Input
                        label="Contraseña actual"
                        placeholder="Ingresa tu contraseña actual"
                        type={showCurrentPassword ? "text" : "password"}
                        onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, current: value }))}
                        variant="bordered"
                        size="lg"
                        startContent={<Key className="w-4 h-4 text-default-400" />}
                        endContent={
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="w-4 h-4 text-default-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-default-400" />
                                )}
                            </Button>
                        }
                        classNames={{
                            inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                        }}
                        name="current"
                    />

                    <Input
                        name="new"
                        label="Nueva contraseña"
                        placeholder="Ingresa tu nueva contraseña"
                        type={showNewPassword ? "text" : "password"}
                        onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, new: value }))}
                        variant="bordered"
                        size="lg"
                        startContent={<Key className="w-4 h-4 text-default-400" />}
                        endContent={
                            <Button isIconOnly variant="light" size="sm" onPress={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? (
                                    <EyeOff className="w-4 h-4 text-default-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-default-400" />
                                )}
                            </Button>
                        }
                        classNames={{
                            inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                        }}
                    />

                    <Input
                        name="confirm"
                        label="Confirmar nueva contraseña"
                        placeholder="Confirma tu nueva contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        onValueChange={(value) => setPasswordForm((prev) => ({ ...prev, confirm: value }))}
                        variant="bordered"
                        size="lg"
                        startContent={<Key className="w-4 h-4 text-default-400" />}
                        endContent={
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4 text-default-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-default-400" />
                                )}
                            </Button>
                        }
                        classNames={{
                            inputWrapper: "border-2 hover:border-orange-300 focus-within:border-orange-500",
                        }}
                    />

                    <div className="pt-2">
                        <Button
                            isLoading={isLoad}
                            color="primary"
                            size="lg"
                            onPress={handlePasswordChange}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            isDisabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                            startContent={<Key className="w-5 h-5" />}
                        >
                            Actualizar Contraseña
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            <strong>Recomendaciones:</strong> Usa al menos 8 caracteres, incluye mayúsculas, minúsculas, números y
                            símbolos especiales.
                        </p>
                    </div>
                </CardBody>
            </Card>

        </div>
    )
}

export default Password