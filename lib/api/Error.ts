export default class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,    // Agregado para "REFRESH_NOT_FOUND"
    public details?: string, // Agregado para "SYS"
    public data?: any        // Opcional, por si recibes algo extra
  ) {
    super(message);
    this.name = 'ApiError';
  }
}