"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
exports.__esModule = true;
exports.MessageT = exports.Message = void 0;
var flatbuffers = require("flatbuffers");
var entity_1 = require("../../worldql-fb/messages/entity");
var instruction_1 = require("../../worldql-fb/messages/instruction");
var record_1 = require("../../worldql-fb/messages/record");
var replication_1 = require("../../worldql-fb/messages/replication");
var vec3d_1 = require("../../worldql-fb/messages/vec3d");
var Message = /** @class */ (function () {
    function Message() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Message.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Message.getRootAsMessage = function (bb, obj) {
        return (obj || new Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Message.getSizePrefixedRootAsMessage = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Message.prototype.instruction = function () {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : instruction_1.Instruction.Heartbeat;
    };
    Message.prototype.parameter = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Message.prototype.senderUuid = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Message.prototype.worldName = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Message.prototype.replication = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : replication_1.Replication.ExceptSelf;
    };
    Message.prototype.records = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? (obj || new record_1.Record()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Message.prototype.recordsLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Message.prototype.entities = function (index, obj) {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? (obj || new entity_1.Entity()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
    };
    Message.prototype.entitiesLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Message.prototype.position = function (obj) {
        var offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? (obj || new vec3d_1.Vec3d()).__init(this.bb_pos + offset, this.bb) : null;
    };
    Message.prototype.flex = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
    };
    Message.prototype.flexLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Message.prototype.flexArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Message.startMessage = function (builder) {
        builder.startObject(9);
    };
    Message.addInstruction = function (builder, instruction) {
        builder.addFieldInt8(0, instruction, instruction_1.Instruction.Heartbeat);
    };
    Message.addParameter = function (builder, parameterOffset) {
        builder.addFieldOffset(1, parameterOffset, 0);
    };
    Message.addSenderUuid = function (builder, senderUuidOffset) {
        builder.addFieldOffset(2, senderUuidOffset, 0);
    };
    Message.addWorldName = function (builder, worldNameOffset) {
        builder.addFieldOffset(3, worldNameOffset, 0);
    };
    Message.addReplication = function (builder, replication) {
        builder.addFieldInt8(4, replication, replication_1.Replication.ExceptSelf);
    };
    Message.addRecords = function (builder, recordsOffset) {
        builder.addFieldOffset(5, recordsOffset, 0);
    };
    Message.createRecordsVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Message.startRecordsVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Message.addEntities = function (builder, entitiesOffset) {
        builder.addFieldOffset(6, entitiesOffset, 0);
    };
    Message.createEntitiesVector = function (builder, data) {
        builder.startVector(4, data.length, 4);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addOffset(data[i]);
        }
        return builder.endVector();
    };
    Message.startEntitiesVector = function (builder, numElems) {
        builder.startVector(4, numElems, 4);
    };
    Message.addPosition = function (builder, positionOffset) {
        builder.addFieldStruct(7, positionOffset, 0);
    };
    Message.addFlex = function (builder, flexOffset) {
        builder.addFieldOffset(8, flexOffset, 0);
    };
    Message.createFlexVector = function (builder, data) {
        builder.startVector(1, data.length, 1);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addInt8(data[i]);
        }
        return builder.endVector();
    };
    Message.startFlexVector = function (builder, numElems) {
        builder.startVector(1, numElems, 1);
    };
    Message.endMessage = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Message.finishMessageBuffer = function (builder, offset) {
        builder.finish(offset);
    };
    Message.finishSizePrefixedMessageBuffer = function (builder, offset) {
        builder.finish(offset, undefined, true);
    };
    Message.prototype.unpack = function () {
        return new MessageT(this.instruction(), this.parameter(), this.senderUuid(), this.worldName(), this.replication(), this.bb.createObjList(this.records.bind(this), this.recordsLength()), this.bb.createObjList(this.entities.bind(this), this.entitiesLength()), (this.position() !== null ? this.position().unpack() : null), this.bb.createScalarList(this.flex.bind(this), this.flexLength()));
    };
    Message.prototype.unpackTo = function (_o) {
        _o.instruction = this.instruction();
        _o.parameter = this.parameter();
        _o.senderUuid = this.senderUuid();
        _o.worldName = this.worldName();
        _o.replication = this.replication();
        _o.records = this.bb.createObjList(this.records.bind(this), this.recordsLength());
        _o.entities = this.bb.createObjList(this.entities.bind(this), this.entitiesLength());
        _o.position = (this.position() !== null ? this.position().unpack() : null);
        _o.flex = this.bb.createScalarList(this.flex.bind(this), this.flexLength());
    };
    return Message;
}());
exports.Message = Message;
var MessageT = /** @class */ (function () {
    function MessageT(instruction, parameter, senderUuid, worldName, replication, records, entities, position, flex) {
        if (instruction === void 0) { instruction = instruction_1.Instruction.Heartbeat; }
        if (parameter === void 0) { parameter = null; }
        if (senderUuid === void 0) { senderUuid = null; }
        if (worldName === void 0) { worldName = null; }
        if (replication === void 0) { replication = replication_1.Replication.ExceptSelf; }
        if (records === void 0) { records = []; }
        if (entities === void 0) { entities = []; }
        if (position === void 0) { position = null; }
        if (flex === void 0) { flex = []; }
        this.instruction = instruction;
        this.parameter = parameter;
        this.senderUuid = senderUuid;
        this.worldName = worldName;
        this.replication = replication;
        this.records = records;
        this.entities = entities;
        this.position = position;
        this.flex = flex;
    }
    MessageT.prototype.pack = function (builder) {
        var parameter = (this.parameter !== null ? builder.createString(this.parameter) : 0);
        var senderUuid = (this.senderUuid !== null ? builder.createString(this.senderUuid) : 0);
        var worldName = (this.worldName !== null ? builder.createString(this.worldName) : 0);
        var records = Message.createRecordsVector(builder, builder.createObjectOffsetList(this.records));
        var entities = Message.createEntitiesVector(builder, builder.createObjectOffsetList(this.entities));
        var flex = Message.createFlexVector(builder, this.flex);
        Message.startMessage(builder);
        Message.addInstruction(builder, this.instruction);
        Message.addParameter(builder, parameter);
        Message.addSenderUuid(builder, senderUuid);
        Message.addWorldName(builder, worldName);
        Message.addReplication(builder, this.replication);
        Message.addRecords(builder, records);
        Message.addEntities(builder, entities);
        Message.addPosition(builder, (this.position !== null ? this.position.pack(builder) : 0));
        Message.addFlex(builder, flex);
        return Message.endMessage(builder);
    };
    return MessageT;
}());
exports.MessageT = MessageT;
