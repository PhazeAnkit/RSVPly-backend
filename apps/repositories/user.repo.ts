import mongoose, { Types } from "mongoose";
import { UserModel, IUser } from "../models/user.model";

export const UserRepository = {
  create: (data: Partial<IUser>, session?: mongoose.ClientSession) =>
    UserModel.create([data], { session }).then((res) => res[0]),

  findByEmail: (email: string, session?: mongoose.ClientSession) =>
    UserModel.findOne({ email })
      .session(session || null)
      .exec(),

  findByUsername: (username: string, session?: mongoose.ClientSession) =>
    UserModel.findOne({ username })
      .session(session || null)
      .exec(),

  findById: (id: Types.ObjectId, session?: mongoose.ClientSession) =>
    UserModel.findById(id)
      .session(session || null)
      .exec(),

  findByEmailWithPassword: (email: string, session?: mongoose.ClientSession) =>
    UserModel.findOne({ email })
      .select("+password")
      .session(session || null)
      .exec(),

  update: (
    data: Partial<IUser>,
    id: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, session }
    ).exec(),
};
