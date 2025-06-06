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

    // Store the original send function
    const originalSend = res.send;
    let responseBody: any;

    // Override the send function to capture the response body
    res.send = function (body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.on('error', err => {
      console.error(
        `${chalk.gray(formatDateTime(new Date()))} ` +
          `${chalk.red('ERROR')} ${chalk.white(originalUrl)} ` +
          `${chalk.red(err.message)}`,
      );
    });

    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const statusCode = res.statusCode;
      const methodColor = this.getMethodColor(method);
      const formattedStatus = this.formatStatusCode(statusCode);

      // Log basic request info
      console.log(
        `${chalk.gray(formatDateTime(new Date()))} ` +
          `[${methodColor(method)}] ${chalk.white(originalUrl)} ` +
          `${formattedStatus} ${chalk.gray(duration + 'ms')}`,
      );

      // Enhanced error logging for 4xx and 5xx status codes
      if (statusCode >= 400 && responseBody) {
        try {
          const errorResponse =
            typeof responseBody === 'string'
              ? JSON.parse(responseBody)
              : responseBody;

          console.error(
            '\n' +
              chalk.red('⚠️  Error Details:\n') +
              chalk.yellow('   Status: ') +
              chalk.red(errorResponse.statusCode) +
              '\n' +
              chalk.yellow('   Message: ') +
              chalk.red(errorResponse.message) +
              '\n' +
              chalk.yellow('   Error: ') +
              chalk.red(errorResponse.error) +
              '\n' +
              chalk.yellow('   Path: ') +
              chalk.red(originalUrl) +
              '\n',
          );
        } catch {
          console.error(chalk.red('Error parsing response:', responseBody));
        }
      }
    });

    next();
  }
}
