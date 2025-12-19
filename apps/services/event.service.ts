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

class ServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
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

  async getAll() {
  const events = await EventRepository.findAll();
  return events;
},


  async joinEvent({ user, id }: EventReqBody) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = new Types.ObjectId(user.sub);
      const eventId = new Types.ObjectId(id);

      const isCreator = await EventUserRepository.hasUserCreatedEvent(
        userId,
        eventId
      );

      if (isCreator) {
        throw new ServiceError(
          "Event creator cannot join their own event",
          403
        );
      }

      await EventUserRepository.createIfNotExists(userId, session);

      const joinResult = await EventUserRepository.joinEvent(
        userId,
        eventId,
        session
      );

      if (joinResult.matchedCount === 0) {
        throw new ServiceError("User already joined", 409);
      }

      const seatResult = await EventRepository.bookSeat(eventId, session);

      if (seatResult.modifiedCount === 0) {
        throw new ServiceError("Event full", 409);
      }

      await session.commitTransaction();
    } catch (err: any) {
      await session.abortTransaction();

      if (err instanceof ServiceError) throw err;

      throw new ServiceError("Internal server error", 500);
    } finally {
      session.endSession();
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
        throw new ServiceError("NotJoined", 409);
      }

      await EventRepository.releaseSeat(new Types.ObjectId(id), session);
      await session.commitTransaction();
    } catch (err: any) {
      await session.abortTransaction();

      if (err instanceof ServiceError) throw err;

      if (err.name === "CastError") {
        throw new ServiceError("Invalid Event Id", 400);
      }

      throw new ServiceError("Internal server error", 500);
    } finally {
      session.endSession();
    }
  },
};
