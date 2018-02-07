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
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const TomgUtils = require("./Utils");
const changeCase = require("change-case");
/**
 * Engine
 */
class Engine {
    constructor(driver, Options) {
        this.driver = driver;
        this.Options = Options;
    }
    createModelFromDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbModel = yield this.getEntitiesInfo(this.Options.databaseName, this.Options.host, this.Options.port, this.Options.user, this.Options.password, this.Options.schemaName, this.Options.ssl);
            if (dbModel.entities.length > 0) {
                this.createModelFromMetadata(dbModel);
            }
            else {
                TomgUtils.LogFatalError("Tables not found in selected database. Skipping creation of typeorm model.", false);
            }
            return true;
        });
    }
    getEntitiesInfo(database, server, port, user, password, schemaName, ssl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.GetDataFromServer(database, server, port, user, password, schemaName, ssl);
        });
    }
    createModelFromMetadata(databaseModel) {
        this.createHandlebarsHelpers();
        let templatePath = path.resolve(__dirname, "../../src/entity.mst");
        let template = fs.readFileSync(templatePath, "UTF-8");
        let resultPath = this.Options.resultsPath;
        if (!fs.existsSync(resultPath))
            fs.mkdirSync(resultPath);
        let entitesPath = resultPath;
        if (!this.Options.noConfigs) {
            this.createTsConfigFile(resultPath);
            this.createTypeOrmConfig(resultPath);
            entitesPath = path.resolve(resultPath, "./entities");
            if (!fs.existsSync(entitesPath))
                fs.mkdirSync(entitesPath);
        }
        let compliedTemplate = Handlebars.compile(template, { noEscape: true });
        databaseModel.entities.forEach(element => {
            element.Imports = [];
            element.Columns.forEach(column => {
                column.relations.forEach(relation => {
                    if (element.EntityName !== relation.relatedTable) {
                        element.Imports.push(relation.relatedTable);
                    }
                });
            });
            element.Imports.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
            let casedFileName = "";
            switch (this.Options.convertCaseFile) {
                case "camel":
                    casedFileName = changeCase.camelCase(element.EntityName);
                    break;
                case "param":
                    casedFileName = changeCase.paramCase(element.EntityName);
                    break;
                case "pascal":
                    casedFileName = changeCase.pascalCase(element.EntityName);
                    break;
                case "none":
                    casedFileName = element.EntityName;
                    break;
            }
            let resultFilePath = path.resolve(entitesPath, casedFileName + ".ts");
            let rendered = compliedTemplate(element);
            fs.writeFileSync(resultFilePath, rendered, {
                encoding: "UTF-8",
                flag: "w"
            });
        });
    }
    createHandlebarsHelpers() {
        Handlebars.registerHelper("curly", open => {
            return open ? "{" : "}";
        });
        Handlebars.registerHelper("toEntityName", str => {
            let retStr = "";
            switch (this.Options.convertCaseEntity) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper("array", str => str + "[]");
        Handlebars.registerHelper("makeLazy", str => this.Options.lazy ? `Promise<${str}>` : str);
        Handlebars.registerHelper("addLazyParameter", () => this.Options.lazy ? `, { lazy: true }` : "");
        Handlebars.registerHelper("toFileName", str => {
            let retStr = "";
            switch (this.Options.convertCaseFile) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "param":
                    retStr = changeCase.paramCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper("toPropertyName", str => {
            let retStr = "";
            if (this.Options.removeIdSuffix && str.length > 3 && str.endsWith("_id")) {
                str = str.substring(0, str.length - 3);
            }
            switch (this.Options.convertCaseProperty) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper("toLowerCase", str => {
            return str.toLowerCase();
        });
    }
    //TODO:Move to mustache template file
    createTsConfigFile(resultPath) {
        fs.writeFileSync(path.resolve(resultPath, "tsconfig.json"), `{"compilerOptions": {
        "lib": ["es5", "es6"],
        "target": "es6",
        "module": "commonjs",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "sourceMap": true
    }}`, { encoding: "UTF-8", flag: "w" });
    }
    createTypeOrmConfig(resultPath) {
        if (this.Options.schemaName == "") {
            fs.writeFileSync(path.resolve(resultPath, "ormconfig.json"), `[
  {
    "name": "default",
    "type": "${this.Options.databaseType}",
    "host": "${this.Options.host}",
    "port": ${this.Options.port},
    "username": "${this.Options.user}",
    "password": "${this.Options.password}",
    "database": "${this.Options.databaseName}",
    "synchronize": false
    "entities": [
      "entities/*.js"
    ]
  }
]`, { encoding: "UTF-8", flag: "w" });
        }
        else {
            fs.writeFileSync(path.resolve(resultPath, "ormconfig.json"), `[
  {
    "name": "default",
    "type": "${this.Options.databaseType}",
    "host": "${this.Options.host}",
    "port": ${this.Options.port},
    "username": "${this.Options.user}",
    "password": "${this.Options.password}",
    "database": "${this.Options.databaseName}",
    "schema": "${this.Options.schemaName}",
    "synchronize": false,
    "entities": [
      "entities/*.js"
    ]
  }
]`, { encoding: "UTF-8", flag: "w" });
        }
    }
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map