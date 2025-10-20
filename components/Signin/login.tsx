"use client"

import type React from "react"
import { useRouter } from 'next/navigation';
import { useState } from "react"
import { Input, addToast, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Mail, Eye, KeyRound, EyeOff } from "lucide-react";
import { loginAction } from '@/actions/loginAction';

interface iSigningProps {
    callbackUrl?: string;
}
export default function LoginPage({ callbackUrl }: iSigningProps) {
    const router = useRouter();


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const toggleVisibility = () => setIsVisible(!isVisible)

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {}

        if (!email) {
            newErrors.email = "El email es requerido"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email inválido"
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida"
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const redirectToCallbackUrl = (res: any, callbackUrl?: string) => {
        if (!res.accessToken) throw new Error(res.name)
        const url = res.user.totp
            ? callbackUrl ? `/mfa?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/mfa"
            : (callbackUrl || "/");

        router.push(url);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()

            if (!validateForm()) return
            setIsLoading(true);
            const res = await loginAction(email, password);
            redirectToCallbackUrl(res, callbackUrl);

        } catch (error: any) {
            addToast({
                title: error.message,
                description: error.message,
                color: "danger",
                variant: "solid"
            });
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="flex flex-col gap-3 pb-0 pt-6">
                <div className="flex justify-center mb-2">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">EmpresaCorp</h1>
                    <p className="text-sm text-default-500 font-medium">Sistema de Autenticación Única</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-xl font-semibold text-foreground">Bienvenido de vuelta</h2>
                    <p className="text-sm text-default-500">Ingresa tus credenciales para continuar</p>
                </div>
            </CardHeader>
            <CardBody className="gap-6 px-6 pb-6">
                <form className="flex flex-col gap-5">
                    <Input
                        type="email"
                        label="Correo Electrónico"
                        placeholder="tu@email.com"
                        value={email}
                        onValueChange={setEmail}
                        startContent={<Mail className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email}
                        variant="bordered"
                        size="lg"
                        classNames={{
                            input: "text-sm",
                            inputWrapper: "border-2 hover:border-purple-300 focus-within:border-purple-500",
                        }}
                    />

                    <Input
                        label="Contraseña"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onValueChange={setPassword}
                        startContent={<KeyRound className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                        endContent={
                            <button
                                className="focus:outline-none hover:opacity-80 transition-opacity"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {isVisible ? (
                                    <EyeOff className="text-xl text-gray-400 pointer-events-none" />
                                ) : (
                                    <Eye className="text-xl text-gray-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                        variant="bordered"
                        size="lg"
                        classNames={{
                            input: "text-sm",
                            inputWrapper: "border-2 hover:border-purple-300 focus-within:border-purple-500",
                        }}
                    />

                    {/*<div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-purple-600 bg-background border-default-300 rounded focus:ring-purple-500 dark:bg-default-100 dark:border-default-400"
              />
              <label htmlFor="remember" className="text-sm text-foreground">
                Recordarme
              </label>
            </div>
            <Link href="#" size="sm" className="text-purple-600 hover:text-purple-800">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>*/}

                    <Button
                        type="submit"
                        color="secondary"
                        size="lg"
                        isLoading={isLoading}
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
                    >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
                <div className="text-center pt-4 border-t border-default-200 dark:border-default-700">
                    <div className="flex items-center justify-center gap-2 text-xs text-default-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Conexión segura SSL</span>
                    </div>
                </div>

            </CardBody>
        </Card>
    );
}
//from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700