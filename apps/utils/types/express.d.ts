import { userToken } from "./index";

declare global {
  namespace Express {
    interface Request {
      user?: userToken;
    }
  }
}

export {};
