import { Dispatch, SetStateAction } from "react";
import { Shield, Globe, Lock, Key, Clock, Zap } from "lucide-react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { Grant } from "@/types";


function getIcon(icontext: string) {
    switch (icontext) {
        case "Globe":
            return <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"  />
        case "Lock":
            return <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        case "Key":
            return <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"  />
        case "Clock":
            return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"  />
        default:
            return "";
    }
}



interface GrantsCheckProps {
    selectedGrants: Array<string>;
    operationType: "CREATE" | "UPDATE";
    errorMsg: string | null;
    setGroupSelected: Dispatch<SetStateAction<string[]>>
    listGrants: Array<Grant>
}


export default function GrantsCheck({ selectedGrants, operationType, errorMsg, setGroupSelected, listGrants }: GrantsCheckProps) {
    return (
        <div className="space-y-4">
            {operationType === "CREATE" && (
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
                {listGrants.map((grant) => (
                    <Checkbox key={grant.id} value={grant.id} classNames={{ wrapper: "mr-3" }}>
                        <div className="flex items-start gap-3">
                            {getIcon(grant.icon_text)}
                            <div>
                                <p className="font-medium text-foreground">{grant.grants_name}</p>
                                <p className="text-sm text-default-500">{grant.description}</p>
                            </div>
                        </div>
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </div>
    )
}