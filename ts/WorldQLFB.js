"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Vec3dT = exports.Vec3d = exports.Replication = exports.RecordT = exports.Record = exports.MessageT = exports.Message = exports.Instruction = exports.EntityT = exports.Entity = void 0;
var entity_1 = require("./worldql-fb/messages/entity");
__createBinding(exports, entity_1, "Entity");
__createBinding(exports, entity_1, "EntityT");
var instruction_1 = require("./worldql-fb/messages/instruction");
__createBinding(exports, instruction_1, "Instruction");
var message_1 = require("./worldql-fb/messages/message");
__createBinding(exports, message_1, "Message");
__createBinding(exports, message_1, "MessageT");
var record_1 = require("./worldql-fb/messages/record");
__createBinding(exports, record_1, "Record");
__createBinding(exports, record_1, "RecordT");
var replication_1 = require("./worldql-fb/messages/replication");
__createBinding(exports, replication_1, "Replication");
var vec3d_1 = require("./worldql-fb/messages/vec3d");
__createBinding(exports, vec3d_1, "Vec3d");
__createBinding(exports, vec3d_1, "Vec3dT");
