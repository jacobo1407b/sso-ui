import { TIMEOUT } from "dns";

// errorMessages.ts
export const errorMessages: Record<string, string> = {
    VALIDATION_ERROR: "Error de validación en los datos enviados.",
    UN_AUTORIZE: "No autorizado. Verifica tus credenciales o roles.",
    CLIENT_NOT_FOUND: "Cliente no encontrado en el sistema.",
    MFA_WAIT: "Se requiere completar el proceso de autenticación multifactor.",
    TOKEN_NOT_FOUND: "Token no encontrado.",
    REFRESH_NOT_FOUND: "Token de refresco no encontrado.",
    USR_NOT_FOUND: "Usuario no encontrado.",
    BAD_PASS: "Contraseña incorrecta.",
    CODE_NOT_FOUND: "Código no encontrado.",
    APP_ALREADY: "La aplicación ya existe.",
    DNT_DELET_SSO: "No se puede eliminar la configuración SSO.",
    ROL_ALREADY: "El rol ya existe.",
    DNT_DELETE_ROL_SYS: "No se puede eliminar un rol del sistema.",
    EMAIL_ALREADY: "El correo electrónico ya está registrado.",
    ERR_RETRIEVING_USER: "Código incorrecto. {fails} intentos restantes.",
    ERR_2FA_TOTP_MAX_ATTEMPTS: "Se alcanzó el número máximo de intentos de 2FA.",
    ERR_2FA_TOTP_LOCKED: "El acceso por 2FA ha sido bloqueado.",
    BAD_REQUEST_NOT_IMAGE: "El archivo enviado no es una imagen válida.",
    BAD_REQUEST_NULL_FIELDS: "Existen campos requeridos que están vacíos.",
    ERROR_FILE_DOWNLOAD: "Error al descargar el archivo.",
    SERVICE_NOT_DEFINED: "Servicio no definido.",
    ENDPOINT_NOT_DEFINED: "Endpoint no definido.",
    TIMEOUT_ERROR: "La solicitud ha excedido el tiempo de espera.",
};