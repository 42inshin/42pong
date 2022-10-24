import { ExceptionFilter, Catch, ArgumentsHost, HttpException, WsExceptionFilter } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Request, response, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends  BaseWsExceptionFilter  {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log("Exception Filter Active!");
    response.statusCode = 409;
    response.statusMessage = "WsException";
  }
}