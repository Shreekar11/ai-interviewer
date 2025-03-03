import { User } from "@prisma/client";
import Repository from "./base.repo";

export default class UserRepository extends Repository<User> {
  constructor() {
    super("user");
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const userData = this.model.findFirst({
      where: {
        email,
      },
    });

    return userData;
  }
}
