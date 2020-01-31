import * as express from "express";

import {sequelize} from "../main";
import User from "../models/user";
import UserContact from "../models/userContact";
import {default as UserProperty, PocketType} from "../models/userProperty";
import {Repository} from "../repository";
import {UserRepository} from "../repository/userRepository";
import {AuthService} from "../service/authService";

async function getUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const decoded = await AuthService.getDecodedToken(req);
  const user = await User.findOne({
    where: {
      uid: decoded.uid,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "user not registered",
    });
  }
  return res.status(200).json(user.toJSON());
}

async function getUserByUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userId = +req.params.userId;
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "user not registered",
    });
  }
  return res.status(200).json(user.toJSON());
}

async function getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
  // TODO: Get roomId by User Auth Info
  const roomId = 1;
  const userRepo = Repository.getRepository("User") as UserRepository;
  const users = await userRepo.getUsersByRoomId(roomId);
  const response: User[] = [];
  if (!users) {
    res.json(response);
    return;
  }
  for (const user of users) {
    response.push(user.toJSON());
  }
  return res.json(response);
}

async function postUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  // create new user and card properties
  const data = req.body;
  const token = AuthService.getAuthorizationToken(req);

  if (!token) {
    throw new Error("token not set");
  }

  const decoded = await AuthService.decodeToken(token);

  const user = data.user as {
    name: string,
  };
  const cards: CardInfo[] = data.cards;

  let registered: User;
  (sequelize as any).transaction((t: any) => {
    return User.create({
      name: user.name,
      uid: decoded.uid,
      roomId: 1,
      socketId: "",
      location: "",
      online: false,
      isAdmin: false,
    }, {
      transaction: t,
    }).then((u: User) => {
      registered = u;
      const props: UserProperty[] = [];
      for (const card of cards) {
        props.push(({
          userId: u.id,
          cardNo: card.cardNo,
          pocketType: card.pocketType,
          isFake: false,
        } as UserProperty));
      }
      console.log(props);
      return UserProperty.bulkCreate(props, {
        transaction: t,
      });
    });
  }).then(async (props: UserProperty[]) => {
    return res.status(200).json({
      code: 200,
      user: registered.toJSON(),
    });
  }).catch(async (err: Error) => {
    return res.status(500).json({
      code: 500,
      message: err.message,
    });
  });
}

async function postContactUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const uid = req.params.uid;
  const body = req.body;
  console.log(uid);
  console.log(body);

  const user = await User.findOne({
    where: {
      uid,
    },
  });
  if (!user) {
    throw new Error("user not found");
  }

  for (const contactUser of body.users) {
    if (contactUser.id === uid) {
      continue;
    }
    const user2 = await User.findOne({
      where: {
        uid: contactUser.id,
        online: true,
      },
    });
    if (!user2) {
      continue;
    }

    const contact = await UserContact.findOne({
      where: {
        $or: [
          {
            userId: user.id,
            contactUserId: user2.id,
          },
          {
            userId: user2.id,
            contactUserId: user.id,
          },
        ],
      },
    });

    if (contact) {
      continue;
    }

    const userContact = UserContact.build({
      userId: user.id,
      contactUserId: user2.id,
    });

    const newUserContact = await userContact.save();
  }

}

async function getContactUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
  const uid = req.params.uid;
  const user = await User.findOne({
    where: {
      uid,
    },
  });
  if (!user) {
    throw new Error("user not found");
  }

  const contacts = await UserContact.findAll({
    where: {
      $or: [
        {
          userId: user.id,
        },
        {
          contactUserId: user.id,
        },
      ],
    },
  });

  const users = [user.toJSON()];
  for (const contact of contacts) {
    if (contact.userId === user.id) {
      const u = await User.findOne({
        where: {
          id: contact.contactUserId,
        },
      });
      if (u) {
        users.push(u.toJSON());
      }
    }
    if (contact.contactUserId === user.id) {
      const u = await User.findOne({
        where: {
          id: contact.userId,
        },
      });
      if (u) {
        users.push(u.toJSON());
      }
    }
  }

  res.json(users);

}

interface CardInfo {
  cardNo: number;
  pocketType: PocketType;
}

export {
  getUsers,
  getUser,
  getContactUsers,
  postUser,
  postContactUser,
  getUserByUserId,
};
