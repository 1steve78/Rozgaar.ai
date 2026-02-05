/**
 * Environment-Aware Logger
 * 
 * Provides structured logging that is automatically disabled in production.
 * This prevents sensitive information from being logged in production environments
 * while maintaining useful debug information during development.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    context?: string;
    data?: Record<string, unknown>;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

class Logger {
    private context: string;

    constructor(context: string = 'App') {
        this.context = context;
    }

    /**
     * Format log message with context and timestamp
     */
    private format(level: LogLevel, message: string, options?: LoggerOptions): string {
        const timestamp = new Date().toISOString();
        const ctx = options?.context || this.context;
        return `[${timestamp}] [${level.toUpperCase()}] [${ctx}] ${message}`;
    }

    /**
     * Log debug information (development only)
     */
    debug(message: string, options?: LoggerOptions): void {
        if (!IS_DEVELOPMENT) return;

        console.log(this.format('debug', message, options));
        if (options?.data) {
            console.log('  Data:', options.data);
        }
    }

    /**
     * Log general information (development only)
     */
    info(message: string, options?: LoggerOptions): void {
        if (IS_PRODUCTION) return;

        console.info(this.format('info', message, options));
        if (options?.data) {
            console.info('  Data:', options.data);
        }
    }

    /**
     * Log warnings (all environments)
     */
    warn(message: string, options?: LoggerOptions): void {
        console.warn(this.format('warn', message, options));
        if (options?.data && IS_DEVELOPMENT) {
            console.warn('  Data:', options.data);
        }
    }

    /**
     * Log errors (all environments)
     */
    error(message: string, error?: Error | unknown, options?: LoggerOptions): void {
        console.error(this.format('error', message, options));

        if (error) {
            if (error instanceof Error) {
                console.error('  Error:', error.message);
                if (IS_DEVELOPMENT && error.stack) {
                    console.error('  Stack:', error.stack);
                }
            } else {
                console.error('  Error:', error);
            }
        }

        if (options?.data && IS_DEVELOPMENT) {
            console.error('  Data:', options.data);
        }
    }
}

/**
 * Create a logger instance with optional context
 */
export function createLogger(context?: string): Logger {
    return new Logger(context);
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Convenience exports for common use cases
 */
export const log = {
    debug: (message: string, data?: Record<string, unknown>) => logger.debug(message, { data }),
    info: (message: string, data?: Record<string, unknown>) => logger.info(message, { data }),
    warn: (message: string, data?: Record<string, unknown>) => logger.warn(message, { data }),
    error: (message: string, error?: Error | unknown) => logger.error(message, error),
};
