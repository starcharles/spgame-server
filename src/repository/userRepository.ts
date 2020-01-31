import Room from "../models/room";
import User, {UserState} from "../models/user";
import UserProperty from "../models/userProperty";

export class UserRepository {
    public async getUserById(userId: number): Promise<User | null> {
        return await User.findByPk(userId, {
            include: [UserProperty],
        });
    }

    public async getUserBySocketId(socketId: string): Promise<User | null> {
        return await User.find({
            where: {
                socketId,
            },
            include: [Room],
        });
    }

    public async getUsersByRoomId(roomId: number): Promise<User[] | null> {
        return await User.findAll({
            where: {
                roomId,
            },
        });
    }

    public async getUsersById(userIds: number[]): Promise<User | User[] | null> {
        if (userIds.length === 1) {
            return await this.getUserById(userIds[0]);
        }
        return await User.findAll({
            where: {
                id: userIds,
            },
        });
    }

    public async updateUserStateById(userId: number, userState: UserState): Promise<User | null> {
        const user = await this.getUserById(userId);
        if (!user) {
            return null;
        }
        user.state = userState;
        return await user.save();
    }
}
