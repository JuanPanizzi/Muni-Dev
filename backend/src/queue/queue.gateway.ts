/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MensajeNextUser } from 'src/interfaces/message';
import { TurnoDni } from 'src/interfaces/TurnoDni';


@WebSocketGateway({ cors: 'https://muni-dev.vercel.app/',
  connectionStateRecovery: {}
})
export class QueueGateway implements OnModuleInit {



  @WebSocketServer()
  server: Server;


  constructor(private readonly queueService: QueueService) {}


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
      if(resPantalla == 'ok'){
        client.emit('responseDniStatus', {dniStatus: 'pantalla recibio el mensaje'})
      }
    } catch (error) {
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

      //AUTH 
    try {
      //respuesta de pantalla
      const response = await this.server.timeout(5000).to('pantallaRoom').emitWithAck('changeNextUser', { mensaje, box }, 'baz' );
     
      //Si responde pantalla, se deberia emitir un mensaje a box con el usuario entrante. Si la pantalla lo recibe, pantalla deberia
      // const resFromPantalla = response[0].status.statusChangedUser;
      // const nextUser = response[0].status.proximoUser
      const {statusChangedUser, nextUser} = response[0].status;

      if(statusChangedUser == 'se cambio-llamo el usuario correctamente'){
        // console.log(proximoUser)
        // client.emit('responseChangedUser', {changedUserStatus: 'se cambio-llamo el usuario correctamente', proximoUser})
        
        // client.emit('responseChangedUser', {changedUserStatus: 'se cambio-llamo el usuario correctamente', nextUser})
        try {
          const responseBox = await client.timeout(5000).emitWithAck('responseChangedUser', {changedUserStatus: 'se cambio-llamo el usuario correctamente', nextUser}, 'baz')

          console.log('112')
          if(responseBox) console.log(responseBox.responseFromBox)

        } catch (error) {
          // console.log('response box doesnt exist')
          //   console.log(error)
            // lastMessage.push({user: nextUser})
            // console.log(lastMessage)
        }
        
      }

      //pantalla tiene que enviar todo el nextUser con el id

      if(statusChangedUser == 'No hay mas usuarios'){
        client.emit('responseChangedUser', {changedUserStatus: 'No hay mas usuarios para llamar'})
      }
      if(statusChangedUser == 'Error al llamar usuario. Compruebe la url de su dispositivo'){
        // throw new Error('Error. No se pudo llamar al usuario. Intente nuevamente')
        throw new Error()
      }
      
    } catch (error) {
      client.emit('responseChangedUser', {changedUserStatus: "Error al llamar usuario. Compruebe la url de su dispositivo o su conexión a internet e intente nuevamente"})
    }
    
    return { serverMessage: "Servidor respondiendo a tiempo" }
    //Esta respuesta se usa para corroborar que el servidor esta respondiendo en menos de 10s, no para ver si hay un error en cuanto a la logica para llamar/cambiar al proximo usuario. De eso se encarga el try-catch de arriba. Esta respuesta es para responderle al timeout(10000) que esta en el box, para que no caiga en el (err). Para ver si hay un error en la logica para llamar/cambiar al usuario esta el try-catch de arriba y el evento 'responseChangedUser' que esta escuchando el box del otro lado. Ahi escucha si pantalla respondio/hizo el cambio correctamente 


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
