/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MensajeNextUser } from 'src/interfaces/message';
import { TurnoDni } from 'src/interfaces/TurnoDni';

interface PendingMessage {
  event: string;
  data: any;
}

@WebSocketGateway({ cors: 'https://municipalidad-client.vercel.app/' })
export class QueueGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private pendingMessages: Map<string, PendingMessage[]> = new Map(); // Almacena mensajes pendientes por userId
  private userSockets: Map<string, string> = new Map(); // Mapea userId a client.id

  constructor(private readonly queueService: QueueService) {}


  onModuleInit() {

    //Se escuchan todas las conexiones de todos los sockets - Pantalla usuario, pantalla central y boxes

    this.server.on('connection', (socket: Socket) => {

      const { deviceType, userId } = socket.handshake.query;
      //Primera barrera - se controla que la conexion ande
      // socket.on('sendDni', (turnoDni, callback)=>{
      //   callback({
      //     status: "ok"
      //   })
      // })

      //Segunda barrera - se controla que el mensaje desde hometeclado llegue bien a pantalla
      // console.log(`socket conectado: ${socket.id}`)

// Mapea userId al client.id
if (userId) {
  this.userSockets.set(userId as string, socket.id);
}


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

        // Limpiar mensajes pendientes si el cliente se desconecta
        // if (this.pendingMessages.has(socket.id)) {
        //   this.pendingMessages.delete(socket.id);
        // }
         // Elimina el client.id del mapa al desconectarse
         if (userId) {
          this.userSockets.delete(userId as string);
        }
      })

    })
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.userSockets.set(userId, client.id);

      // Envía los mensajes pendientes al reconectar
      const pending = this.pendingMessages.get(userId);
      if (pending) {
        for (const msg of pending) {
          client.emit(msg.event, msg.data);
        }
        this.pendingMessages.delete(userId);
      }
    }
  }

//From HomeTeclado - queue - pantalla - queue - HomeTeclado
  @SubscribeMessage('sendDni')
  async handleDni(
    @MessageBody() turnoDni: TurnoDni,
    @ConnectedSocket() client: Socket,
  ) {

    // let serverMessage = false;

    try {
      //Respuesta de pantalla
      const response = await this.server.timeout(5000).to('pantallaRoom').emitWithAck('sendNewDni', {turnoDni: turnoDni}, 'baz' )

      const resPantalla = response[0].status
      
      // console.log('abajo response.status:')
      // console.log(response[0].status) //should be "ok"
      // serverMessage = true;

      //guardamos la respuesta de la pantalla en pendingMessages y lo asociamos al client.id
      
      if(resPantalla == 'ok'){
        
        console.log('se guardan mensajes en pending messages')
        client.emit('responseDniStatus', {dniStatus: 'pantalla recibio el mensaje'})


        //guardar esta respuesta asociada al client.id
      }
    } catch (error) {
      console.log('Catch: Pantalla no respondio')

      client.emit('responseDniStatus', {dniStatus: 'pantalla no recibio el mensaje'})

    }

    //esto es para usar si se usa un timeout en el compoente hometeclado en la parte del socket.emit 'sendDni'
    // if(serverMessage) return { serverMessage: "Mensaje recibido correctamente" }
    
    return { serverMessage: "Mensaje recibido correctamente" }
    //Esta respuesta no es para ver si hubo un error o no en la recepcion del mensaje que hometeclado le envia a pantalla (a traves de este gateway). Esta respuesta de abajo es para chequear que el server esta vivo y responde a tiempo, para que en el timeout(10000) que se esta ejecutando en hometeclado no caiga en el (err). Abajo en @subscribemessage('nextuser') esta explicado un poco mejor tambien. 

  }

  @SubscribeMessage('nextUser')
 async handleNextUser(
    @MessageBody() message: MensajeNextUser,
    @ConnectedSocket() client: Socket
  ) {
      const { mensaje, box } = message; //message.mensaje: 'next', box: 'id de la mesa de entradas que manda el msje'
      // this.server.to('pantallaRoom').emit('changeNextUser', { mensaje, box })
      const userId = client.handshake.query.userId as string;
      //AUTH 
    try {
      //respuesta de pantalla
      const response = await this.server.timeout(5000).to('pantallaRoom').emitWithAck('changeNextUser', { mensaje, box }, 'baz' );
     


      //Si responde pantalla, se deberia emitir un mensaje a box con el usuario entrante. Si la pantalla lo recibe, pantalla deberia

      // const resFromPantalla = response[0].status.statusChangedUser;
      // const nextUser = response[0].status.proximoUser

      const {statusChangedUser, nextUser} = response[0].status;

      let responseMessage;
      if (statusChangedUser == 'se cambio-llamo el usuario correctamente') {
        responseMessage = { changedUserStatus: 'se cambio-llamo el usuario correctamente', nextUser };
      } else if (statusChangedUser == 'No hay mas usuarios') {
        responseMessage = { changedUserStatus: 'No hay mas usuarios para llamar' };
      } else if (statusChangedUser == 'Error al llamar usuario. Compruebe la url de su dispositivo') {
        throw new Error();
      }

      if (responseMessage) {
        this.sendMessageToUser(userId, 'responseChangedUser', responseMessage);
      }
      
    } catch (error) {
      const errorMessage = { changedUserStatus: "Error al llamar usuario. Compruebe la url de su dispositivo o su conexión a internet e intente nuevamente" };
      this.sendMessageToUser(userId, 'responseChangedUser', errorMessage);
    }

    return { serverMessage: "Servidor respondiendo a tiempo" };
  }
  private sendMessageToUser(userId: string, event: string, data: any) {
    const clientId = this.userSockets.get(userId);
    if (clientId) {
      const client = this.server.sockets.sockets.get(clientId);
      if (client) {
        client.emit(event, data);
      } else {
        this.storePendingMessage(userId, event, data);
      }
    } else {
      this.storePendingMessage(userId, event, data);
    }
  }

  private storePendingMessage(userId: string, event: string, data: any) {
    if (!this.pendingMessages.has(userId)) {
      this.pendingMessages.set(userId, []);
    }
    this.pendingMessages.get(userId).push({ event, data });
  }


  @SubscribeMessage('reloadPantalla')
  async handleReloadPantalla(
     @MessageBody() message: string,
     @ConnectedSocket() client: Socket
   ) {

    try {
      //se le envia a pantalla el evento 'reloadPantallaNow'
      const response = await this.server.timeout(5000).to('pantallaRoom').emitWithAck('reloadPantallaNow',{ foo: 'bar' }, 'baz');

      const {statusReload} = response[0].status

      if(statusReload == 'OK'){
        client.emit('statusPantallaReloaded', {statusPantallaRelaoaded: "Pantalla recargada correctamente"})
      }

      
    } catch (error) {
      
      client.emit('statusPantallaReloaded', {statusPantallaRelaoaded: "Pantalla no se recargó"})
      
    }
    return { serverMessage: "Servidor respondiendo a ti  empo" }


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
