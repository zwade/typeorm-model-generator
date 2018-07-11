"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractDriver_1 = require("./AbstractDriver");
const PG = require("pg");
const ColumnInfo_1 = require("../models/ColumnInfo");
const TomgUtils = require("../Utils");
class PostgresDriver extends AbstractDriver_1.AbstractDriver {
    constructor() {
        super(...arguments);
        this.GetAllTablesQuery = (schema) => __awaiter(this, void 0, void 0, function* () {
            let response = (yield this.Connection.query(`SELECT table_schema as "TABLE_SCHEMA",table_name as "TABLE_NAME", table_type as TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES WHERE table_schema in (${schema}) `)).rows;
            return response;
        });
    }
    GetCoulmnsFromEntity(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = (yield this.Connection
                .query(`SELECT table_name,column_name,column_default,is_nullable,
            udt_name,character_maximum_length,numeric_precision,numeric_scale,
            case when column_default LIKE 'nextval%' then 'YES' else 'NO' end isidentity,
			(SELECT count(*)
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        inner join INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE cu
            on cu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
    where
        tc.CONSTRAINT_TYPE = 'UNIQUE'
        and tc.TABLE_NAME = c.TABLE_NAME
        and cu.COLUMN_NAME = c.COLUMN_NAME
        and tc.TABLE_SCHEMA=c.TABLE_SCHEMA) IsUnique
            FROM INFORMATION_SCHEMA.COLUMNS c where table_schema in (${schema})`))
                .rows;
            entities.forEach(ent => {
                response
                    .filter(filterVal => {
                    return filterVal.table_name == ent.EntityName;
                })
                    .forEach(resp => {
                    let colInfo = new ColumnInfo_1.ColumnInfo();
                    colInfo.tsName = resp.column_name;
                    colInfo.sqlName = resp.column_name;
                    colInfo.is_nullable = resp.is_nullable == "YES";
                    colInfo.is_generated = resp.isidentity == "YES";
                    colInfo.is_unique = resp.isunique == 1;
                    colInfo.default = colInfo.is_generated
                        ? null
                        : resp.column_default;
                    switch (resp.udt_name) {
                        case "int4":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "int";
                            break;
                        case "varchar":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "varchar";
                            colInfo.lenght =
                                resp.character_maximum_length > 0
                                    ? resp.character_maximum_length
                                    : null;
                            break;
                        case "text":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "text";
                            break;
                        case "uuid":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "uuid";
                            break;
                        case "int2":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "smallint";
                            break;
                        case "int8":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "bigint";
                            break;
                        case "date":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "date";
                            break;
                        case "bool":
                            colInfo.ts_type = "boolean";
                            colInfo.sql_type = "boolean";
                            break;
                        case "float8":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "double";
                            colInfo.numericPrecision = resp.numeric_precision;
                            colInfo.numericScale = resp.numeric_scale;
                            break;
                        case "float4":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "float";
                            colInfo.numericPrecision = resp.numeric_precision;
                            colInfo.numericScale = resp.numeric_scale;
                            break;
                        case "numeric":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "numeric";
                            colInfo.numericPrecision = resp.numeric_precision;
                            colInfo.numericScale = resp.numeric_scale;
                            break;
                        case "time":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "time without time zone";
                            break;
                        case "timetz":
                            colInfo.ts_type = "Date";
                            colInfo.sql_type = "time with time zone";
                            break;
                        case "timestamp":
                            colInfo.ts_type = "Date";
                            colInfo.sql_type = "timestamp without time zone";
                            break;
                        case "timestamptz":
                            colInfo.ts_type = "Date";
                            colInfo.sql_type = "timestamp with time zone";
                            break;
                        case "json":
                            colInfo.ts_type = "Object";
                            colInfo.sql_type = "json";
                            break;
                        case "jsonb":
                            colInfo.ts_type = "Object";
                            colInfo.sql_type = "jsonb";
                            break;
                        case "money":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "money";
                            break;
                        case "character":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "character";
                            colInfo.lenght =
                                resp.character_maximum_length > 0
                                    ? resp.character_maximum_length
                                    : null;
                            break;
                        case "bytea":
                            colInfo.ts_type = "Buffer";
                            colInfo.sql_type = "bytea";
                            break;
                        case "interval":
                            colInfo.ts_type = "any";
                            colInfo.sql_type = "interval";
                            break;
                        case "point":
                            colInfo.ts_type = "string | Object";
                            colInfo.sql_type = "point";
                            break;
                        case "line":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "line";
                            break;
                        case "lseg":
                            colInfo.ts_type = "string | string[]";
                            colInfo.sql_type = "lseg";
                            break;
                        case "box":
                            colInfo.ts_type = "string | Object";
                            colInfo.sql_type = "box";
                            break;
                        case "path":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "path";
                            break;
                        case "polygon":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "polygon";
                            break;
                        case "circle":
                            colInfo.ts_type = "string | Object";
                            colInfo.sql_type = "circle";
                            break;
                        case "cidr":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "cidr";
                            break;
                        case "inet":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "inet";
                            break;
                        case "macaddr":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "macaddr";
                            break;
                        case "bit":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "bit";
                            break;
                        case "varbit":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "bit varying";
                            break;
                        case "xml":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "xml";
                            break;
                        default:
                            // Assume that it's a user-defined enum
                            colInfo.ts_type = { kind: "enum", name: resp.udt_name };
                            colInfo.sql_type = "varchar";
                            break;
                    }
                    if (this.ColumnTypesWithPrecision.some(v => v == colInfo.sql_type)) {
                        colInfo.numericPrecision = resp.numeric_precision;
                        colInfo.numericScale = resp.numeric_scale;
                    }
                    if (this.ColumnTypesWithLength.some(v => v == colInfo.sql_type)) {
                        colInfo.lenght =
                            resp.character_maximum_length > 0
                                ? resp.character_maximum_length
                                : null;
                    }
                    if (this.ColumnTypesWithWidth.some(v => v == colInfo.sql_type)) {
                        colInfo.width =
                            resp.character_maximum_length > 0
                                ? resp.character_maximum_length
                                : null;
                    }
                    if (colInfo.sql_type)
                        ent.Columns.push(colInfo);
                });
            });
            return entities;
        });
    }
    GetEnums(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            let enumsResponse = (yield this.Connection.query(`
            SELECT t.typname AS enum_name,
                e.enumlabel AS enum_value
            FROM pg_type t
                JOIN pg_enum e ON t.oid = e.enumtypid
                JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = '${schema}'`))
                .rows;
            let enums = enumsResponse
                .reduce((enums, { enum_name, enum_value }) => {
                if (!enums.has(enum_name)) {
                    enums.set(enum_name, []);
                }
                enums.get(enum_name).push(enum_value);
                return enums;
            }, new Map());
            return Array.from(enums.keys()).map((name) => ({ name, values: enums.get(name) }));
        });
    }
    GetIndexesFromEntity(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = (yield this.Connection.query(`SELECT
        c.relname AS tablename,
        i.relname as indexname,
        f.attname AS columnname,
        CASE
            WHEN ix.indisunique = true THEN '1'
            ELSE '0'
        END AS is_unique,
        CASE
            WHEN ix.indisprimary='true' THEN '1'
            ELSE '0'
        END AS is_primary_key
        FROM pg_attribute f
        JOIN pg_class c ON c.oid = f.attrelid
        JOIN pg_type t ON t.oid = f.atttypid
        LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = f.attnum
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_index AS ix ON f.attnum = ANY(ix.indkey) and c.oid = f.attrelid and c.oid = ix.indrelid
        LEFT JOIN pg_class AS i ON ix.indexrelid = i.oid
        WHERE c.relkind = 'r'::char
        AND n.nspname in (${schema})
        AND f.attnum > 0
        AND i.oid<>0
        ORDER BY c.relname,f.attname;`)).rows;
            entities.forEach(ent => {
                response
                    .filter(filterVal => {
                    return filterVal.tablename == ent.EntityName;
                })
                    .forEach(resp => {
                    let indexInfo = {};
                    let indexColumnInfo = {};
                    if (ent.Indexes.filter(filterVal => {
                        return filterVal.name == resp.indexname;
                    }).length > 0) {
                        indexInfo = ent.Indexes.filter(filterVal => {
                            return filterVal.name == resp.indexname;
                        })[0];
                    }
                    else {
                        indexInfo.columns = [];
                        indexInfo.name = resp.indexname;
                        indexInfo.isUnique = resp.is_unique == 1;
                        indexInfo.isPrimaryKey = resp.is_primary_key == 1;
                        ent.Indexes.push(indexInfo);
                    }
                    indexColumnInfo.name = resp.columnname;
                    if (resp.is_primary_key == 0) {
                        indexInfo.isPrimaryKey = false;
                    }
                    indexInfo.columns.push(indexColumnInfo);
                });
            });
            return entities;
        });
    }
    GetRelations(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = (yield this.Connection.query(`SELECT
            con.relname AS tablewithforeignkey,
            att.attnum as fk_partno,
                 att2.attname AS foreignkeycolumn,
              cl.relname AS tablereferenced,
              att.attname AS foreignkeycolumnreferenced,
              delete_rule as ondelete,
              update_rule as onupdate,
                con.conname as object_id
               FROM (
                   SELECT
                     unnest(con1.conkey) AS parent,
                     unnest(con1.confkey) AS child,
                     con1.confrelid,
                     con1.conrelid,
                     cl_1.relname,
                   con1.conname
                   FROM
                     pg_class cl_1,
                     pg_namespace ns,
                     pg_constraint con1
                   WHERE
                     con1.contype = 'f'::"char"
                     AND cl_1.relnamespace = ns.oid
                     AND con1.conrelid = cl_1.oid
                     and nspname in (${schema})
              ) con,
                pg_attribute att,
                pg_class cl,
                pg_attribute att2,
                information_schema.referential_constraints rc
              WHERE
                att.attrelid = con.confrelid
                AND att.attnum = con.child
                AND cl.oid = con.confrelid
                AND att2.attrelid = con.conrelid
                AND att2.attnum = con.parent
                and rc.constraint_name= con.conname`)).rows;
            let relationsTemp = [];
            response.forEach(resp => {
                let rels = relationsTemp.find(val => {
                    return val.object_id == resp.object_id;
                });
                if (rels == undefined) {
                    rels = {};
                    rels.ownerColumnsNames = [];
                    rels.referencedColumnsNames = [];
                    rels.actionOnDelete =
                        resp.ondelete == "NO ACTION" ? null : resp.ondelete;
                    rels.actionOnUpdate =
                        resp.onupdate == "NO ACTION" ? null : resp.onupdate;
                    rels.object_id = resp.object_id;
                    rels.ownerTable = resp.tablewithforeignkey;
                    rels.referencedTable = resp.tablereferenced;
                    relationsTemp.push(rels);
                }
                rels.ownerColumnsNames.push(resp.foreignkeycolumn);
                rels.referencedColumnsNames.push(resp.foreignkeycolumnreferenced);
            });
            entities = this.GetRelationsFromRelationTempInfo(relationsTemp, entities);
            return entities;
        });
    }
    DisconnectFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Connection) {
                let promise = new Promise((resolve, reject) => {
                    this.Connection.end(err => {
                        if (!err) {
                            resolve(true);
                        }
                        else {
                            TomgUtils.LogError("Error connecting to Postgres Server.", false, err.message);
                            reject(err);
                        }
                    });
                });
                yield promise;
            }
        });
    }
    ConnectToServer(database, server, port, user, password, ssl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Connection = new PG.Client({
                database: database,
                host: server,
                port: port,
                user: user,
                password: password,
                ssl: ssl
            });
            let promise = new Promise((resolve, reject) => {
                this.Connection.connect(err => {
                    if (!err) {
                        resolve(true);
                    }
                    else {
                        TomgUtils.LogError("Error connecting to Postgres Server.", false, err.message);
                        reject(err);
                    }
                });
            });
            yield promise;
        });
    }
    CreateDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Connection.query(`CREATE DATABASE ${dbName}; `);
        });
    }
    UseDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Connection.query(`USE ${dbName}; `);
        });
    }
    DropDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Connection.query(`DROP DATABASE ${dbName}; `);
        });
    }
    CheckIfDBExists(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.Connection.query(`SELECT datname FROM pg_database  WHERE datname  ='${dbName}' `);
            return resp.rowCount > 0;
        });
    }
}
exports.PostgresDriver = PostgresDriver;
//# sourceMappingURL=PostgresDriver.js.map