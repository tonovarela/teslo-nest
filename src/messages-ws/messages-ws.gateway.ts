import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './DTO/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService, private jwtService: JwtService) { }
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload : JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client,payload.id)
    } catch (e) {
      client.disconnect();
      return;
    }        
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());

  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClients());    
  }

  @SubscribeMessage("onMessage")
  handleMessageClient(client: Socket, payload: NewMessageDto) {
    //console.log(client.id,payload);

    //Solo al client
    //client.emit("onServerMessage", { fullName: "Desde es el server", message: payload.message || "No-message" })
    //Todos a excepcion del cliente
    //client.broadcast.emit("onServerMessage", { fullName: "Desde es el server", message: payload.message || "No-message" })
    //Todos
    this.wss.emit("onServerMessage", { fullName: this.messagesWsService.getUserFullNameBySocketId(client.id), message: payload.message || "No-message" })
  }

  

}
