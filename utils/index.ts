import qrcode from "qrcode";

function generatePassword(length: number = 12, specialPrefix = "$"): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const allChars = upper + lower + digits;

  let password = specialPrefix;

  for (let i = 0; i < length - 1; i++) {
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
    password += randomChar;
  }

  return password;
}
function formateaFechaRelativa(fecha: Date | string | undefined): string {
  const ahora = new Date();
  if (!fecha) return '';
  const entrada = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const diffMs = ahora.getTime() - entrada.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
  if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras === 1 ? '' : 's'}`;

  // Mostrar fecha completa en español
  const opciones: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return entrada.toLocaleDateString('es-MX', opciones);
}

function generateQr(str?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(str ?? "", function (err, url) {
      if (err) reject(err);
      resolve(url)
    })
  })
}


function parseToken(token?: string) {
  if (token) {
    const parts = token.split(".");
    return JSON.parse(atob(parts[1]));
  } else {
    return {}
  }

}


export {
  generatePassword,
  formateaFechaRelativa,
  generateQr,
  parseToken
}