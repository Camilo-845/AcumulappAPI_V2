/**
 * Genera una cadena alfanumérica aleatoria de una longitud específica.
 * @param length La longitud deseada para la cadena.
 * @returns Una cadena alfanumérica aleatoria.
 */
export function generateAlphanumericCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
