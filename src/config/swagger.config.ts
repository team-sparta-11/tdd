import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export default (app: INestApplication) => {
  if (process.env['NODE_ENV'] !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('Team sparta 11')
      .setDescription('tdd concert reservation')
      .setVersion('0.0.1')
      //
      .addBearerAuth() // bearer token
      .addSecurityRequirements('bearer')
      //
      // .addServer(`http://localhost:${process.env['APP_PORT']}`)
      .addServer(`http://localhost:3000`)
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, customOptions);
  }
};
