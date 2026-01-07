import { errorMessages } from "./errorMessages";
import { addToast } from "@heroui/react";

interface CustomError extends Error {
  code: number;
  name: string;
  details?: string;
}

export function handleError(error: CustomError) {
  const parts = error.name.split("|");

  // Posición 1 = código de error
  const codeKey = parts[1] || '';

  // Posición 2 = origen (USER, SYS, etc.)
  const origin = parts[2] || "";

  if(!codeKey || !origin) console.error("Error no reconocido:", error);
  // Buscar mensaje en diccionario
  const message = errorMessages[codeKey];

  const description =
    origin === "USER"
      ? message || "Ha ocurrido un error inesperado."
      : "Ocurrió un error.";


  addToast({
    title: `Error`,
    description: description,
    color: "danger",
    variant: "solid",
  });
}