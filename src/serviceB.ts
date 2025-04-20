import { Service } from './decorators/service-decorator';
import { ServiceA } from './serviceA';

@Service()
export class ServiceB {
  constructor(public serviceA: ServiceA) {}
  public sayHello() {
    console.log('Hello, ServiceB');
  }
}
