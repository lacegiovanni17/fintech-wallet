import HttpException from "./http.exception";

export class BadRequestsException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
