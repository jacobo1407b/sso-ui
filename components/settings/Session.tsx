import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Avatar, Chip, addToast } from "@heroui/react"
import { Monitor, Activity, Trash2 } from "lucide-react"
import { formateaFechaRelativa } from '@/utils';
import RequestServer from "@/lib/client/api-client";
import { handleError } from "@/lib/errorHandler";

type SessionData = {
    current: boolean;
    created_date: string;
    token_id: string;
    agent: string | null;
    ip_address: string | null;
}
interface SessionProps {
    sessions: SessionData[]
}
function Session({ sessions }: SessionProps) {

    const [sessionData, setSessionData] = useState<SessionData[]>(sessions);


    const handleTerminateSession = async (sessionId: string) => {
        try {
            await new RequestServer('Util/DeleteSession')
                .setQueryParams({ id: sessionId })
                .exec();

            addToast({
                title: "Correcto",
                description: 'Session terminada',
                color: "success",
                variant: "solid"
            });
            setSessionData(prev => prev.filter(s => s.token_id !== sessionId));
        } catch (error: any) {
            handleError(error);
        }
    }
    return (
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Sesiones Activas
                    </h2>
                    {/*<Button
                            size="sm"
                            variant="flat"
                            startContent={<RefreshCw className="w-4 h-4" />}
                            className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        >
                            Actualizar
                        </Button>*/}
                </div>
            </CardHeader>
            <CardBody className="pt-0">
                <div className="space-y-4">
                    {sessionData.map((session) => (
                        <div
                            key={session.token_id}
                            className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-default-50 to-default-100 border border-default-200 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar
                                    icon={<Monitor className="w-5 h-5" />}
                                    size="lg"

                                />
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-foreground text-lg">{session.agent}</h3>
                                        {session.current && (
                                            <Chip
                                                size="sm"
                                                color="success"
                                                variant="flat"
                                                startContent={<div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                                            >
                                                Sesión actual
                                            </Chip>
                                        )}
                                    </div>
                                    <p className="text-sm text-default-600 font-medium">
                                        • {session.ip_address}
                                    </p>
                                    <p className="text-xs text-default-400 mt-1">{formateaFechaRelativa(session.created_date)}</p>
                                </div>
                            </div>
                            {!session.current && (
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    startContent={<Trash2 className="w-4 h-4" />}
                                    onPress={() => handleTerminateSession(session.token_id)}
                                    className="hover:bg-danger-100 dark:hover:bg-danger-900/30"
                                >
                                    Terminar
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}

export default Session