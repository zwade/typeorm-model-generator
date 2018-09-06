"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseModel {
    //TODO:check if unused
    relationImports() {
        let that = this;
        return function (text, render) {
            if ("l" != render(text))
                return `import {{curly true}}{{toEntityName ${render(text)}}}{{curly false}} from "./{{ ${render("toFileName" + text)}}}`;
            else
                return "";
        };
    }
}
exports.DatabaseModel = DatabaseModel;

//# sourceMappingURL=DatabaseModel.js.map
