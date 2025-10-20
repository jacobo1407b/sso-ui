import React from 'react'
import { Avatar } from "@heroui/react";
import { Globe } from "lucide-react";


interface iAppInformationProps {
    appLogo: string | undefined
    appName: string
    appDescription: string
}

function AppInformation({ appDescription, appLogo, appName }: iAppInformationProps) {
    return (
        <div>
            {/* Información de la aplicación */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="relative">
                        <Avatar
                            src={appLogo}
                            size="lg"
                            name={appName}
                            className="w-20 h-20 shadow-lg border-4 border-white dark:border-slate-700"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <Globe className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
                    <p className="text-sm text-default-500 mt-1">{appDescription}</p>
                    {/*<div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-default-400">por {appDeveloper}</span>
                <Link href={appWebsite} size="sm" isExternal className="text-xs">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>*/}
                </div>
            </div>

            {/* Mensaje principal */}
            <div className="text-center space-y-2 pt-2">
                <h2 className="text-lg font-semibold text-foreground">
                    <span className="text-blue-600 dark:text-blue-400">{appName}</span> quiere acceder a tu cuenta
                </h2>
                <p className="text-sm text-default-500">
                    Esta aplicación solicita permisos para acceder a tu información de EmpresaCorp
                </p>
            </div>
        </div>
    )
}

export default AppInformation