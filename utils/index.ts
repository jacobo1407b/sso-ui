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

export {
    generatePassword
}