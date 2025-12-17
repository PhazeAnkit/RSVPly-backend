import { Schema, model, Document, Model } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  Location: string;
  contactNumber: string;
}

const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    Location: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
