import { Schema, model, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
  eventCapacity: number;
  bookedCount: number;
  eventTime: Date;
  bookingClose: Date;
  description: string;
  meetingLink?: string;
  location?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    eventCapacity: {
      type: Number,
      required: true,
    },
    bookedCount: {
      type: Number,
      required: true,
    },
    eventTime: {
      type: Date,
      required: true,
    },
    bookingClose: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meetingLink: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

export const EventModel = model<IEvent>("Event", EventSchema);
