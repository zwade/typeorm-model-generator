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
require('dotenv').config();
require("reflect-metadata");
const fs = require("fs-extra");
const path = require("path");
const chai_1 = require("chai");
const EntityFileToJson_1 = require("../utils/EntityFileToJson");
var chai = require('chai');
var chaiSubset = require('chai-subset');
const ts = require("typescript");
const GTU = require("../utils/GeneralTestUtils");
chai.use(chaiSubset);
describe("Platform specyfic types", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(20000);
        this.slow(5000); //compiling created models takes time
        let dbDrivers = [];
        if (process.env.POSTGRES_Skip == '0')
            dbDrivers.push('postgres');
        if (process.env.MYSQL_Skip == '0')
            dbDrivers.push('mysql');
        if (process.env.MARIADB_Skip == '0')
            dbDrivers.push('mariadb');
        if (process.env.MSSQL_Skip == '0')
            dbDrivers.push('mssql');
        let examplesPathJS = path.resolve(process.cwd(), 'dist/test/integration/entityTypes');
        let examplesPathTS = path.resolve(process.cwd(), 'test/integration/entityTypes');
        let files = fs.readdirSync(examplesPathTS);
        for (let dbDriver of dbDrivers) {
            for (let folder of files) {
                if (dbDriver == folder) {
                    it(dbDriver, function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            let filesOrgPathJS = path.resolve(examplesPathJS, folder, 'entity');
                            let filesOrgPathTS = path.resolve(examplesPathTS, folder, 'entity');
                            let resultsPath = path.resolve(process.cwd(), `output`);
                            fs.removeSync(resultsPath);
                            let engine;
                            switch (dbDriver) {
                                case 'mssql':
                                    engine = yield GTU.createMSSQLModels(filesOrgPathJS, resultsPath);
                                    break;
                                case 'postgres':
                                    engine = yield GTU.createPostgresModels(filesOrgPathJS, resultsPath);
                                    break;
                                case 'mysql':
                                    engine = yield GTU.createMysqlModels(filesOrgPathJS, resultsPath);
                                    break;
                                case 'mariadb':
                                    engine = yield GTU.createMariaDBModels(filesOrgPathJS, resultsPath);
                                    break;
                                default:
                                    console.log(`Unknown engine type`);
                                    engine = {};
                                    break;
                            }
                            let result = yield engine.createModelFromDatabase();
                            let filesGenPath = path.resolve(resultsPath, 'entities');
                            let filesOrg = fs.readdirSync(filesOrgPathTS).filter(function (val, ind, arr) { return val.toString().endsWith('.ts'); });
                            let filesGen = fs.readdirSync(filesGenPath).filter(function (val, ind, arr) { return val.toString().endsWith('.ts'); });
                            chai_1.expect(filesOrg, 'Errors detected in model comparision').to.be.deep.equal(filesGen);
                            for (let file of filesOrg) {
                                let entftj = new EntityFileToJson_1.EntityFileToJson();
                                let jsonEntityOrg = entftj.convert(fs.readFileSync(path.resolve(filesOrgPathTS, file)));
                                let jsonEntityGen = entftj.convert(fs.readFileSync(path.resolve(filesGenPath, file)));
                                chai_1.expect(jsonEntityGen, `Error in file ${file}`).to.containSubset(jsonEntityOrg);
                            }
                            const currentDirectoryFiles = fs.readdirSync(filesGenPath).
                                filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts").map(v => {
                                return path.resolve(filesGenPath, v);
                            });
                            let compileErrors = GTU.compileTsFiles(currentDirectoryFiles, {
                                experimentalDecorators: true,
                                sourceMap: false,
                                emitDecoratorMetadata: true,
                                target: ts.ScriptTarget.ES2016,
                                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                                module: ts.ModuleKind.CommonJS
                            });
                            chai_1.expect(compileErrors, 'Errors detected while compiling generated model').to.be.false;
                        });
                    });
                }
            }
        }
    });
});
//# sourceMappingURL=entityTypes.test.js.map