import qrcode from "qrcode";

function generatePassword(length: number = 12, specialPrefix = "$"): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#%^&*_-+=?";
  const allChars = upper + lower + digits + special;

  const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  // Garantiza al menos uno de cada tipo
  const required = [
    getRandom(upper),
    getRandom(lower),
    getRandom(digits),
    specialPrefix, // el especial lo cubre el prefix
  ];

  // Rellena el resto hasta llegar al length
  const rest = Array.from(
    { length: length - required.length },
    () => getRandom(allChars)
  );

  // Mezcla todo para que no sea predecible
  return [...required, ...rest]
    .sort(() => Math.random() - 0.5)
    .join('');
}

function formateaFechaRelativa(fecha: Date | string | undefined): string {
  const ahora = new Date();
  if (!fecha) return '';
  const entrada = typeof fecha === 'string' ? new Date(fecha) : new Date(fecha);
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

function getCurrentYear(timeZone: string = "America/Mexico_City"): number {
  // Usamos Intl.DateTimeFormat para respetar la zona horaria
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
  });

  // Obtenemos el año como string y lo convertimos a número
  const yearString = formatter.format(new Date());
  return parseInt(yearString, 10);
}



export {
  getCurrentYear,
  generatePassword,
  formateaFechaRelativa,
  generateQr,
  parseToken
}