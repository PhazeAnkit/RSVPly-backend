import { Types } from "mongoose";
import { EventUserModel, IEventUser } from "../models/eventUserRelation.model";

export const EventUserRepository = {
  create: (data: Partial<IEventUser>) => EventUserModel.create(data),

  addEvent: (userId: Types.ObjectId, eventId: Types.ObjectId) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $addToSet: { eventsCreated: eventId } },
      { upsert: true, new: true }
    ),

  removeEvent: (userId: Types.ObjectId, eventId: Types.ObjectId) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $pull: { eventsCreated: eventId } },
      { new: true }
    ),

  joinEvent: (userId: Types.ObjectId, eventId: Types.ObjectId) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $addToSet: { eventsJoined: eventId } },
      { upsert: true, new: true }
    ),

  leaveEvent: (userId: Types.ObjectId, eventId: Types.ObjectId) =>
    EventUserModel.findOneAndUpdate(
      { userId },
      { $pull: { eventsJoined: eventId } },
      { new: true }
    ),
};
