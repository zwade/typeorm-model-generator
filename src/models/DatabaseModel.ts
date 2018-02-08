import { EntityInfo } from "./EntityInfo";
import { EnumInfo } from "./EnumInfo";
export class DatabaseModel {
    entities: EntityInfo[];
    enums: EnumInfo[];
    config: {
        cascadeInsert: boolean;
        cascadeUpdate: boolean;
        cascadeRemove: boolean;
    };

    //TODO:check if unused
    relationImports(): any {
        let that = this;
        return function(text, render) {
            if ("l" != render(text))
                return `import {{curly true}}{{toEntityName ${render(
                    text
                )}}}{{curly false}} from "./{{ ${render(
                    "toFileName" + text
                )}}}`;
            else return "";
        };
    }
}
