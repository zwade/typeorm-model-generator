import { ColumnInfo } from "./ColumnInfo";

export class EntityInfo {
    EntityName: string;
    Columns: ColumnInfo[];
    Type?: "BASE TABLE" | "VIEW";
    Imports: string[];
    UniqueImports: string[];
    Indexes: IndexInfo[];
    Schema: string;
    GenerateConstructor: boolean;

    imports(): any {
        var imports: string[] = [];
        this.Columns.forEach(column => {
            column.relations.forEach(relation => {
                if (this.EntityName != relation.relatedTable)
                    imports.push(relation.relatedTable);
            });

            if (column.ts_type && typeof column.ts_type !== "string") {
                imports.push(column.ts_type.name);
            }
        });
        this.UniqueImports = imports.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
    }
}
