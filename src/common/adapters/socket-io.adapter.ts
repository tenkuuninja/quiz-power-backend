import * as WebSocket from 'ws';
import { INestApplicationContext } from '@nestjs/common';
import { isFunction } from '@nestjs/common/utils/shared.utils';
import {
  AbstractWsAdapter,
  MessageMappingProperties,
} from '@nestjs/websockets';
import { EMPTY, Observable, fromEvent } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { Server } from 'socket.io';

export class SocketIoAdapter extends AbstractWsAdapter {
  constructor(
    appOrHttpServer?: INestApplicationContext | any,
    private readonly corsOrigins = [],
  ) {
    console.log('abc');
    super(appOrHttpServer);
  }

  public create(
    port: number,
    options?: any & { namespace?: string; server?: any },
  ): any {
    console.log('socket create', port, options);
    if (!options) {
      return this.createIOServer(port);
    }
    const { namespace, server, ...opt } = options;
    return server && isFunction(server.of)
      ? server.of(namespace)
      : namespace
      ? this.createIOServer(port, opt).of(namespace)
      : this.createIOServer(port, opt);
  }

  public createIOServer(port: number, options?: any): any {
    const MAX_BUFFER_SIZE = 1e6; // 1MB
    if (this.httpServer && port === 0) {
      const server = new Server(this.httpServer, {
        cors: {
          origin: this.corsOrigins,
          methods: ['GET', 'POST'],
          credentials: true,
        },
        maxHttpBufferSize: MAX_BUFFER_SIZE,
      });

      return server;
    }
    return new Server(port, options);
  }

  public bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    const message = JSON.parse(buffer.data);
    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return process(messageHandler.callback(message.data));
  }
}
