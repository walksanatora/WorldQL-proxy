var Worldql_schema = require('./ts/WorldQLFB.js')
var express = require('express')
var clientObj = require('./client.js')
global.logger = require('./Logger.js')
var crypto = require('node:crypto')


const app = express()
app.use(express.json())
const port = process.env.PORT || 2030
const WebsocketAddr = process.env['WQL_WEBSOCKET'] || 'ws://localhost:8080'

//region variables
const Clients = {} //key: websocket
const LastSeen = {} // key: number (unix time of last ping)
//endregion

function updateLastSeen(key){
	LastSeen[key] = Date.now()
}


app.get('/',(req,res)=>{
	res.send({
		'failed': true,
		'message': 'The TS-less proxy is running'
	})
})

app.post('/auth',(req,res)=>{
	var key = crypto.randomBytes(Math.ceil(36 / 2)).toString('hex').slice(0, 36)
	let client = new clientObj(WebsocketAddr)
	client.on('ready',()=>{
		res.send({
			'failed': false,
			'message': "connected successfully",
			'output': [client.uuid,key]
		})
		Clients[key] = client
		updateLastSeen(key)
		logger.logMessage('connectionJoin',[client.uuid],[client.uuid,key])
	})
	client.on('mesageRecieve',(msg)=>{
		logger._print('event fired')
		logger.logMessage('incomingToProxy',[msg.uuid],[msg])
	})
	client.connect()
})

app.delete('/WorldQL/Auth',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        var WQLC = Clients[req.headers.key]
        logger.logMessage('connectionLeave',[WQLC.uuid],[WQLC.uuid,req.headers.key])
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

app.get('/ping',(req,res)=>{
	if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        updateLastSeen(req.headers.key)
        var Wqlc = Clients[req.headers.key]
        res.send({
            'failed':false,
            'message': 'updated last seen time',
            'output': {
                'messages': Wqlc.messageCount
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

app.post('/message',(req,res)=>{
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

app.get('/message',(req,res)=>{
    if (Object.keys(Clients).indexOf(req.headers.key) != -1){
        logger._print(`getting ${req.headers.limit ?? 1} messages for key: ${req.headers.key}`)
        var Wql = Clients[req.headers.key]
        var uuid = Wql.uuid
        updateLastSeen(req.headers.key)
        if (Wqlc.messageCount){res.send({
            'failed': true,
            'message': 'no messages to be recieved'
        })}
        logger.logMessage('incomingToClient',[req.headers.limit ?? 1,uuid],[])
        res.send({
            'failed': false,
            'message': `${req.headers.limit ?? 1} message(s) recieved`,
            'output': Wqlc.getMessages(parseInt(req.headers.key??1))
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

setInterval(()=>{
    var object = LastSeen
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key]
            var ourTime = Date.now()
            if ((ourTime - element) >= 20000){
                var WQLC = Clients[key]
                logger.logMessage('connectionLeaveTimeout',[WQLC.uuid],[WQLC.uuid,key])
                WQLC.disconnect()
                WQLC.removeAllListeners()
                delete Clients[key]
                delete LastSeen[key]
            }
        }
    }
},2000)
logger.startREPL()
app.listen(port, () => {
    logger._print('Server started on: ' + port);
});