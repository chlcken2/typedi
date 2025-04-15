import { Token } from "../token";
import { AbstractConstructable } from "./abstract-constructable.type";
import { Constructable } from "./constructable";

export type ServiceIdentifier<T=unknown> =
| Constructable<T>
| AbstractConstructable<T>
| CallableFunction
| Token<T>
| string;