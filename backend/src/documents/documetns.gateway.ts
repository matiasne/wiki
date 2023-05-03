import { Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Repository } from 'typeorm';
import { DocumentText } from './entities/document.entity';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
export class DocumentsGateway {
  constructor(
    @InjectRepository(DocumentText)
    private readonly documentsRepository: Repository<DocumentText>,
  ) {}

  @WebSocketServer() server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('connect-to-document')
  async subscribeToDocument(
    @MessageBody() payload: { userName: string; nodeId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const room = payload.nodeId;
    socket.join(room);

    let doc = await this.documentsRepository.findOne({
      where: { id: payload.nodeId },
    });

    if (doc) {
      this.logger.debug('docExists', room);
      socket.emit('conectado', doc.data);
      socket.to(room).emit('load-document', doc.data);

      socket.emit('load-document', doc.data);
    } else {
      this.logger.debug('doc not Exists');
      doc = this.documentsRepository.create({
        id: payload.nodeId,
        data: '',
      });
      await this.documentsRepository.save(doc);
      socket.emit('load-document', '');
    }
  }

  @SubscribeMessage('start-editing')
  async connectTODocument(
    @MessageBody() payload: { userName: string; nodeId: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.debug('start-editing');

    const room = payload.nodeId;

    socket.to(room).emit('user-connect', payload.userName);

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(room).emit('receive-changes', delta);
    });

    socket.on('send-cursor-changes', (data) => {
      socket.broadcast.to(room).emit('receive-cursor-changes', data);
    });

    socket.on('save-document', async (data) => {
      let resp = await this.documentsRepository.update(payload.nodeId, {
        data: data.ops[0].insert,
      });
    });

    socket.on('disconnect', (data) => {
      socket.in(room).emit('user-disconnect', payload.userName);
      socket.leave(room);
    });
  }
}
