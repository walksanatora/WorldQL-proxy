var WebSocket = require('isomorphic-ws')
const { EventEmitter } = require('eventemitter3')
var wql_fbs = require('./ts/WorldQLFB.js')
const {serializeMessage, deserializeMessage} = require('./codec.js')
var crypto = require('node:crypto')
const logger = require('./Logger.js')

// #region client
class client extends EventEmitter{
	// #region constructor
	_ws
	_uuid
	unreadMessages = []
	constructor(url){
		super()
		this._url = url
	}
	// #endregion
	// #region getters
	get connected(){
    	return ((this._ws == null)? false: this._ws.readyState == WebSocket.OPEN)
	}
	get ready(){
		if (!this.connected) return false
		if (this._uuid == undefined) return false
		return true
	}
	get uuid(){
		if (!this.ready) throw new Error('cannot read uuid before client is ready')
		return this._uuid
	}
	get messageCount(){
		return this.unreadMessages.length()
	}
	getMessages(count){
		return this.unreadMessages.splice(0,count ?? 1)
	}
	// #endregion
	// #region lifecycle
	connect() {
		if (this._ws !== null) {
		  this.emit('error',new Error('cannot connect if already connected'))
		}
	
		this._ws = new WebSocket(this._url)
	
		this._ws.addEventListener('error', ({ error }) => {
		  this.emit('error', error)
		})
	
		this._ws.addEventListener('message', ev => {
		  if (typeof ev.data === 'string') return
		  void this._handleMessage(ev)
		})
	
		this._ws.addEventListener('close', () => {
		  this._uuid = null
		  this._ws = null
	
		  this.emit('disconnect')
		})
	}
	disconnect(){
		if (this._ws === null) return
		this._ws.close()
	}
	// #endregion
	// #region message handling
	sendRawMessage(message) {
		if (!this.connected) {
			throw new Error('cannot send messages before client is connected')
		}
	
		if (!this.ready) {
		  throw new Error('cannot send messages before client is ready')
		}
		
		const messageWithDefaults = {
		  replication: wql_fbs.Replication.ExceptSelf,
		  ...message,
		}
		
		const data = serializeMessage(messageWithDefaults, this._uuid)
		this._ws.send(data)
	}

	_handshake(message) {
		if (this._uuid != null) return
		if (message.parameter === undefined) return
		this._uuid = message.parameter
		this.sendRawMessage({
		  instruction: wql_fbs.Instruction.Handshake,
		  worldName: '@global',
		})
	
		this.emit('ready')
	}

	async _handleMessage(ev) {
		;
		if (typeof ev.data === 'string') return
		if (Array.isArray(ev.data)) return
		
		const buffer = (typeof Buffer.isBuffer(ev.data))? ev.data:Buffer.from(ev.data)
		
		const message = deserializeMessage(buffer)
		
		if (message.instruction === wql_fbs.Instruction.Handshake) {
			
			this._handshake(message)
		  	return
		}
		
		this.unreadMessages.push(message)
		
		this.emit('mesageRecieve',message)
	}
	// #endregion
}
// #endregion


module.exports = client