"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
exports.__esModule = true;
exports.EntityT = exports.Entity = void 0;
var flatbuffers = require("flatbuffers");
var vec3d_1 = require("../../worldql-fb/messages/vec3d");
var Entity = /** @class */ (function () {
    function Entity() {
        this.bb = null;
        this.bb_pos = 0;
    }
    Entity.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    Entity.getRootAsEntity = function (bb, obj) {
        return (obj || new Entity()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Entity.getSizePrefixedRootAsEntity = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new Entity()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    Entity.prototype.uuid = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Entity.prototype.position = function (obj) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (obj || new vec3d_1.Vec3d()).__init(this.bb_pos + offset, this.bb) : null;
    };
    Entity.prototype.worldName = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Entity.prototype.data = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    Entity.prototype.flex = function (index) {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
    };
    Entity.prototype.flexLength = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
    };
    Entity.prototype.flexArray = function () {
        var offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
    };
    Entity.startEntity = function (builder) {
        builder.startObject(5);
    };
    Entity.addUuid = function (builder, uuidOffset) {
        builder.addFieldOffset(0, uuidOffset, 0);
    };
    Entity.addPosition = function (builder, positionOffset) {
        builder.addFieldStruct(1, positionOffset, 0);
    };
    Entity.addWorldName = function (builder, worldNameOffset) {
        builder.addFieldOffset(2, worldNameOffset, 0);
    };
    Entity.addData = function (builder, dataOffset) {
        builder.addFieldOffset(3, dataOffset, 0);
    };
    Entity.addFlex = function (builder, flexOffset) {
        builder.addFieldOffset(4, flexOffset, 0);
    };
    Entity.createFlexVector = function (builder, data) {
        builder.startVector(1, data.length, 1);
        for (var i = data.length - 1; i >= 0; i--) {
            builder.addInt8(data[i]);
        }
        return builder.endVector();
    };
    Entity.startFlexVector = function (builder, numElems) {
        builder.startVector(1, numElems, 1);
    };
    Entity.endEntity = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    Entity.prototype.unpack = function () {
        return new EntityT(this.uuid(), (this.position() !== null ? this.position().unpack() : null), this.worldName(), this.data(), this.bb.createScalarList(this.flex.bind(this), this.flexLength()));
    };
    Entity.prototype.unpackTo = function (_o) {
        _o.uuid = this.uuid();
        _o.position = (this.position() !== null ? this.position().unpack() : null);
        _o.worldName = this.worldName();
        _o.data = this.data();
        _o.flex = this.bb.createScalarList(this.flex.bind(this), this.flexLength());
    };
    return Entity;
}());
exports.Entity = Entity;
var EntityT = /** @class */ (function () {
    function EntityT(uuid, position, worldName, data, flex) {
        if (uuid === void 0) { uuid = null; }
        if (position === void 0) { position = null; }
        if (worldName === void 0) { worldName = null; }
        if (data === void 0) { data = null; }
        if (flex === void 0) { flex = []; }
        this.uuid = uuid;
        this.position = position;
        this.worldName = worldName;
        this.data = data;
        this.flex = flex;
    }
    EntityT.prototype.pack = function (builder) {
        var uuid = (this.uuid !== null ? builder.createString(this.uuid) : 0);
        var worldName = (this.worldName !== null ? builder.createString(this.worldName) : 0);
        var data = (this.data !== null ? builder.createString(this.data) : 0);
        var flex = Entity.createFlexVector(builder, this.flex);
        Entity.startEntity(builder);
        Entity.addUuid(builder, uuid);
        Entity.addPosition(builder, (this.position !== null ? this.position.pack(builder) : 0));
        Entity.addWorldName(builder, worldName);
        Entity.addData(builder, data);
        Entity.addFlex(builder, flex);
        return Entity.endEntity(builder);
    };
    return EntityT;
}());
exports.EntityT = EntityT;
