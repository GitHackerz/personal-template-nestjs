import { Injectable, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import { formatDateTime } from '../../utils/helpers';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private getMethodColor(method: string): chalk.Chalk {
        switch (method.toUpperCase()) {
            case 'GET':
                return chalk.green;
            case 'POST':
                return chalk.yellow;
            case 'PUT':
                return chalk.blue;
            case 'DELETE':
                return chalk.red;
            default:
                return chalk.white;
        }
    }

    private formatStatusCode(statusCode: number): string {
        if (statusCode < 300) return chalk.green(statusCode);
        if (statusCode < 400) return chalk.cyan(statusCode);
        if (statusCode < 500) return chalk.yellow(statusCode);
        return chalk.red(statusCode);
    }

    use(req: Request, res: Response, next: NextFunction): void {
        const startTime = Date.now();
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const statusCode = res.statusCode;
            const methodColor = this.getMethodColor(method);
            const formattedStatus = this.formatStatusCode(statusCode);

            console.log(
                `${chalk.gray(formatDateTime(new Date()))} ` +
                    `[${methodColor(method)}] ${chalk.white(originalUrl)} ` +
                    `${formattedStatus} ${chalk.gray(duration + 'ms')} ` +
                    `${chalk.gray('from')}`
            );

            if (statusCode >= 400) {
                console.error(chalk.red('Error Response:'), res.statusMessage);
            }
        });

        next();
    }
}
