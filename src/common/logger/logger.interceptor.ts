import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import Logger from './logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  constructor(private options?: { excludes?: string[] }) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<Request>();
    const res = httpCtx.getResponse<Response>();

    const before = Date.now();
    const { method, url, params, query, body, headers } = req;

    const reqLogs =
      `HttpRequest [${method}] ${url}\n` +
      `Headers: {\n` +
      Object.keys(headers)
        .map((key) => ` "${key}": "${headers[key]}"`)
        .join(',\n') +
      '\n}\n' +
      `Params: ${JSON.stringify(params, null, 2)}\n` +
      `Query: ${JSON.stringify(query, null, 2).replace(/,/g, ',/n')}\n` +
      `Body: {` +
      Object.keys(body)
        .map((key) => ` "${key}": ${body[key]}`)
        .join(',\n') +
      `}\n`;

    return next.handle().pipe(
      tap((data) => {
        if (this.options.excludes.includes(req.route.path)) return;

        const resLogs =
          `HttpResponse [status: ${res.statusCode}] [duration: ${
            Date.now() - before
          } ms] \n` +
          `Body: ` +
          JSON.stringify(data, null, '').replace(/,/g, ',\n');
        this.logger.info(reqLogs + resLogs, LoggerInterceptor.name);
      }),
    );
  }
}
