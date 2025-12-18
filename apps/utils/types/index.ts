import { Types } from "mongoose";

export type userToken = {
  sub: Types.ObjectId;
  email: string;
  iat: number;
  exp: number;
};
