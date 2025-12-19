import mongoose, { Types } from "mongoose";
import { EventModel, IEvent } from "../models/event.model";

export const EventRepository = {
  create: (data: Partial<IEvent>, session?: mongoose.ClientSession) =>
    EventModel.create([data], { session }).then((res) => res[0]),

  delete: (id: Types.ObjectId, session?: mongoose.ClientSession) =>
    EventModel.deleteOne({ _id: id }).session(session || null),

  findAll: (session?: mongoose.ClientSession) =>
  EventModel.find({})
    .sort({ createdAt: -1 })
    .session(session || null)
    .exec(),


  findById: (id: Types.ObjectId, session?: mongoose.ClientSession) =>
    EventModel.findById(id)
      .session(session || null)
      .exec(),

  update: (
    id: Types.ObjectId,
    data: Partial<IEvent>,
    session?: mongoose.ClientSession
  ) =>
    EventModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, session }
    ).exec(),
  bookSeat: (eventId: Types.ObjectId, session?: mongoose.ClientSession) =>
    EventModel.updateOne(
      {
        _id: eventId,
        $expr: { $lt: ["$bookedCount", "$eventCapacity"] },
      },
      {
        $inc: { bookedCount: 1 },
      },
      { session }
    ),
  releaseSeat: (eventId: Types.ObjectId, session?: mongoose.ClientSession) =>
    EventModel.updateOne(
      {
        _id: eventId,
        bookedCount: { $gt: 0 },
      },
      { $inc: { bookedCount: -1 } },
      { session }
    ),
};
