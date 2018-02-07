"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("./../../package.json");
function LogFatalError(errText, isABug = true, errObject) {
    let x = data;
    console.error(errText);
    console.error(`Fatal error occured.`);
    console.error(`${x.name}@${x.version}  node@${process.version}`);
    console.error(`Fatal error occured in typeorm-model-generator.`);
    console.error(`If this is a bug please open an issue including this log on ${x.bugs.url}`);
    if (isABug && !errObject)
        errObject = new Error().stack;
    if (!!errObject)
        console.error(errObject);
    process.abort();
}
exports.LogFatalError = LogFatalError;
//# sourceMappingURL=Utils.js.map