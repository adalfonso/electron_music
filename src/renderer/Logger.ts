/** Logger API */
export interface StandardLogger {
  log: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
}

/** Log implementation to wrap */
interface GenericLogger {
  log: (context: Record<string, unknown>) => void;
  info: (context: Record<string, unknown>) => void;
  warn: (context: Record<string, unknown>) => void;
  error: (context: Record<string, unknown>) => void;
}

/** Wraps a log implementation */
export class Logger implements StandardLogger {
  /**
   * Create a new logger
   *
   * @param _log - log implementation
   */
  constructor(private _log: GenericLogger) {}

  /**
   * Perform a generic log
   *
   * @param message - message to log
   * @param context - additional context
   */
  public log(message: string, context: Record<string, unknown> = {}) {
    this._log.log({ message, timestamp: new Date().toISOString(), context });
  }

  /**
   * Perform a informative log
   *
   * @param message - message to log
   * @param context - additional context
   */
  public info(message: string, context: Record<string, unknown> = {}) {
    this._log.info({ message, timestamp: new Date().toISOString(), context });
  }

  /**
   * Perform a warning log
   *
   * @param message - message to log
   * @param context - additional context
   */
  public warn(message: string, context: Record<string, unknown> = {}) {
    this._log.warn({ message, timestamp: new Date().toISOString(), context });
  }

  /**
   * Perform an error log
   *
   * @param message - message to log
   * @param context - additional context
   */
  public error(message: string, context: Record<string, unknown> = {}) {
    this._log.error({ message, timestamp: new Date().toISOString(), context });
  }
}
