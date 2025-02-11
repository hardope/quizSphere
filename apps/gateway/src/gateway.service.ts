import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  getHello(): string {
    return '<h1>Sphere API Gateway</h1>';
  }
}
