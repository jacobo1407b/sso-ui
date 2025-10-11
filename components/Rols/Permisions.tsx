import React from 'react';
import { Shield, Settings, CheckCircle } from "lucide-react";
import { Chip } from "@heroui/react"
import { Permission } from '@/types';




interface iPermisionProps {
  permissions: Array<Permission>
}

function Permisions({ permissions }: iPermisionProps) {

  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  const chunkedPermissions = chunkArray(permissions, 4); // agrupados de 4 en 4


  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permisos del Rol
          </h3>
          {/*<Button
                      size="sm"
                      variant="flat"
                      startContent={<Edit className="w-4 h-4" />}
                      onPress={onEditPermissionsOpen}
                      className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      Editar Permisos
                    </Button>*/}
        </div>

        <div className="space-y-4">
          {chunkedPermissions.map((grupo, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-default-200">
                <Settings className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-foreground">Grupo {index + 1}</h4>
                <Chip size="sm" variant="flat" color="primary">
                  {grupo.length}
                </Chip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                {grupo.map((permission) => (
                  <div
                    key={permission.perm_code}
                    className="flex items-start gap-3 p-3 rounded-lg bg-default-50"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{permission.perm_name}</p>
                      <p className="text-xs text-default-500">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/*Object.entries(permissionsByCategory).map(([category, permissions]) => {
                      const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-default-200 dark:border-default-700">
                            <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-semibold text-foreground">{category}</h4>
                            <Chip size="sm" variant="flat" color="primary">
                              {permissions.length}
                            </Chip>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-default-50 dark:bg-default-900/30"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground text-sm">{permission.name}</p>
                                  <p className="text-xs text-default-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })*/}
        </div>
      </div>
    </div>
  )
}

export default Permisions