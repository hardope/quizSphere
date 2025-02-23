import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  getHello(): string {
    return '<h1><b>Sphere API Gateway</b></h1>';
  }
}
