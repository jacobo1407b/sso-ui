export class ErrorOauth extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly context?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(message: string, options: {
    code?: string;
    status?: number;
    context?: Record<string, any>;
    isOperational?: boolean;
  } = {}) {
    super(message);

    this.name = 'AppError';
    this.code = options.code || 'UNEXPECTED_ERROR';
    this.status = options.status || 500;
    this.context = options.context;
    this.isOperational = options.isOperational ?? true;

    // Captura stack trace sin incluir el constructor
    Error.captureStackTrace?.(this, ErrorOauth);
  }
}
