const { Builder, ByteBuffer } =  require('flatbuffers')
const { EntityT, Message, MessageT, RecordT, Vec3dT} = require('./ts/WorldQLFB.js')


// #region Utils
const decodeString= string => {
  if (typeof string === 'string') return string
  if (string instanceof Uint8Array) {
    return new TextDecoder().decode(string)
  }

  throw new TypeError('unknown string-like type')
}

const encodeFlex= buffer => {
  return [...buffer]
}

const decodeFlex = flex => {
  return Uint8Array.from(flex)
}
// #endregion

// #region Vector3
const encodeVector3 = vec => {
  // Handle tuples
  if (Array.isArray(vec)) {
    const [x, y, z] = vec
    return new Vec3dT(x, y, z)
  }

  return new Vec3dT(vec.x, vec.y, vec.z)
}

const decodeVector3 = vec3dT => {
  const vec = {
    x: vec3dT.x,
    y: vec3dT.y,
    z: vec3dT.z,
  }

  return Object.freeze(vec)
}
// #endregion

// #region Record
const encodeRecord = record => {
  return new RecordT(
    record.uuid,
    encodeVector3(record.position),
    record.worldName,
    record.data,
    record.flex && encodeFlex(record.flex)
  )
}

const decodeRecord= recordT => {
  if (recordT.uuid === null) {
    throw new TypeError('record uuid should never be null')
  }

  if (recordT.position === null) {
    throw new TypeError('record position should never be null')
  }

  if (recordT.worldName === null) {
    throw new TypeError('record world_name should never be null')
  }

  const record = {
    uuid: decodeString(recordT.uuid),
    position: decodeVector3(recordT.position),
    worldName: decodeString(recordT.worldName),
    data: (recordT.data && decodeString(recordT.data)) ?? undefined,
    flex: (recordT.flex && decodeFlex(recordT.flex)) ?? undefined,
  }

  return Object.freeze(record)
}
// #endregion

// #region Entity
const encodeEntity= entity => {
  return new EntityT(
    entity.uuid,
    encodeVector3(entity.position),
    entity.worldName,
    entity.data,
    entity.flex && encodeFlex(entity.flex)
  )
}

const decodeEntity = entityT => {
  if (entityT.uuid === null) {
    throw new TypeError('entity uuid should never be null')
  }

  if (entityT.position === null) {
    throw new TypeError('entity position should never be null')
  }

  if (entityT.worldName === null) {
    throw new TypeError('entity world_name should never be null')
  }

  const entity = {
    uuid: decodeString(entityT.uuid),
    position: decodeVector3(entityT.position),
    worldName: decodeString(entityT.worldName),
    data: (entityT.data && decodeString(entityT.data)) ?? undefined,
    flex: (entityT.flex && decodeFlex(entityT.flex)) ?? undefined,
  }

  return Object.freeze(entity)
}
// #endregion

// #region Message
const encodeMessage = (
  message,
  uuid
) => {
  const records = message.records?.map(x => encodeRecord(x)) ?? []
  const entities = message.entities?.map(x => encodeEntity(x)) ?? []

  const messageT = new MessageT(
    message.instruction,
    message.parameter,
    uuid,
    message.worldName,
    message.replication,
    records,
    entities,
    (message.position && encodeVector3(message.position)) ?? undefined,
    message.flex && encodeFlex(message.flex)
  )

  return messageT
}

const decodeMessage = messageT => {
	if (messageT.worldName === null) {
	  throw new TypeError('message world_name should never be null')
	}
  
	if (messageT.senderUuid === null) {
	  throw new TypeError('message sender_uuid should never be null')
	}
  
	const message = {
	  instruction: messageT.instruction,
	  parameter:
		(messageT.parameter && decodeString(messageT.parameter)) ?? undefined,
	  worldName: decodeString(messageT.worldName),
	  replication: messageT.replication,
	  senderUuid: decodeString(messageT.senderUuid),
	  records: messageT.records.map(x => decodeRecord(x)),
	  entities: messageT.entities.map(x => decodeEntity(x)),
	  position:
		(messageT.position && decodeVector3(messageT.position)) ?? undefined,
	  flex: (messageT.flex && decodeFlex(messageT.flex)) ?? undefined,
	}
  
	return Object.freeze(message)
  }

// #endregion

// #region (De)serialization
const serializeMessage = (message, uuid) => {
  const messageT = encodeMessage(message, uuid)

  const builder = new Builder(1024)
  const offset = messageT.pack(builder)

  builder.finish(offset)
  return builder.asUint8Array()
}

const deserializeMessage = bytes => {
  const u8 = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes
  const buf = new ByteBuffer(u8)

  const messageRaw = Message.getRootAsMessage(buf)
  const messageT = messageRaw.unpack()

  return decodeMessage(messageT)
}
module.exports = {
	serializeMessage: serializeMessage,
	deserializeMessage: deserializeMessage
}
// #endregion
