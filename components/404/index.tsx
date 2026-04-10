"use client"

import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push("/")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Ilustracion 404 */}
                <div className="relative mb-8">
                    <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                        {/* Circulo de fondo */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 dark:from-blue-500/10 dark:to-indigo-600/10 animate-pulse" />

                        {/* Circulos decorativos */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-80 animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="absolute -bottom-2 -left-6 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 opacity-80 animate-bounce" style={{ animationDelay: "0.5s" }} />

                        {/* Numero 404 */}
                        <div className="relative z-10">
                            <span className="text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                404
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                    <CardBody className="p-8 gap-6">
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                Pagina no encontrada
                            </h1>
                            <p className="text-default-500 text-lg max-w-md mx-auto">
                                Lo sentimos, la pagina que buscas no existe o ha sido movida a otra ubicacion.
                            </p>
                        </div>

                        {/* Botones principales */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                size="lg"
                                variant="flat"
                                startContent={<ArrowLeft className="w-5 h-5" />}
                                onPress={handleGoBack}
                                className="bg-default-100 hover:bg-default-200 dark:bg-default-50/10 dark:hover:bg-default-50/20 text-foreground font-medium"
                            >
                                Regresar
                            </Button>
                            <Button
                                size="lg"
                                startContent={<Home className="w-5 h-5" />}
                                onPress={() => router.push("/")}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:opacity-90"
                            >
                                Ir al inicio
                            </Button>
                        </div>

                        {/* Links adicionales 
                        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-divider">
                            <Button
                                variant="light"
                                size="sm"
                                startContent={<Search className="w-4 h-4" />}
                                onPress={() => router.push("/users")}
                                className="text-default-600 hover:text-foreground"
                            >
                                Buscar usuarios
                            </Button>
                            <Button
                                variant="light"
                                size="sm"
                                startContent={<HelpCircle className="w-4 h-4" />}
                                onPress={() => router.push("/help")}
                                className="text-default-600 hover:text-foreground"
                            >
                                Ayuda y soporte
                            </Button>
                        </div>*/}
                    </CardBody>
                </Card>

                {/* Footer 
                <p className="mt-6 text-sm text-default-400">
                    Si crees que esto es un error, contacta al{" "}
                    <button
                        onClick={() => router.push("/help")}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        equipo de soporte
                    </button>
                </p>*/}
            </div>
        </div>
    )
}
