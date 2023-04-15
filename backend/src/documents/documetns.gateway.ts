import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
export class DocumentsGateway {
  @WebSocketServer() server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('get-document')
  getDocument(
    @MessageBody() payload: { userName: string; documentId: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.join(payload.documentId);
    //acá regsitra un color nuevo

    socket.emit('load-document', ' ');

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(payload.documentId).emit('receive-changes', delta);
    });

    socket.on('send-cursor-changes', (data) => {
      this.logger.debug(payload);
      socket.broadcast
        .to(payload.documentId)
        .emit('receive-cursor-changes', data);
    });

    socket.on('save-document', async (data) => {
      // await Document.findByIdAndUpdate(documentId, { data })
    });

    socket.in(payload.documentId).emit('load-document', payload);

    socket.on('disconnect', (data) => {
      socket.in(payload.documentId).emit('user-disconnect', payload.userName);
      socket.leave(payload.documentId);
    });
  }
}
