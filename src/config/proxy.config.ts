import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const proxyConfig = registerAs('proxyConfig', () => ({
  proxyOptions: {
    name: 'ConcertService',
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: process.env['SERVICE_PORT'],
    },
  },
}));
