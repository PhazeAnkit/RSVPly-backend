import mongoose, { Types } from "mongoose";
import { EventUserModel, IEventUser } from "../models/eventUserRelation.model";
import { UserModel } from "../models/user.model";

export const EventUserRepository = {
  create: (data: Partial<IEventUser>, session?: mongoose.ClientSession) =>
    EventUserModel.create([data], { session }).then((res) => res[0]),

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
    EventUserModel.findOneAndUpdate(
      { userId },
      { $addToSet: { eventsJoined: eventId } },
      { upsert: true, new: true, session }
    ),

  leaveEvent: (
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
    session?: mongoose.ClientSession
  ) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $pull: { eventsJoined: eventId } },
      { new: true, session }
    ),

  hasUserCreatedEvent: async (
    userId: Types.ObjectId,
    eventId: Types.ObjectId
  ): Promise<boolean> => {
    const result = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },

      {
        $lookup: {
          from: "eventusers",
          localField: "_id",
          foreignField: "userId",
          as: "eventUser",
        },
      },

      {
        $unwind: {
          path: "$eventUser",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 0,
          isCreator: {
            $in: [eventId, "$eventUser.eventsCreated"],
          },
        },
      },
    ]);

    return result.length > 0 && result[0].isCreator === true;
  },
};
