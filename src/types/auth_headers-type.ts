import { AxiosRequestHeaders } from "axios";

// export type NonUndefined<T, E = undefined> = Pick<
//   T,
//   {
//     [Prop in keyof T]: T[Prop] extends E ? never : Prop;
//   }[keyof T]
// >;
// interface Headers extends AxiosRequestHeaders {
//   "X-KEY": string;
//   "X-Secret": string;
// }

// type AuthHeaders = NonUndefined<Headers>;

interface AuthHeaders {
  "X-KEY": string;
  "X-Secret": string;
}

export default AuthHeaders;
