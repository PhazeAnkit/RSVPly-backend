import { Types } from "mongoose";
import { EventRepository } from "../repositories/event.repo";
import { UserRepository } from "../repositories/user.repo";
import { userToken } from "../utils/types";
import { EventUserRepository } from "../repositories/eventUser.repo";
import mongoose from "mongoose";

interface CreateEventInput {
  event: {
    eventCapacity: number;
    bookedCount: number;
    eventTime: Date;
    bookingClose: Date;
    description: string;
    location?: string;
    meetingLink?: string;
  };
  user: userToken;
}
interface EventReqBody {
  user: userToken;
  id: string;
}

export const eventService = {
  async create({ event, user }: CreateEventInput) {
    if (!user.sub) {
      throw new Error("Unauthorized");
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const existingUser = await UserRepository.findById(user.sub, session);

      if (!existingUser) {
        throw new Error("Unauthorized");
      }

      const createdEvent = await EventRepository.create(
        {
          ...event,
          bookedCount: 0,
        },
        session
      );

      const eventUser = await EventUserRepository.addEvent(
        user.sub,
        createdEvent._id,
        session
      );

      await session.commitTransaction();
      session.endSession();

      return eventUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
  async getById(id: string) {
    const event = await EventRepository.findById(new Types.ObjectId(id));
    if (!event) {
      throw new Error("EventNotFound");
    }

    return event;
  },

  async deleteEvent({ user, id }: EventReqBody) {
    if (!user.sub) {
      throw new Error("Unauthorized");
    }
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const isCreator = await EventUserRepository.hasUserCreatedEvent(
        new Types.ObjectId(user.sub),
        new Types.ObjectId(id)
      );

      if (!isCreator) {
        throw new Error("Forbidden");
      }

      await EventRepository.delete(new Types.ObjectId(id), session);
      const eventUser = await EventUserRepository.removeEvent(
        new Types.ObjectId(user.sub),
        new Types.ObjectId(id),
        session
      );

      await session.commitTransaction();
      session.endSession();
      return eventUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  async joinEvent({ user, id }: EventReqBody) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const joinResult = await EventUserRepository.joinEvent(
        new Types.ObjectId(user.sub),
        new Types.ObjectId(id),
        session
      );

      if (joinResult.matchedCount === 0) {
        throw new Error("User already joined");
      }

      const seatResult = await EventRepository.bookSeat(
        new Types.ObjectId(id),
        session
      );

      if (seatResult.modifiedCount === 0) {
        throw new Error("Event full");
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();

      await EventUserRepository.leaveEvent(
        new Types.ObjectId(user.sub),
        new Types.ObjectId(id)
      );
    }
  },
  async leaveEvent({ user, id }: EventReqBody) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const leaveResult = await EventUserRepository.leaveEvent(
        new Types.ObjectId(user.sub),
        new Types.ObjectId(id),
        session
      );

      if (leaveResult.matchedCount === 0) {
        throw new Error("NotJoined");
      }

      await EventRepository.releaseSeat(new Types.ObjectId(id), session);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },
};
