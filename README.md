# WorldQL Proxy
A Node.js proxy which allows you to communicate with WorldQL via HTTP

## Before you begin
first you must install/compile [WorldQL Server](https://github.com/WorldQL/worldql_server#building-and-running)

If you would like yo build on windows add the following flags when running `cargo build`<br>
`--no-default-features` - disables automatically building all features in (ZeroMQ/Websocket support)<br>
`--features websocket` - build in Websocket support<br>
also I would reccommend adding `--release` so it will optimise the build so it is a bit more efficent<br>

# Running The Proxy
before running this project has 2 enviroment vars
`PORT` - Port that the webserver for the REST api will listen on<br>
`WQL_WEBSOCKET` - the address of the websocket server ex: `ws://localhost:8080`<br>

after that you can just run `node index.js`<br>
then you will be dropped into a REPL made using [neo-blessed](https://www.npmjs.com/package/neo-blessed)<br>
to get a list of commands just run `help`<br>
and just like that you have a Proxy between  WorldQL and HTTP

## Endpoints
`/` - lets you know that it is running<br>
`/WorldQL` - lets you know that it is not running<br>
`/WorldQL/Auth` - authentication<br>
POST - generates a auth key and uuid send in the json
```json
{
    "failed": false,
    "message: "your uuid and key have been generated",
    "output": ["yourUUID","yourKey"]
}
```
DELETE - takes the `key` header and uses that to disconnect your client (you will be automatically disconnected if there is no activity within 20 seconds)<br>
`/WorldQL/Message` - handles sending/recieving messages<br>
GET - uses your `key` header to get which server to get messages from and your `limit` header to get the maximum number of messages it will send per `GET` request Default: 1 Example:<br> 
```json
{
    "failed":false,
    "message:'5 message(s) recieved`,
    "output": [
        <message objects>
    ]
}
```
POST - uses your `key` header to send a raw message from JSON in the Body of the request the format see [here](#messaget)<br>
`/WorldQL/Ping` - resets the autoDisconnect timer, also returns the ammount of messages that are left to be recieved by your client
## MessageT
MessageT are objects with a few some parts
this is a lua type def for a `MessageT` object.
`instruction` and `replication` are special fields and have to have specific numbers or everything goes wrong (ex: messages being sent in the wrong context, messages not being sent at all, message being mis intrepreted)
and `flex` is a UInt8Array that you can do anything with
```lua
export type MessageT = {
    instruction: number, --DataTypes.Enum.Instruction
    parameter: string?,
    senderUUID: string?,
    worldName: string,
    replication: number, --DataTypes.Enum.Replication
    records: { [number] : RecordT }?,
    entities: { [number] : EntityT }?,
    position: Vec3T?,
    flex: UInt8Array?,
}
```

If you want A example just check out my [WorldQL Roblox Module](https://github.com/walksanatora/WorldQL_RBXL)