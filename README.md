# JP version read.md | KR version read.md
- [🇯🇵 日本語版](#typedi-実装-jp)
- [🇰🇷 한국어판](#typedi-구현-kr)

- [🇯🇵 日本語版](#--typedi-実装-jp)
- [🇰🇷 한국어판](#--typedi-구현kr)

---

# 🛠️ typedi 実装 (JP)

## 📌 概要
NestJSで使用される `@Injectable()`, `@Service()`, `@Controller()` のようなデコレーターをベースとした  
**DI（Dependency Injection, 依存性注入）** が実際にどのように動作しているのかに興味を持ちました。  
そこで、**typedi のコア原理** を 0 から自分で実装し、内部の仕組みを理解することを目的に学習しました。  

## 🚀 学習方法
1. **TypeScript の公式ドキュメント** を精読し、基礎を固めました。  
2. `typedi` の実際の実装コードを **30回以上手で書き写し**、コードを体に覚え込ませました。  
3. 単なる暗記ではなく、**コードを暗唱してから仕組みを理解** することで学習を進めました。  

## 🎯 目標
- `typedi` の **ライフサイクル** と動作フローを理解する  
- **DIコンテナを自作** しながら内部メカニズムを体得する  
- NestJS のようなフレームワークがどのように依存性を管理しているかを具体的に理解する  

## 📂 サンプルコード（一部抜粋）

```ts
// シンプルな Service / Controller の依存性注入実装例
class Container {
  private services = new Map();

  set(token: any, instance: any) {
    this.services.set(token, instance);
  }

  get<T>(token: new (...args: any[]) => T): T {
    const instance = this.services.get(token);
    if (!instance) {
      const created = new token();
      this.services.set(token, created);
      return created;
    }
    return instance;
  }
}

// 使用例
class UserService {
  getUser() {
    return { id: 1, name: "changhyeon" };
  }
}

class UserController {
  constructor(private userService: UserService) {}

  getUserInfo() {
    return this.userService.getUser();
  }
}

// 実行
const container = new Container();
const userService = container.get(UserService);
const controller = new UserController(userService);

console.log(controller.getUserInfo()); // { id: 1, name: "changhyeon" }
```


# KR version read.md
---

# 🛠️ typedi 구현 (KR)

## 📌 개요
NestJS에서 사용하는 `@Injectable()`, `@Service()`, `@Controller()` 같은 데코레이터 기반 **DI(Dependency Injection)** 가 실제로 어떤 원리로 동작하는지 궁금했습니다.  
그래서 **typedi의 핵심 원리**를 직접 0부터 구현해보며 내부 동작 방식을 이해하는 것을 목표로 진행했습니다.

## 🚀 학습 방법
1. **타입스크립트 공식 문서**를 정독하며 기본기를 다졌습니다.  
2. `typedi`의 실제 구현 코드를 **30회 이상 직접 타이핑**하여 손에 익혔습니다.  
3. 단순 암기가 아닌, **TS의 METADATA와 Map<> 기반의 class Id, Instance 저장 원리를 이해**하며 학습했습니다.  

## 🎯 목표
- `typedi`의 **라이프사이클**과 동작 흐름 이해  
- DI 컨테이너를 **직접 구현**하며 내부 메커니즘 체득  
- NestJS와 같은 프레임워크가 어떻게 의존성을 관리하는지 구체적으로 이해  

## 📂 예제 코드 (발췌)

```ts
// 간단한 Service/Controller 의존성 주입 구현 예시
class Container {
  private services = new Map();

  set(token: any, instance: any) {
    this.services.set(token, instance);
  }

  get<T>(token: new (...args: any[]) => T): T {
    const instance = this.services.get(token);
    if (!instance) {
      const created = new token();
      this.services.set(token, created);
      return created;
    }
    return instance;
  }
}

// 사용 예시
class UserService {
  getUser() {
    return { id: 1, name: "changhyeon" };
  }
}

class UserController {
  constructor(private userService: UserService) {}

  getUserInfo() {
    return this.userService.getUser();
  }
}

// 실행
const container = new Container();
const userService = container.get(UserService);
const controller = new UserController(userService);

console.log(controller.getUserInfo()); // { id: 1, name: "changhyeon" }
```
