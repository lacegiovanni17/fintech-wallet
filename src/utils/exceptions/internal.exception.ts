import HttpException from "./http.exception";

export class InternalException extends HttpException {
  constructor(message: string) {
    super(500, message);
  }
}
