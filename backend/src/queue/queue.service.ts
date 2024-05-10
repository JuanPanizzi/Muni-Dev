/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TurnoDni } from 'src/interfaces/turnoDni';

@Injectable()
export class QueueService {

    private usuarios: TurnoDni[] = [];

    addUser(user: TurnoDni){
        this.usuarios.push(user)
    }

    removeUser(user){
        this.usuarios.shift()
    }
    getUsers(){
        return this.usuarios;
    }

    resetUsers(){
        console.log('queueService-resetUsers() ejecutado')
        this.usuarios.splice(0, this.usuarios.length);
    }
}
