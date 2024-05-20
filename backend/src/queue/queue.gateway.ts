/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MensajeNextUser } from 'src/interfaces/message';
import { TurnoDni } from 'src/interfaces/TurnoDni';


@WebSocketGateway()
export class QueueGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(private readonly queueService: QueueService) { }

  onModuleInit() {

    //Se escuchan todas las conexiones de todos los sockets - Pantalla usuario, pantalla central y boxes

    this.server.on('connection', (socket: Socket) => {
      
      console.log(`socket conectado: ${socket.id}`)

      //OJO QUE ACA ESTOY UNIENDO A TODOS LOS SOCKETS QUE SE CONECTAN A ESTA PANTALLA
      socket.on('joinPantallaRoom', () => {
        socket.join('pantallaRoom');
        console.log('Cliente se ha unido a la sala "pantallaRoom"');
      });
      

      socket.on('disconnect', ()=>{
        console.log('cliente desconectado')
      })

    })

    
    
  }
  
  
      //1.Acá se reciben dnis desde la pantalla de usuarios, se guardan en un array, y luego se envian a pantalla central
      @SubscribeMessage('sendDni')
      handleDni(
        @MessageBody() turnoDni: TurnoDni,
        @ConnectedSocket() client: Socket
      ){

        const {dni, nroTurno} = turnoDni;

        //se agrega dni al array
        this.queueService.addUser(turnoDni)


        // this.server.to().emit('mensajeSalienteParaHome', 'Este es el mensaje saliente')
        const turnoDniResponse = turnoDni
        client.emit('respuestaDni', turnoDniResponse);

        //2. Se envian todos los turnoDni a la pantalla central OJO QUE TAMBIEN SE MANDAN A HOME
        this.server.to('pantallaRoom').emit('sendAllDnis', this.queueService.getUsers())
        
      }

      @SubscribeMessage('nextUser')
      handleNextUser(
        @MessageBody() message: MensajeNextUser,
        @ConnectedSocket() client: Socket
      ){
  
        if(message.mensaje == 'next'){
          
          const {mensaje, box} = message; //mensaje: 'next user', box: 'id de la mesa de entradas que manda el msje'

          // const nextUser = this.queueService.getUsers()[0]

          this.server.to('pantallaRoom').emit('changeNextUser', {mensaje: 'next user please', box})

          // console.log(nextUser)
        }

      }

      @SubscribeMessage('resetUsers')
      resetUser(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket
      ){
        if(message == 'reset-lista-de-espera'){

          console.log('se resetea lista de espera')
          this.queueService.resetUsers()

          this.server.to('pantallaRoom').emit('sendAllDnis', this.queueService.getUsers())
        }
      }

    }   
