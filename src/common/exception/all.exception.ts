import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception?.response?.message ||
      exception?.message ||
      'Internal server error';

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    if (
      [HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_REQUEST].includes(
        httpStatus,
      ) &&
      message !== undefined &&
      !Array.isArray(message)
    ) {
      message = [message];
    }

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      error: exception?.name?.replace('Exception', '') || 'Error',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
