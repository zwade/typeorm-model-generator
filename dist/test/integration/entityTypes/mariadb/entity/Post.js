"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Post = class Post {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], Post.prototype, "int", void 0);
__decorate([
    typeorm_1.Column("tinyint"),
    __metadata("design:type", Number)
], Post.prototype, "tinyint", void 0);
__decorate([
    typeorm_1.Column("smallint"),
    __metadata("design:type", Number)
], Post.prototype, "smallint", void 0);
__decorate([
    typeorm_1.Column("mediumint"),
    __metadata("design:type", Number)
], Post.prototype, "mediumint", void 0);
__decorate([
    typeorm_1.Column("bigint"),
    __metadata("design:type", Number)
], Post.prototype, "bigint", void 0);
__decorate([
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], Post.prototype, "float", void 0);
__decorate([
    typeorm_1.Column("double"),
    __metadata("design:type", Number)
], Post.prototype, "double", void 0);
__decorate([
    typeorm_1.Column("decimal"),
    __metadata("design:type", Number)
], Post.prototype, "decimal", void 0);
__decorate([
    typeorm_1.Column("date"),
    __metadata("design:type", String)
], Post.prototype, "date", void 0);
__decorate([
    typeorm_1.Column("datetime"),
    __metadata("design:type", Date)
], Post.prototype, "datetime", void 0);
__decorate([
    typeorm_1.Column("timestamp"),
    __metadata("design:type", Date)
], Post.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column("time"),
    __metadata("design:type", String)
], Post.prototype, "time", void 0);
__decorate([
    typeorm_1.Column("year"),
    __metadata("design:type", Number)
], Post.prototype, "year", void 0);
__decorate([
    typeorm_1.Column("char"),
    __metadata("design:type", String)
], Post.prototype, "char", void 0);
__decorate([
    typeorm_1.Column("varchar"),
    __metadata("design:type", String)
], Post.prototype, "varchar", void 0);
__decorate([
    typeorm_1.Column("blob"),
    __metadata("design:type", Buffer)
], Post.prototype, "blob", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    typeorm_1.Column("tinyblob"),
    __metadata("design:type", Buffer)
], Post.prototype, "tinyblob", void 0);
__decorate([
    typeorm_1.Column("tinytext"),
    __metadata("design:type", String)
], Post.prototype, "tinytext", void 0);
__decorate([
    typeorm_1.Column("mediumblob"),
    __metadata("design:type", Buffer)
], Post.prototype, "mediumblob", void 0);
__decorate([
    typeorm_1.Column("mediumtext"),
    __metadata("design:type", String)
], Post.prototype, "mediumtext", void 0);
__decorate([
    typeorm_1.Column("longblob"),
    __metadata("design:type", Buffer)
], Post.prototype, "longblob", void 0);
__decorate([
    typeorm_1.Column("longtext"),
    __metadata("design:type", String)
], Post.prototype, "longtext", void 0);
__decorate([
    typeorm_1.Column("enum", { enum: ["A", "B", "C"] }),
    __metadata("design:type", String)
], Post.prototype, "enum", void 0);
Post = __decorate([
    typeorm_1.Entity("Post")
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map