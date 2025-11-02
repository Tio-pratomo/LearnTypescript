# Decorators & Advanced Patterns

Decorators adalah fitur TypeScript yang memungkinkan kita menambahkan **metadata** dan **memodifikasi** deklarasi class, method, property, atau parameter dengan syntax yang bersih. Mereka menyediakan cara untuk melakukan meta-programming dan aspect-oriented programming.

## Apa itu Decorators?

Decorator adalah fungsi khusus yang diawali dengan simbol `@` dan ditempatkan tepat sebelum deklarasi yang ingin dihias:

**Analogi**: Bayangkan Anda memiliki kue polos (sebuah class). Decorator adalah seperti lapisan gula, taburan, atau hiasan yang Anda tambahkan pada kue. Hiasan ini tidak mengubah resep dasar kue, tetapi mengubah penampilan atau menambahkan fungsionalitas baru.

## Mengaktifkan Decorators

⚠️ **Important**: Decorators adalah fitur experimental yang harus diaktifkan:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true // Optional, untuk reflection
  }
}
```

**Note**: TypeScript 5.0+ mendukung **Stage 3 decorators** yang merupakan standar ECMAScript terbaru. Untuk project baru, pertimbangkan menggunakan Stage 3 decorators.

## Class Decorators

Decorator yang diterapkan pada class declaration:

### Basic Class Decorator

```typescript
// Decorator function menerima constructor sebagai parameter
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class User {
  constructor(public name: string) {}
}

// User class sekarang sealed - tidak bisa ditambah property baru
const user = new User("Budi");
// (user as any).age = 25; // Runtime error jika strict mode
```

### Class Decorator dengan Return Value

```typescript
// Decorator yang memodifikasi atau replace class:
function Timestamped<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
    updatedAt = new Date();
  };
}

@Timestamped
class Product {
  constructor(public name: string, public price: number) {}
}

const product = new Product("Laptop", 15000000);
console.log((product as any).createdAt); // Date object
console.log((product as any).updatedAt); // Date object
```

### Decorator Factory (Class)

Factory pattern untuk decorator dengan parameters:

```typescript
// Decorator factory - function yang return decorator:
function Component(options: { selector: string; template: string }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    console.log(`Creating component: ${options.selector}`);
    return class extends constructor {
      selector = options.selector;
      template = options.template;
    };
  };
}

@Component({
  selector: "app-user",
  template: "<div>User Component</div>",
})
class UserComponent {
  constructor(public name: string) {}
}

const comp = new UserComponent("Budi");
console.log((comp as any).selector); // "app-user"
```

## Method Decorators

Decorator untuk methods di dalam class:

### Basic Method Decorator

```typescript
function Log(
  target: any, // Prototype dari class
  propertyKey: string, // Nama method
  descriptor: PropertyDescriptor // Method descriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }

  @Log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// Output:
// Calling add with args: [5, 3]
// Result: 8
```

### Method Decorator Factory

```typescript
function Retry(maxRetries: number = 3) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          console.log(`Retry ${i + 1}/${maxRetries}`);
          if (i === maxRetries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    return descriptor;
  };
}

class ApiService {
  @Retry(3)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  }
}
```

### Performance Measurement Decorator

```typescript
function Measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} executed in ${(end - start).toFixed(2)}ms`);
    return result;
  };

  return descriptor;
}

class DataProcessor {
  @Measure
  processLargeDataset(data: number[]): number {
    return data.reduce((sum, n) => sum + n, 0);
  }
}

const processor = new DataProcessor();
processor.processLargeDataset(Array.from({ length: 1000000 }, (_, i) => i));
// Output: processLargeDataset executed in 5.32ms
```

## Property Decorators

Decorator untuk class properties:

```typescript
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false,
  });
}

function DefaultValue(value: any) {
  return function (target: any, propertyKey: string) {
    let val = value;

    const getter = function () {
      return val;
    };

    const setter = function (newVal: any) {
      console.log(`Setting ${propertyKey} to ${newVal}`);
      val = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class Configuration {
  @ReadOnly
  readonly apiVersion: string = "v1";

  @DefaultValue("http://localhost:3000")
  apiUrl!: string;
}

const config = new Configuration();
console.log(config.apiUrl); // "http://localhost:3000"
config.apiUrl = "https://api.example.com"; // Logs: Setting apiUrl to ...
```

### Validation Decorator

```typescript
function Required(target: any, propertyKey: string) {
  let value: any;

  const getter = function () {
    return value;
  };

  const setter = function (newVal: any) {
    if (newVal === null || newVal === undefined || newVal === "") {
      throw new Error(`${propertyKey} is required`);
    }
    value = newVal;
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

function MinLength(min: number) {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = function () {
      return value;
    };

    const setter = function (newVal: string) {
      if (newVal.length < min) {
        throw new Error(`${propertyKey} must be at least ${min} characters`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class UserForm {
  @Required
  email!: string;

  @MinLength(8)
  password!: string;
}

const form = new UserForm();
// form.email = "";  // ❌ Error: email is required
form.email = "user@example.com"; // ✅ OK
// form.password = "123";  // ❌ Error: password must be at least 8 characters
form.password = "securepass123"; // ✅ OK
```

## Accessor Decorators

Decorator untuk getter/setter:

```typescript
function Configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Person {
  private _age: number = 0;

  @Configurable(false)
  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }
}
```

## Parameter Decorators

Decorator untuk method parameters:

```typescript
function Required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParams: number[] =
    Reflect.getOwnMetadata("required", target, propertyKey) || [];
  existingRequiredParams.push(parameterIndex);
  Reflect.defineMetadata(
    "required",
    existingRequiredParams,
    target,
    propertyKey
  );
}

function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const requiredParams: number[] =
      Reflect.getOwnMetadata("required", target, propertyKey) || [];

    for (const index of requiredParams) {
      if (args[index] === null || args[index] === undefined) {
        throw new Error(`Parameter at index ${index} is required`);
      }
    }

    return method.apply(this, args);
  };
}

class UserService {
  @Validate
  createUser(@Required name: string, @Required email: string, age?: number) {
    console.log(`Creating user: ${name}, ${email}, ${age}`);
  }
}

const service = new UserService();
service.createUser("Budi", "budi@example.com", 25); // ✅ OK
// service.createUser(null as any, "budi@example.com");  // ❌ Error
```

## Decorator Composition

Multiple decorators dapat diterapkan pada satu declaration:

```typescript
// Evaluation order: top-to-bottom untuk factories,
// bottom-to-top untuk decorator functions

function First() {
  console.log("First: factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("First: called");
  };
}

function Second() {
  console.log("Second: factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("Second: called");
  };
}

class Example {
  @First()
  @Second()
  method() {}
}

// Output:
// First: factory evaluated
// Second: factory evaluated
// Second: called
// First: called
```

## Dependency Injection Pattern

Decorator-based dependency injection adalah pattern powerful untuk managing dependencies:

### Simple DI Container

```typescript
// reflect-metadata diperlukan untuk type reflection
import "reflect-metadata";

// Service container
class Container {
  private static services: Map<string, any> = new Map();

  static register(key: string, implementation: any): void {
    Container.services.set(key, implementation);
  }

  static get<T>(key: string): T {
    return Container.services.get(key);
  }
}

// Injectable decorator
function Injectable(serviceName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Container.register(serviceName, new constructor());
    return constructor;
  };
}

// Inject decorator
function Inject(serviceName: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return Container.get(serviceName);
      },
      enumerable: true,
      configurable: true,
    });
  };
}

// Services
interface LoggerService {
  log(message: string): void;
}

@Injectable("logger")
class ConsoleLogger implements LoggerService {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

interface DatabaseService {
  save(data: any): void;
}

@Injectable("database")
class MockDatabase implements DatabaseService {
  save(data: any): void {
    console.log(`[DB]: Saved ${JSON.stringify(data)}`);
  }
}

// Usage in a class
class UserService {
  @Inject("logger")
  private logger!: LoggerService;

  @Inject("database")
  private database!: DatabaseService;

  createUser(name: string, email: string) {
    this.logger.log(`Creating user: ${name}`);
    this.database.save({ name, email });
    return { success: true };
  }
}

// Use the service
const userService = new UserService();
userService.createUser("Budi", "budi@example.com");
// Output:
// [LOG]: Creating user: Budi
// [DB]: Saved {"name":"Budi","email":"budi@example.com"}
```

### Advanced DI with Auto-Injection

```typescript
const INJECTABLE_METADATA_KEY = Symbol("injectable");

function Injectable() {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, constructor);

    // Get constructor parameter types
    const paramTypes =
      Reflect.getMetadata("design:paramtypes", constructor) || [];

    // Auto-instantiate with dependencies
    const instance = new constructor(
      ...paramTypes.map((type: any) => {
        if (Reflect.getMetadata(INJECTABLE_METADATA_KEY, type)) {
          return Container.get(type.name);
        }
        return undefined;
      })
    );

    Container.register(constructor.name, instance);
    return constructor;
  };
}

@Injectable()
class Logger {
  log(msg: string) {
    console.log(`[Logger]: ${msg}`);
  }
}

@Injectable()
class Database {
  save(data: any) {
    console.log(`[Database]: Saved`, data);
  }
}

@Injectable()
class UserService {
  constructor(private logger: Logger, private database: Database) {}

  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
    this.database.save({ name });
  }
}

// Auto-wired!
const service = Container.get<UserService>("UserService");
service.createUser("Andi");
```

## Real-World Design Patterns

### Singleton Pattern

```typescript
function Singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  let instance: T;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance as any;
      }
      super(...args);
      instance = this as any;
    }
  };
}

@Singleton
class AppConfig {
  constructor(public apiUrl: string = "http://localhost:3000") {}

  getConfig() {
    return { apiUrl: this.apiUrl };
  }
}

const config1 = new AppConfig();
const config2 = new AppConfig("https://api.example.com");
console.log(config1 === config2); // true (same instance!)
```

### Memoization Pattern

```typescript
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}`);
      return cache.get(key);
    }

    console.log(`Computing ${propertyKey}`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class Fibonacci {
  @Memoize
  calculate(n: number): number {
    if (n <= 1) return n;
    return this.calculate(n - 1) + this.calculate(n - 2);
  }
}

const fib = new Fibonacci();
console.log(fib.calculate(10)); // Computes once
console.log(fib.calculate(10)); // Cache hit!
```

### Authorization Pattern

```typescript
function Authorized(roles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const userRole = (this as any).currentUserRole || "guest";

      if (!roles.includes(userRole)) {
        throw new Error(
          `Unauthorized: ${userRole} cannot access ${propertyKey}`
        );
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class AdminPanel {
  currentUserRole: string = "guest";

  @Authorized(["admin"])
  deleteUser(userId: number) {
    console.log(`User ${userId} deleted`);
  }

  @Authorized(["admin", "moderator"])
  banUser(userId: number) {
    console.log(`User ${userId} banned`);
  }
}

const panel = new AdminPanel();
panel.currentUserRole = "admin";
panel.deleteUser(123); // ✅ OK

panel.currentUserRole = "guest";
// panel.deleteUser(123);  // ❌ Error: Unauthorized
```

## Best Practices

**Use Decorator Factories** — Untuk flexibility dan configuration.

**Keep Decorators Simple** — Single responsibility, tidak terlalu complex.

**Document Behavior** — Decorator mengubah behavior, harus well-documented.

**Enable Metadata** — Gunakan `emitDecoratorMetadata` untuk type reflection.

**Consider Stage 3** — Untuk project baru, gunakan Stage 3 decorators.

**Avoid Overuse** — Jangan decorator everything, gunakan dengan bijak.

## Ringkasan

**Class Decorators** — Memodifikasi atau replace entire class.

**Method Decorators** — Add behavior ke methods (logging, caching, retry).

**Property Decorators** — Add metadata atau validation ke properties.

**Parameter Decorators** — Mark parameters untuk validation atau injection.

**DI Pattern** — Powerful pattern untuk dependency management.

**Design Patterns** — Singleton, memoization, authorization via decorators.

## Latihan Praktik

Buat file `src/decorators-practice.ts`:

```typescript
// 1. Buat @Log decorator yang:
//    - Log method name, arguments, dan return value
//    - Measure execution time

// 2. Buat @Cache decorator dengan TTL:
//    - Memoize method results
//    - Cache expires setelah N seconds

// 3. Buat validation decorators:
//    - @Min(value) dan @Max(value) untuk numbers
//    - @Email() untuk email strings
//    - Apply ke class properties

// 4. Implement simple DI container:
//    - @Injectable() untuk services
//    - @Inject('serviceName') untuk dependencies
//    - Auto-wire UserService dengan Logger dan Database

// 5. Buat @Debounce(ms) decorator:
//    - Delay method execution
//    - Cancel previous calls jika dipanggil lagi dalam delay

// Test semua decorators!
```
