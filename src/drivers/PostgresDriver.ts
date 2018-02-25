import { AbstractDriver } from "./AbstractDriver";
import * as PG from "pg";
import { ColumnInfo } from "./../models/ColumnInfo";
import { EntityInfo } from "./../models/EntityInfo";
import { EnumInfo } from "./../models/EnumInfo";
import { RelationInfo } from "./../models/RelationInfo";
import { DatabaseModel } from "./../models/DatabaseModel";
import * as TomgUtils from "./../Utils";
/**
 * PostgresDriver
 */
export class PostgresDriver extends AbstractDriver {
    private Connection: PG.Client;

    FindPrimaryColumnsFromIndexes(dbModel: DatabaseModel) {
        dbModel.entities.forEach(entity => {
            let primaryIndex = entity.Indexes.find(v => v.isPrimaryKey);
            if (!primaryIndex) {
                TomgUtils.LogFatalError(
                    `Table ${entity.EntityName} has no PK.`,
                    false
                );
                return;
            }
            entity.Columns.forEach(col => {
                if (
                    primaryIndex!.columns.some(
                        cIndex => cIndex.name == col.name
                    )
                )
                    col.isPrimary = true;
            });
        });
    }

    async GetAllTables(schema: string): Promise<EntityInfo[]> {
        let response: {
            table_schema: string;
            table_name: string;
        }[] = (await this.Connection.query(
            `SELECT table_schema,table_name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND table_schema = '${schema}' `
        )).rows;

        let ret: EntityInfo[] = <EntityInfo[]>[];
        response.forEach(val => {
            let ent: EntityInfo = new EntityInfo();
            ent.EntityName = val.table_name;
            ent.Columns = <ColumnInfo[]>[];
            ent.Indexes = <IndexInfo[]>[];
            ret.push(ent);
        });
        return ret;
    }
    async GetCoulmnsFromEntity(
        entities: EntityInfo[],
        schema: string
    ): Promise<EntityInfo[]> {
        let response: {
            table_name: string;
            column_name: string;
            column_default: string;
            is_nullable: string;
            udt_name: string;
            character_maximum_length: number;
            numeric_precision: number;
            numeric_scale: number;
            isidentity: string;
        }[] = (await this.Connection
            .query(`SELECT table_name,column_name,column_default,is_nullable,
            udt_name,character_maximum_length,numeric_precision,numeric_scale
            --,COLUMNPROPERTY(object_id(table_name), column_name, 'isidentity') isidentity
           , case when column_default LIKE 'nextval%' then 'YES' else 'NO' end isidentity
            FROM INFORMATION_SCHEMA.COLUMNS where table_schema ='${schema}'`))
            .rows;

        entities.forEach(ent => {
            response
                .filter(filterVal => {
                    return filterVal.table_name == ent.EntityName;
                })
                .forEach(resp => {
                    let colInfo: ColumnInfo = new ColumnInfo();
                    colInfo.name = resp.column_name;
                    colInfo.is_nullable =
                        resp.is_nullable == "YES" ? true : false;
                    colInfo.is_generated =
                        resp.isidentity == "YES" ? true : false;
                    colInfo.default = colInfo.is_generated
                        ? ""
                        : resp.column_default;
                    switch (resp.udt_name) {
                        case "int4":
                            colInfo.ts_type = "number";
                            colInfo.sql_type = "int";
                            break;
                        case "varchar":
                            colInfo.ts_type = "string";
                            colInfo.sql_type = "varchar";
                            colInfo.char_max_lenght =
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
                            colInfo.ts_type = "string";
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
                            colInfo.char_max_lenght =
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

                    if (colInfo.sql_type) ent.Columns.push(colInfo);
                });
        });
        return entities;
    }
    async GetIndexesFromEntity(
        entities: EntityInfo[],
        schema: string
    ): Promise<EntityInfo[]> {
        let response: {
            tablename: string;
            indexname: string;
            columnname: string;
            is_unique: number;
            is_primary_key: number; //, is_descending_key: number//, is_included_column: number
        }[] = (await this.Connection.query(`SELECT
                t.relname AS tablename,
                i.relname AS indexname,
                a.attname AS columnname,
                ix.indisunique AS is_unique,
                ix.indisprimary AS is_primary_key
            FROM
                pg_namespace n,
                pg_class t,
                pg_class i,
                pg_index ix,
                pg_attribute a
            WHERE
                n.nspname = '${schema}'
                AND t.relnamespace = n.oid
                AND t.oid = ix.indrelid
                AND i.oid = ix.indexrelid
                AND a.attrelid = t.oid
                AND a.attnum = ANY(ix.indkey)
                AND t.relkind = 'r'
            ORDER BY
                t.relname,
                i.relname;`)).rows;
        entities.forEach(ent => {
            response
                .filter(filterVal => {
                    return filterVal.tablename == ent.EntityName;
                })
                .forEach(resp => {
                    let indexInfo: IndexInfo = <IndexInfo>{};
                    let indexColumnInfo: IndexColumnInfo = <IndexColumnInfo>{};
                    if (
                        ent.Indexes.filter(filterVal => {
                            return filterVal.name == resp.indexname;
                        }).length > 0
                    ) {
                        indexInfo = ent.Indexes.filter(filterVal => {
                            return filterVal.name == resp.indexname;
                        })[0];
                    } else {
                        indexInfo.columns = <IndexColumnInfo[]>[];
                        indexInfo.name = resp.indexname;
                        indexInfo.isUnique = resp.is_unique == 1 ? true : false;
                        indexInfo.isPrimaryKey =
                            resp.is_primary_key == 1 ? true : false;
                        ent.Indexes.push(indexInfo);
                    }
                    indexColumnInfo.name = resp.columnname;
                    if (resp.is_primary_key == 0) {
                        indexInfo.isPrimaryKey = false;
                    }
                    // indexColumnInfo.isIncludedColumn = resp.is_included_column == 1 ? true : false;
                    //indexColumnInfo.isDescending = resp.is_descending_key == 1 ? true : false;
                    indexInfo.columns.push(indexColumnInfo);
                });
        });

        return entities;
    }
    async GetRelations(
        entities: EntityInfo[],
        schema: string
    ): Promise<EntityInfo[]> {
        let response: {
            tablewithforeignkey: string;
            fk_partno: number;
            foreignkeycolumn: string;
            tablereferenced: string;
            foreignkeycolumnreferenced: string;
            ondelete: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION";
            onupdate: "RESTRICT" | "CASCADE" | "SET NULL" | "NO ACTION";
            object_id: string;
        }[] = (await this.Connection.query(`SELECT
            con.relname AS tablewithforeignkey,
            att.attnum as fk_partno,
                 att2.attname AS foreignkeycolumn,
              cl.relname AS tablereferenced,
              att.attname AS foreignkeycolumnreferenced,
               update_rule as ondelete,
               delete_rule as onupdate,
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
                     and nspname='${schema}'
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
        let relationsTemp: RelationTempInfo[] = <RelationTempInfo[]>[];
        response.forEach(resp => {
            let rels = relationsTemp.find(val => {
                return val.object_id == resp.object_id;
            });
            if (rels == undefined) {
                rels = <RelationTempInfo>{};
                rels.ownerColumnsNames = [];
                rels.referencedColumnsNames = [];
                rels.actionOnDelete = resp.ondelete;
                rels.actionOnUpdate = resp.onupdate;
                rels.object_id = resp.object_id;
                rels.ownerTable = resp.tablewithforeignkey;
                rels.referencedTable = resp.tablereferenced;
                relationsTemp.push(rels);
            }
            rels.ownerColumnsNames.push(resp.foreignkeycolumn);
            rels.referencedColumnsNames.push(resp.foreignkeycolumnreferenced);
        });
        relationsTemp.forEach(relationTmp => {
            let ownerEntity = entities.find(entitity => {
                return entitity.EntityName == relationTmp.ownerTable;
            });
            if (!ownerEntity) {
                TomgUtils.LogFatalError(
                    `Relation between tables ${relationTmp.ownerTable} and ${
                        relationTmp.referencedTable
                    } didn't found entity model ${relationTmp.ownerTable}.`
                );
                return;
            }
            let referencedEntity = entities.find(entitity => {
                return entitity.EntityName == relationTmp.referencedTable;
            });
            if (!referencedEntity) {
                TomgUtils.LogFatalError(
                    `Relation between tables ${relationTmp.ownerTable} and ${
                        relationTmp.referencedTable
                    } didn't found entity model ${relationTmp.referencedTable}.`
                );
                return;
            }
            let ownerColumn = ownerEntity.Columns.find(column => {
                return column.name == relationTmp.ownerColumnsNames[0];
            });
            if (!ownerColumn) {
                TomgUtils.LogFatalError(
                    `Relation between tables ${relationTmp.ownerTable} and ${
                        relationTmp.referencedTable
                    } didn't found entity column ${
                        relationTmp.ownerTable
                    }.${ownerColumn}.`
                );
                return;
            }
            let relatedColumn = referencedEntity.Columns.find(column => {
                return column.name == relationTmp.referencedColumnsNames[0];
            });
            if (!relatedColumn) {
                TomgUtils.LogFatalError(
                    `Relation between tables ${relationTmp.ownerTable} and ${
                        relationTmp.referencedTable
                    } didn't found entity column ${
                        relationTmp.referencedTable
                    }.${relatedColumn}.`
                );
                return;
            }
            let ownColumn: ColumnInfo = ownerColumn;
            let isOneToMany: boolean;
            isOneToMany = false;
            let index = ownerEntity.Indexes.find(index => {
                return (
                    index.isUnique &&
                    index.columns.some(col => {
                        return col.name == ownerColumn!.name;
                    })
                );
            });
            if (!index) {
                isOneToMany = true;
            } else {
                isOneToMany = false;
            }
            let ownerRelation = new RelationInfo();
            let columnName =
                ownerEntity.EntityName.toLowerCase() + (isOneToMany ? "s" : "");
            if (
                referencedEntity.Columns.filter(filterVal => {
                    return filterVal.name == columnName;
                }).length > 0
            ) {
                for (let i = 2; i <= ownerEntity.Columns.length; i++) {
                    columnName =
                        ownerEntity.EntityName.toLowerCase() +
                        (isOneToMany ? "s" : "") +
                        i.toString();
                    if (
                        referencedEntity.Columns.filter(filterVal => {
                            return filterVal.name == columnName;
                        }).length == 0
                    )
                        break;
                }
            }
            ownerRelation.actionOnDelete = relationTmp.actionOnDelete;
            ownerRelation.actionOnUpdate = relationTmp.actionOnUpdate;
            ownerRelation.isOwner = true;
            ownerRelation.relatedColumn = relatedColumn.name.toLowerCase();
            ownerRelation.relatedTable = relationTmp.referencedTable;
            ownerRelation.ownerTable = relationTmp.ownerTable;
            ownerRelation.ownerColumn = columnName;
            ownerRelation.relationType = isOneToMany ? "ManyToOne" : "OneToOne";
            ownerColumn.relations.push(ownerRelation);
            if (isOneToMany) {
                let col = new ColumnInfo();
                col.name = columnName;
                let referencedRelation = new RelationInfo();
                col.relations.push(referencedRelation);
                referencedRelation.actionondelete = relationTmp.actionOnDelete;
                referencedRelation.actiononupdate = relationTmp.actionOnUpdate;
                referencedRelation.isOwner = false;
                referencedRelation.relatedColumn = ownerColumn.name;
                referencedRelation.relatedTable = relationTmp.ownerTable;
                referencedRelation.ownerTable = relationTmp.referencedTable;
                referencedRelation.ownerColumn = relatedColumn.name.toLowerCase();
                referencedRelation.relationType = "OneToMany";
                referencedEntity.Columns.push(col);
            } else {
                let col = new ColumnInfo();
                col.name = columnName;
                let referencedRelation = new RelationInfo();
                col.relations.push(referencedRelation);
                referencedRelation.actionondelete = relationTmp.actionOnDelete;
                referencedRelation.actiononupdate = relationTmp.actionOnUpdate;
                referencedRelation.isOwner = false;
                referencedRelation.relatedColumn = ownerColumn.name;
                referencedRelation.relatedTable = relationTmp.ownerTable;
                referencedRelation.ownerTable = relationTmp.referencedTable;
                referencedRelation.ownerColumn = relatedColumn.name.toLowerCase();
                referencedRelation.relationType = "OneToOne";

                referencedEntity.Columns.push(col);
            }
        });
        return entities;
    }
    async GetEnums(schema: string): Promise<EnumInfo[]> {
        let enumsResponse: {
            enum_name: string;
            enum_value: string;
        }[] = (await this.Connection.query(`
            SELECT t.typname AS enum_name,
                e.enumlabel AS enum_value
            FROM pg_type t
                JOIN pg_enum e ON t.oid = e.enumtypid
                JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = '${schema}'`))
                .rows;

        let enums =
            enumsResponse
                .reduce((enums, { enum_name, enum_value }) => {
                    if (!enums.has(enum_name)) {
                        enums.set(enum_name, []);
                    }

                    enums.get(enum_name)!.push(enum_value);
                    return enums;
                }, new Map<string, string[]>());

        return Array.from(enums.keys()).map((name) => ({ name, values: enums.get(name)! }));
    }
    async DisconnectFromServer() {
        if (this.Connection) {
            let promise = new Promise<boolean>((resolve, reject) => {
                this.Connection.end(err => {
                    if (!err) {
                        //Connection successfull
                        resolve(true);
                    } else {
                        TomgUtils.LogFatalError(
                            "Error connecting to Postgres Server.",
                            false,
                            err.message
                        );
                        reject(err);
                    }
                });
            });
            await promise;
        }
    }

    async ConnectToServer(
        database: string,
        server: string,
        port: number,
        user: string,
        password: string,
        ssl: boolean
    ) {
        this.Connection = new PG.Client({
            database: database,
            host: server,
            port: port,
            user: user,
            password: password,
            ssl: ssl
        });

        let promise = new Promise<boolean>((resolve, reject) => {
            this.Connection.connect(err => {
                if (!err) {
                    //Connection successfull
                    resolve(true);
                } else {
                    TomgUtils.LogFatalError(
                        "Error connecting to Postgres Server.",
                        false,
                        err.message
                    );
                    reject(err);
                }
            });
        });

        await promise;
    }

    async CreateDB(dbName: string) {
        let resp = await this.Connection.query(`CREATE DATABASE ${dbName}; `);
    }
    async UseDB(dbName: string) {
        let resp = await this.Connection.query(`USE ${dbName}; `);
    }
    async DropDB(dbName: string) {
        let resp = await this.Connection.query(`DROP DATABASE ${dbName}; `);
    }
    async CheckIfDBExists(dbName: string): Promise<boolean> {
        let resp = await this.Connection.query(
            `SELECT datname FROM pg_database  WHERE datname  ='${dbName}' `
        );
        return resp.rowCount > 0;
    }
}
