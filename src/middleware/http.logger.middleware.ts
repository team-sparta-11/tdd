import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Logger from 'src/common/logger/logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, params, query, body, headers } = req;

    this.logger.info(
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
        `}\n`,
    );

    // response logging
    const responseHandler = res.send;
    res.send = function (responseBody) {
      const statusCode = res.statusCode;

      res.send = responseHandler;
      res.send(responseBody);
      this.logger.info(
        `HttpResponse [status: ${statusCode}]\n` +
          `Body: {` +
          JSON.stringify(JSON.parse(responseBody), null, '').replace(
            /,/g,
            ',\n',
          ) +
          `}`,
      );
    }.bind(this);

    next();
  }
}
