import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/http.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.log(error.status);

  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  res.status(status).send({
    success: false,
    status,
    message,
  });
}

export default errorMiddleware;
