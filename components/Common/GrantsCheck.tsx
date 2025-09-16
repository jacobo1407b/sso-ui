import { Dispatch, SetStateAction } from "react";
import { Shield, Globe, Lock, Key, Clock, Zap } from "lucide-react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
type GrantType = "authorization_code" | "client_credentials" | "password" | "refresh_token" | "implicit"


const availableGrants: { id: string; value: GrantType; label: string; description: string; icon: any }[] = [
    {
        id: "1",
        value: "authorization_code",
        label: "Authorization Code",
        description: "Para aplicaciones web con backend seguro",
        icon: Globe,
    },
    {
        id: "2",
        value: "client_credentials",
        label: "Client Credentials",
        description: "Para comunicación servidor a servidor",
        icon: Lock,
    },
    {
        id: "3",
        value: "password",
        label: "Resource Owner Password",
        description: "Para aplicaciones de confianza (no recomendado)",
        icon: Key,
    },
    {
        id: "4",
        value: "refresh_token",
        label: "Refresh Token",
        description: "Para renovar tokens de acceso automáticamente",
        icon: Clock,
    }
]


interface GrantsCheckProps {
    selectedGrants: Array<string>;
    operationType: "CREATE" | "UPDATE";
    errorMsg: string | null;
    setGroupSelected: Dispatch<SetStateAction<string[]>>
}


export default function GrantsCheck({ selectedGrants, operationType, errorMsg, setGroupSelected }: GrantsCheckProps) {
    return (
        <div className="space-y-4">
            {operationType ==="CREATE" && (
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    OAuth Grants *{errorMsg && <span className="text-danger text-xs ml-2">{errorMsg}</span>}
                </h4>
            )}

            <p className="text-sm text-default-500">
                Selecciona los tipos de grants que tu aplicación necesita. Cada grant tiene diferentes casos de uso.
            </p>
            <CheckboxGroup
                onChange={setGroupSelected}
                isInvalid={!!errorMsg}
                value={selectedGrants}
                classNames={{
                    wrapper: "gap-4",
                }}
            >
                {availableGrants.map((grant) => (
                    <Checkbox key={grant.id} value={grant.id} classNames={{ wrapper: "mr-3" }}>
                        <div className="flex items-start gap-3">
                            <grant.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">{grant.label}</p>
                                <p className="text-sm text-default-500">{grant.description}</p>
                            </div>
                        </div>
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </div>
    )
}