export interface IGenericResponseModel<T = any> {
    message?: string;
    data: T;
    statusCode?: number;
    success?: boolean;
  }
