"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityInfo {
    imports() {
        var imports = [];
        this.Columns.forEach(column => {
            column.relations.forEach(relation => {
                if (this.EntityName != relation.relatedTable)
                    imports.push(relation.relatedTable);
            });
            if (column.ts_type && typeof column.ts_type !== "string") {
                imports.push(column.ts_type.name);
            }
        });
        this.UniqueImports = imports.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });
    }
}
exports.EntityInfo = EntityInfo;
//# sourceMappingURL=EntityInfo.js.map