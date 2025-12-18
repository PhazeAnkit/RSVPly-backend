import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repo";
import { generateAccessToken } from "../utils/jwt";

const salt = 10;

type RegisterInput = {
  userName: string;
  email: string;
  password: string;
  Location: string;
  contactNumber: string;
};

type LoginInput = {
  email: string;
  password: string;
};

async function createNewToken(id: string, email: string) {
  const accessToken = generateAccessToken(id, email);

  return {
    user: { id, email },
    accessToken,
  };
}

export const authService = {
  async register(data: RegisterInput) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await UserRepository.create({
      userName: data.userName,
      email,
      password: hashedPassword,
      Location: data.Location,
      contactNumber: data.contactNumber,
    });

    return {
      id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      Location: user.Location,
      contactNumber: user.contactNumber,
    };
  },

  async login(data: LoginInput) {
    const email = data.email.trim().toLowerCase();

    const user = await UserRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordCheck = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!passwordCheck) {
      throw new Error("Invalid credentials");
    }

    return await createNewToken(user._id.toString(), user.email);
  },
};
