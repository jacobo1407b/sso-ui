import React from 'react';
import DetailsApp from '@/components/Applications/Details';


const mockAppWithGrants = {
    client_secret: "x9v7k2s1p0_secret_key",
    client_id: "infra_app_azc_2025_002",
    app_name: "InfraGestor CDMX",
    description: "Gestor de autenticación y permisos para aplicaciones urbanas en Azcapotzalco.",
    redirect_callback: "https://infra.azc.mx/oauth/callback",
    scopes: "read:users write:config manage:grants",
    is_active: true,
    app_type: "confidential",
    client_icon_url: "https://fastly.picsum.photos/id/670/200/200.jpg?hmac=r8TCUI8W_ykYaZnXA3SXAoh2eXVWEefFjjZ2VsLJBXg",
    created_by: "jacobo.hernandez@infra-tech.mx",
    grants: [
        {
            id: "1",
            description: "Permite lectura de usuarios registrados en el sistema.",
            grants_name: "Lectura de usuarios",
            icon_text: "👤",
            grant_code: "read:users",
            created_date: "2025-09-01T10:15:00Z"
        },
        {
            id: "2",
            description: "Autoriza la modificación de configuraciones de seguridad.",
            grants_name: "Configuración de seguridad",
            icon_text: "🔐",
            grant_code: "write:config",
            created_date: "2025-09-01T10:16:00Z"
        },
        {
            id: "3",
            description: "Gestión completa de permisos y roles en el sistema.",
            grants_name: "Gestión de permisos",
            icon_text: "🛡️",
            grant_code: "manage:grants",
            created_date: "2025-09-01T10:17:00Z"
        }
    ]
};

export default function AppDetails() {
    return <DetailsApp appOne={mockAppWithGrants} />
}
