import mongoose, { Types } from "mongoose";
import { EventUserModel, IEventUser } from "../models/eventUserRelation.model";
import { UserModel } from "../models/user.model";

export const EventUserRepository = {
  create: (data: Partial<IEventUser>, session?: mongoose.ClientSession) =>
    EventUserModel.create([data], { session }).then((res) => res[0]),

  createIfNotExists: (
    userId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.updateOne(
      { userId },
      {
        $setOnInsert: {
          userId,
          eventsJoined: [],
          eventsCreated: [],
        },
      },
      { upsert: true, session }
    ),

  addEvent: (
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $addToSet: { eventsCreated: eventId } },
      { upsert: true, new: true, session }
    ),

  removeEvent: (
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $pull: { eventsCreated: eventId } },
      { new: true, session }
    ),

  joinEvent: (
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.updateOne(
      {
        userId,
        eventsJoined: { $ne: eventId },
      },
      {
        $addToSet: { eventsJoined: eventId },
      },
      { session }
    ),

  leaveEvent: (
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.updateOne(
      {
        userId,
        eventsJoined: eventId,
      },
      {
        $pull: { eventsJoined: eventId },
      },
      { session }
    ),

  hasUserCreatedEvent: async (
    userId: Types.ObjectId,
    eventId: Types.ObjectId
  ): Promise<boolean> => {
    const exists = await EventUserModel.findOne({
      userId: userId,
      eventsCreated: eventId,
    }).select("_id");

    return !!exists;
  },
  getDashboardData: async (userId: Types.ObjectId) => {
    return EventUserModel.findOne({ userId })
      .populate(
        "eventsCreated",
        "description eventTime location bookedCount eventCapacity"
      )
      .populate(
        "eventsJoined",
        "description eventTime location bookedCount eventCapacity"
      ).lean();
  },
};
