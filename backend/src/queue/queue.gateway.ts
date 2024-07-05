/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MensajeNextUser } from 'src/interfaces/message';
import { TurnoDni } from 'src/interfaces/TurnoDni';

@WebSocketGateway({ cors: 'https://municipalidad-client.vercel.app/'})
export class QueueGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(private readonly queueService: QueueService) { }

  onModuleInit() {

    //Se escuchan todas las conexiones de todos los sockets - Pantalla usuario, pantalla central y boxes

    this.server.on('connection', (socket: Socket) => {
      
      // console.log(`socket conectado: ${socket.id}`)

      //OJO QUE ACA ESTOY UNIENDO A TODOS LOS SOCKETS QUE SE CONECTAN A ESTA PANTALLA

      socket.on('joinPantallaRoom', () => {
        socket.join('pantallaRoom');
        console.log('Cliente se ha unido a la sala "pantallaRoom"');
      });


      socket.once('disconnect', () => {
        console.log('cliente desconectado')
      })


      socket.on('sendDni', (turnoDni, callback)=>{

        console.log('SE ESCUCHA ARRIBA')
        callback({
          status: "ok"
        })
      })

    })


    


  }



  //1.Acá se reciben dnis desde la pantalla de usuarios, se guardaBAN en un array, y luego se envian a pantalla central
  //   @SubscribeMessage('sendDni')
  //   async handleDni(
  //     @MessageBody() turnoDni: TurnoDni,
  //     @ConnectedSocket() client: Socket,

  //   ) {


  // };

  // this.server.to('pantallaRoom').emit('sendNewDni', turnoDni , (err: any, res: { message: any; })=>{

  //     console.log('Se recibio una respuesta de parte de pantalla')
  //     console.log(res.message)

  //     // Emitir respuesta a HomeTeclado
  //     this.server.once('dniConfirmed', (confirmation) => {
  //       console.log('mensaje recibido de pantalla abajo:')
  //       console.log(confirmation.message)

  //       client.emit('dniConfirmed', {
  //         status: "success",
  //         message: "Respuesta recibida correctamente desde pantalla. Este es un mensaje enviado desde queue"
  //       });
  //     });
  //     return {mensaje: 'Holaa'}
  // } );
  @SubscribeMessage('sendDni')
  handleDni(
    @MessageBody() turnoDni: TurnoDni,
    @ConnectedSocket() client: Socket,
  ) {

    console.log('SE ESCUCHA ABAJO')

    this.server.timeout(5000).to('pantallaRoom').emit('sendNewDni', turnoDni, (err: any, res: any)=>{


      if(err){

        client.emit('receivedDni', {status: "error", message: "pantalla no ha respondido a tiempo"})
      }else{
        console.log(res.status)
        client.emit('receivedDni', {status: "ok", message: "pantalla ha respondido correctamente"})
      }
    });

    

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
