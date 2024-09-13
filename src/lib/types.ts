import { User } from "@prisma/client";
import { Game } from "@prisma/client";

export type TUser = User;
export type TGame = Game;
export type Session = {
  user: {
    name: string;
    email: string;
  };
};
