import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EContestSocketEvent } from './enum';
import { contestStore } from './constants/store';

@WebSocketGateway({
  // namespace: 'contest',
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ContestSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EContestSocketEvent.SubscribeContest)
  subscribeContest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const contest = contestStore[data.contestId];
    if (contest) {
      client.join('contest-' + data.contestId);
      this.server
        .to(client.id)
        .emit(EContestSocketEvent.UpdateContest, contest);
    }
    console.log(EContestSocketEvent.SubscribeContest, client?.id, data);
  }

  updateContestToClient(contest: any) {
    this.server
      .to('contest-' + contest?.id)
      .emit(EContestSocketEvent.UpdateContest, contest);
  }

  afterInit(server: Server) {
    console.log('Socket server initialized');
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected ${client.id}`);
    //Do stuffs
  }
}
