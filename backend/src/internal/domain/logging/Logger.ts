export interface Logger {
  log(message: string): void;
  warn(message: string): void;
  error(message: string, trace?: string): void;
  withContext(context: string): Logger;
}
