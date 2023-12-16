import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyService implements OnApplicationBootstrap {
  public readonly service: ClientProxy;
  constructor(private configService: ConfigService) {
    this.service = ClientProxyFactory.create(
      this.configService.get('proxyConfig')['proxyOptions'],
    );
  }

  async onApplicationBootstrap() {
    this.service.connect().then((_r) => {
      console.log(`proxy connected! ${this.service['port']}`);
    });
  }
}
