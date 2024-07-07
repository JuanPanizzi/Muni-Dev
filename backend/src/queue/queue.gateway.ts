/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MensajeNextUser } from 'src/interfaces/message';
import { TurnoDni } from 'src/interfaces/TurnoDni';


@WebSocketGateway({ cors: 'https://municipalidad-client.vercel.app/' })
export class QueueGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(private readonly queueService: QueueService) { }



  onModuleInit() {

    //Se escuchan todas las conexiones de todos los sockets - Pantalla usuario, pantalla central y boxes

    this.server.on('connection', (socket: Socket) => {

      const { deviceType, deviceId } = socket.handshake.query;

      //Primera barrera - se controla que la conexion ande
      // socket.on('sendDni', (turnoDni, callback)=>{
      //   callback({
      //     status: "ok"
      //   })
      // })

      //Segunda barrera - se controla que el mensaje desde hometeclado llegue bien a pantalla



      // console.log(`socket conectado: ${socket.id}`)

      //SE UNE PANTALLA A LA ESTA SALA
      socket.on('joinPantallaRoom', () => {
        if (deviceType === 'pantalla') {
          socket.join('pantallaRoom');
          console.log('socket pantalla se ha unido a la sala pantallaRoom')
        }
      });

      socket.once('disconnect', () => {
        console.log(`cliente desconectado ${socket.id}`)

        if (deviceType === 'pantalla') {
          console.log('Dispositivo pantalla abandonó la conexión con el servidor')
        }

      })



    })
  }


  @SubscribeMessage('sendDni')
  async handleDni(
    @MessageBody() turnoDni: TurnoDni,
    @ConnectedSocket() client: Socket,
  ) {

    // let serverMessage = false;

    try {
      console.log('entra en el try')
      const response = await this.server.timeout(2000).to('pantallaRoom').emitWithAck('sendNewDni', {turnoDni: turnoDni}, 'baz' )
      console.log('abajo response.status:')
      console.log(response[0].status) //should be "ok"
      // serverMessage = true;
      if(response[0].status == 'ok'){
        client.emit('responseDniStatus', {dniStatus: 'pantalla recibio el mensaje'})
      }
    } catch (error) {
      console.log('Catch: Pantalla no respondio')
      client.emit('responseDniStatus', {dniStatus: 'pantalla no recibio el mensaje'})
    }

    //esto es para usar si se usa un timeout en el compoente hometeclado en la parte del socket.emit 'sendDni'
    // if(serverMessage) return { serverMessage: "Mensaje recibido correctamente" }
  
    
    return { serverMessage: "Mensaje recibido correctamente" }

  }

  @SubscribeMessage('nextUser')
  handleNextUser(
    @MessageBody() message: MensajeNextUser,
    @ConnectedSocket() client: Socket
  ) {

    if (message.mensaje == 'next') {

      const { mensaje, box } = message; //mensaje: 'next user', box: 'id de la mesa de entradas que manda el msje'

      // const nextUser = this.queueService.getUsers()[0]

      this.server.to('pantallaRoom').emit('changeNextUser', { mensaje: 'next user please', box })

      // console.log(nextUser)
    }

  }

  //ARREGLAR
  @SubscribeMessage('resetUsers')
  resetUser(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket
  ) {
    if (message == 'reset-lista-de-espera') {

      console.log('se resetea lista de espera')
      this.queueService.resetUsers()

      this.server.to('pantallaRoom').emit('sendAllDnis', this.queueService.getUsers())
    }
  }

}   
