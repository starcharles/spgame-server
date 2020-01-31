import {NextFunction, Request, RequestHandler, Response} from "express";

type PromiseRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export function asyncMw(fn: PromiseRequestHandler): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}
