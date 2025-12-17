import { Schema, model, Types } from "mongoose";

export interface IEventUser {
  userId: Types.ObjectId;
  eventsCreated: Types.ObjectId[];
  eventsJoined: Types.ObjectId[];
}

const EventUserSchema = new Schema<IEventUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    eventsCreated: {
      type: [Schema.Types.ObjectId],
      ref: "Event",
      default: [],
    },
    eventsJoined: {
      type: [Schema.Types.ObjectId],
      ref: "Event",
      default: [],
    },
  },
  { timestamps: true }
);

export const EventUserModel = model<IEventUser>("EventUser", EventUserSchema);
