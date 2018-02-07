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
const ts = require("typescript");
const MssqlDriver_1 = require("../../src/drivers/MssqlDriver");
const PostgresDriver_1 = require("./../../src/drivers/PostgresDriver");
const MysqlDriver_1 = require("../../src/drivers/MysqlDriver");
const MariaDbDriver_1 = require("../../src/drivers/MariaDbDriver");
const OracleDriver_1 = require("../../src/drivers/OracleDriver");
const Engine_1 = require("../../src/Engine");
const typeorm_1 = require("typeorm");
const yn = require("yn");
const path = require("path");
function createMSSQLModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MssqlDriver_1.MssqlDriver();
        yield driver.ConnectToServer(`master`, String(process.env.MSSQL_Host), Number(process.env.MSSQL_Port), String(process.env.MSSQL_Username), String(process.env.MSSQL_Password), yn(process.env.MSSQL_SSL));
        if (!(yield driver.CheckIfDBExists(String(process.env.MSSQL_Database))))
            yield driver.CreateDB(String(process.env.MSSQL_Database));
        yield driver.DisconnectFromServer();
        let connOpt = {
            database: String(process.env.MSSQL_Database),
            host: String(process.env.MSSQL_Host),
            password: String(process.env.MSSQL_Password),
            type: 'mssql',
            username: String(process.env.MSSQL_Username),
            port: Number(process.env.MSSQL_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected)
            yield conn.close();
        driver = new MssqlDriver_1.MssqlDriver();
        let engine = new Engine_1.Engine(driver, {
            host: String(process.env.MSSQL_Host),
            port: Number(process.env.MSSQL_Port),
            databaseName: String(process.env.MSSQL_Database),
            user: String(process.env.MSSQL_Username),
            password: String(process.env.MSSQL_Password),
            databaseType: 'mssql',
            resultsPath: resultsPath,
            schemaName: 'dbo',
            ssl: yn(process.env.MSSQL_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            removeIdSuffix: false,
            lazy: false,
        });
        return engine;
    });
}
exports.createMSSQLModels = createMSSQLModels;
function createPostgresModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new PostgresDriver_1.PostgresDriver();
        yield driver.ConnectToServer(`postgres`, String(process.env.POSTGRES_Host), Number(process.env.POSTGRES_Port), String(process.env.POSTGRES_Username), String(process.env.POSTGRES_Password), yn(process.env.POSTGRES_SSL));
        if (!(yield driver.CheckIfDBExists(String(process.env.POSTGRES_Database))))
            yield driver.CreateDB(String(process.env.POSTGRES_Database));
        yield driver.DisconnectFromServer();
        let connOpt = {
            database: String(process.env.POSTGRES_Database),
            host: String(process.env.POSTGRES_Host),
            password: String(process.env.POSTGRES_Password),
            type: 'postgres',
            username: String(process.env.POSTGRES_Username),
            port: Number(process.env.POSTGRES_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected)
            yield conn.close();
        driver = new PostgresDriver_1.PostgresDriver();
        let engine = new Engine_1.Engine(driver, {
            host: String(process.env.POSTGRES_Host),
            port: Number(process.env.POSTGRES_Port),
            databaseName: String(process.env.POSTGRES_Database),
            user: String(process.env.POSTGRES_Username),
            password: String(process.env.POSTGRES_Password),
            databaseType: 'postgres',
            resultsPath: resultsPath,
            schemaName: 'public',
            ssl: yn(process.env.POSTGRES_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            removeIdSuffix: false,
            lazy: false,
        });
        return engine;
    });
}
exports.createPostgresModels = createPostgresModels;
function createMysqlModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MysqlDriver_1.MysqlDriver();
        yield driver.ConnectToServer(`mysql`, String(process.env.MYSQL_Host), Number(process.env.MYSQL_Port), String(process.env.MYSQL_Username), String(process.env.MYSQL_Password), yn(process.env.MYSQL_SSL));
        if (!(yield driver.CheckIfDBExists(String(process.env.MYSQL_Database))))
            yield driver.CreateDB(String(process.env.MYSQL_Database));
        yield driver.DisconnectFromServer();
        let connOpt = {
            database: String(process.env.MYSQL_Database),
            host: String(process.env.MYSQL_Host),
            password: String(process.env.MYSQL_Password),
            type: 'mysql',
            username: String(process.env.MYSQL_Username),
            port: Number(process.env.MYSQL_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected)
            yield conn.close();
        driver = new MysqlDriver_1.MysqlDriver();
        let engine = new Engine_1.Engine(driver, {
            host: String(process.env.MYSQL_Host),
            port: Number(process.env.MYSQL_Port),
            databaseName: String(process.env.MYSQL_Database),
            user: String(process.env.MYSQL_Username),
            password: String(process.env.MYSQL_Password),
            databaseType: 'mysql',
            resultsPath: resultsPath,
            schemaName: 'ignored',
            ssl: yn(process.env.MYSQL_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            removeIdSuffix: false,
            lazy: false,
        });
        return engine;
    });
}
exports.createMysqlModels = createMysqlModels;
function createMariaDBModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MariaDbDriver_1.MariaDbDriver();
        yield driver.ConnectToServer(`mysql`, String(process.env.MARIADB_Host), Number(process.env.MARIADB_Port), String(process.env.MARIADB_Username), String(process.env.MARIADB_Password), yn(process.env.MARIADB_SSL));
        if (!(yield driver.CheckIfDBExists(String(process.env.MARIADB_Database))))
            yield driver.CreateDB(String(process.env.MARIADB_Database));
        yield driver.DisconnectFromServer();
        let connOpt = {
            database: String(process.env.MARIADB_Database),
            host: String(process.env.MARIADB_Host),
            password: String(process.env.MARIADB_Password),
            type: 'mariadb',
            username: String(process.env.MARIADB_Username),
            port: Number(process.env.MARIADB_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected)
            yield conn.close();
        driver = new MariaDbDriver_1.MariaDbDriver();
        let engine = new Engine_1.Engine(driver, {
            host: String(process.env.MARIADB_Host),
            port: Number(process.env.MARIADB_Port),
            databaseName: String(process.env.MARIADB_Database),
            user: String(process.env.MARIADB_Username),
            password: String(process.env.MARIADB_Password),
            databaseType: 'mariadb',
            resultsPath: resultsPath,
            schemaName: 'ignored',
            ssl: yn(process.env.MARIADB_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            removeIdSuffix: false,
            lazy: false,
        });
        return engine;
    });
}
exports.createMariaDBModels = createMariaDBModels;
function createOracleDBModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new OracleDriver_1.OracleDriver();
        yield driver.ConnectToServer(String(process.env.ORACLE_Database), String(process.env.ORACLE_Host), Number(process.env.ORACLE_Port), String(process.env.ORACLE_Username), String(process.env.ORACLE_Password), yn(process.env.ORACLE_SSL));
        if (!(yield driver.CheckIfDBExists(String(process.env.ORACLE_Database))))
            yield driver.CreateDB(String(process.env.ORACLE_Database));
        yield driver.DisconnectFromServer();
        let connOpt = {
            database: String(process.env.ORACLE_Database),
            sid: String(process.env.ORACLE_Database),
            host: String(process.env.ORACLE_Host),
            password: String(process.env.ORACLE_Password),
            type: 'oracle',
            username: String(process.env.ORACLE_Username),
            port: Number(process.env.ORACLE_Port),
            // dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected)
            yield conn.close();
        driver = new OracleDriver_1.OracleDriver();
        let engine = new Engine_1.Engine(driver, {
            host: String(process.env.ORACLE_Host),
            port: Number(process.env.ORACLE_Port),
            databaseName: String(process.env.ORACLE_Database),
            user: String(process.env.ORACLE_Username),
            password: String(process.env.ORACLE_Password),
            databaseType: 'oracle',
            resultsPath: resultsPath,
            schemaName: String(process.env.ORACLE_Username),
            ssl: yn(process.env.ORACLE_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            removeIdSuffix: false,
            lazy: false,
        });
        return engine;
    });
}
exports.createOracleDBModels = createOracleDBModels;
function compileTsFiles(fileNames, options) {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();
    let compileErrors = false;
    let preDiagnostics = ts.getPreEmitDiagnostics(program);
    let allDiagnostics = [...preDiagnostics, ...emitResult.diagnostics];
    allDiagnostics.forEach(diagnostic => {
        let lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${lineAndCharacter.line + 1},${lineAndCharacter.character + 1}): ${message}`);
        compileErrors = true;
    });
    return compileErrors;
}
exports.compileTsFiles = compileTsFiles;
//# sourceMappingURL=GeneralTestUtils.js.map