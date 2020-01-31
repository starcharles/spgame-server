import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table, Unique} from "sequelize-typescript";

import User from "./user";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class Room extends Model<Room> {
    @Unique
    @Column
    public name: string;

    @HasMany(() => User)
    public users: User[];
}

// export default class Room  {
//     public id: number;
//     public name: string;
//     public users: User[];
// }

// export type Room = {
//     id: number,
//     name: string,
//     users: User[],
// };
