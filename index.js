import express from "express"
import * as wql from '@worldql/client'
import * as crypto from 'node:crypto'
import logger from './Logger.js'

logger.startREPL()

const app = express()
app.use(express.json())

const port = process.env.PORT || 2030
const WQLWebsocket = process.env['WQL_WEBSOCKET'] || 'ws://localhost:8080'

const Clients = {}
const UnreadMessages = {}
const LastSeen = {}

function addMessageToUnread(uuid,Message){
    if (UnreadMessages[uuid] == undefined){UnreadMessages[uuid] = []}
    UnreadMessages[uuid].push(Message)
}
function updateLastSeen(key){
    LastSeen[key] = Date.now()
}

app.get('/',(req,res) =>{
    res.send({
        'failed': true,
        'message': 'The WorldQL Websocket->REST api is working'
    })
})

app.get('/WorldQL',(req,res)=>{
    res.send({
        'failed':true,
        'message': 'Invalid-Endpoint'
    })
})

/*
Generates a new Auth key and uuid pair
-> null
<- [UUID,Key]
*/
app.post('/WorldQL/Auth',(req,res)=>{
    const WqlClient = new wql.Client({
        url: WQLWebsocket,
        autoconnect: false
    })
    var key = crypto.randomBytes(Math.ceil(36 / 2)).toString('hex').slice(0, 36)
    WqlClient.on('ready',()=>{
        logger.logMessage('connectionJoin',[WqlClient.uuid],[WqlClient.uuid,key])
        Clients[key] = WqlClient
        updateLastSeen(key)
        res.send({
        'failed': false,
        'message': 'your uuid and key have been generated',
        'output': [
            WqlClient.uuid,
            key
        ]})
        WqlClient.on('rawMessage',(message)=>{
            let copy = JSON.parse(JSON.stringify(message))
            copy.flex = (copy.flex instanceof Uint8Array)?new TextDecoder().decode(copy.flex) : copy.flex
            addMessageToUnread(WqlClient.uuid,copy)
        })
    })
    WqlClient.connect()
})

/*
Deletes a WorldQL client using the key
-> key
<- [null]
*/
app.delete('/WorldQL/Auth',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        var WQLC = Clients[req.headers.key]
        logger.logMessage('connectionLeave',[WQLC.uuid],[WQLC.uuid,req.headers.key])
        delete UnreadMessages[WQLC.uuid]
        WQLC.disconnect()
        WQLC.removeAllListeners()
        delete Clients[req.headers.key]
        delete LastSeen[req.headers.key]
        res.send({
            'failed':false,
            'message': 'deleted WorlQL client',
            'output':[]
        })
    }else{
        logger.logMessage('invalidKey',[req.header.key,req.ip],Object.keys(Clients))
        res.send({
            'failed': true,
            'message': 'invalid server key'
        })
    }
})

/*
Gets a Message
-> {key:string,limit?:number(1)}
<- Array<MessageT>
*/
app.get('/WorldQL/Message',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        logger._print(`getting ${req.headers.limit ?? 1} messages for key: ${req.headers.key}`)
        var Wql = Clients[req.headers.key]
        var uuid = Wql.uuid
        updateLastSeen(req.headers.key)
        if ((UnreadMessages[uuid] == undefined)||(UnreadMessages[uuid] == [])){res.send({
            'failed': true,
            'message': 'no messages to be recieved'
        })}
        logger.logMessage('incomingToClient',[req.headers.limit ?? 1,uuid],[UnreadMessages[uuid].slice(0,parseInt(req.headers.key))])
        res.send({
            'failed': false,
            'message': `${req.headers.limit ?? 1} message(s) recieved`,
            'output': UnreadMessages[uuid].splice(0, parseInt(req.headers.limit ?? 1))
        })
    }else{
        console.log(`${req.ip} tried to use server key "${req.headers.key}" and failed`)
        console.log(`current Keys are:`)
        console.log(Object.keys(Clients))
        res.send({
            'failed':true,
            'message': 'invalid server key'
        })
    }
})

/*
Sends A message to WorldQL
->{
    key:string,
    (body) message: MessageT
}
<- []
*/
app.post('/WorldQL/Message',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        if (req.body == undefined){
            logger._print(`${req.headers.key} just forgot to send a request body`)
            logger._print(req.body)
            logger._print(req)
            res.send({
                'failed':true,
                'message': 'missing message data'
            })
            return
        }
        var Wql = Clients[req.headers.key]
        var msg = req.body
        logger.logMessage('outgoingFromClient',[Wql.uuid],msg)
        msg.flex = new TextEncoder().encode(msg.flex)
        Wql.sendRawMessage(msg,msg.replication)
        res.send({
            'failed':false,
            'message': 'message sent',
            'output': []
        })
    }else{
        logger.logMessage('invalidKey',[req.header.key,req.ip],Object.keys(Clients))
        res.send({
            'failed':true,
            'message': 'invalid server key'
        })
    }
})

/*
Pings to keep you alive *and* gives you the ammount of messages
-> {
    key:string
}
<- {
    messages:number -- the ammount of UnreadMessages you have
}
*/
app.get('/WorldQL/Ping',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        updateLastSeen(req.headers.key)
        var Wqlc = Clients[req.headers.key]
        var uuid = Wqlc.uuid
        if (UnreadMessages[uuid] == undefined){UnreadMessages[uuid] = []}
        //console.log(`${req.headers.key} has ${UnreadMessages[uuid].length} UnreadMessages`)
        res.send({
            'failed':false,
            'message': 'updated last seen time',
            'output': {
                'messages': UnreadMessages[uuid].length
            }
        })
    }else{
        logger.logMessage('invalidKey',[req.header.key,req.ip],Object.keys(Clients))
        res.send({
            'failed':true,
            'message': 'invalid server key'
        })
    }
})

setInterval(()=>{
    var object = LastSeen
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key]
            var ourTime = Date.now()
            if ((ourTime - element) >= 20000){
                var WQLC = Clients[key]
                logger.logMessage('connectionLeaveTimeout',[WQLC.uuid],[WQLC.uuid,key])
                delete UnreadMessages[WQLC.uuid]
                WQLC.disconnect()
                WQLC.removeAllListeners()
                delete Clients[key]
                delete LastSeen[key]
            }
        }
    }
},2000)
app.listen(port, () => {
    logger._print('Server started on: ' + port);
});
