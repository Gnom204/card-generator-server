import { Request } from "express";

export type CastomRequest<T> = Request<{ id: string }, {}, T, {}>;
