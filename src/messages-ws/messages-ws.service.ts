import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConectedClients {
    [id: string]: { socket: Socket, user: User };
}

@Injectable()
export class MessagesWsService {


    private conectedClients: ConectedClients = {}


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {


    }

    async registerClient(client: Socket, id: string) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new Error("User not found");
        if (!user.isActive) throw new Error("User not active");
        this.checkUserConnection(user);
        this.conectedClients[client.id] = { socket: client, user };
        
     
    }

    removeClient(id: string) {
        delete this.conectedClients[id];
    }

    getConectedClients(): string[] {
        return Object.keys(this.conectedClients)
    }

    getUserFullNameBySocketId(socketId: string) {
        return this.conectedClients[socketId].user.fullName
    }

    private checkUserConnection(user: User) {
        
        for (const clientID of Object.keys(this.conectedClients)) {
            const conectedClient = this.conectedClients[clientID];
            if (conectedClient.user.id === user.id) {                                                        
                this.removeClient(clientID)
                conectedClient.socket.disconnect();
                break;
            }
        }
        //console.log( Object.keys(this.conectedClients));

    }



}
