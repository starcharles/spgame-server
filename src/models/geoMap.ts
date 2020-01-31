import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";

import User from "./user";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class GeoMap extends Model<GeoMap> {

    @ForeignKey(() => User)
    @Column
    public userId: number;

    @Column
    public location: string;
}

// export default class GeoMap {
//     public userId: number;
//     public location: string;
// }
// export type GeoMap = {
//     userId: number,
//     location: string,
// };
