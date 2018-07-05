import { RelationInfo } from "./RelationInfo";

export class ColumnInfo {
    tsName: string = "";
    sqlName: string = "";
    default: string | null = null;
    is_nullable: boolean = false;
    ts_type: string | { kind: "enum", name: string };
    is_unique: boolean = false;
    sql_type: string;
    lenght: number | null = null;
    width: number | null = null;
    isPrimary: boolean = false;
    is_generated: boolean = false;
    numericPrecision: number | null = null;
    numericScale: number | null = null;
    enumOptions: string | null = null;
    relations: RelationInfo[];
    constructor() {
        this.relations = [];
    }
}
