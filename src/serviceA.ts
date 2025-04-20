import { Service } from './decorators/service-decorator';
import { ServiceB } from './serviceB';

@Service()
export class ServiceA {
  constructor(public serviceB: ServiceB) {}

  public sayHello() {
    console.log('Hello, serviceA!');
  }
}
