import { Types } from "mongoose";
import { UserModel, IUser } from "../models/user.model";

export const UserRepository = {
  create: (data: Partial<IUser>) => UserModel.create(data),
  findByEmail: (email: string) => UserModel.findOne({ email }).exec(),
  findByUsername: (username: string) => UserModel.findOne({ username }).exec(),
  findById: (id: Types.ObjectId) => UserModel.findById(id).exec(),
  update: (data: Partial<IUser>, id: Types.ObjectId) =>
    UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).exec(),
};
