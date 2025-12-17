import { Types } from "mongoose";
import { EventModel, IEvent } from "../models/event.model";

export const EventRepository = {
  create: (data: Partial<IEvent>) => EventModel.create(data),
  delete: (id: Types.ObjectId) => EventModel.deleteOne({ _id: id }),
  findById: (id: Types.ObjectId) => EventModel.findById(id).exec(),
  update: (id: Types.ObjectId, data: Partial<IEvent>) =>
    EventModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).exec(),
};
