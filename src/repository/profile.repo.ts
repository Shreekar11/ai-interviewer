import { Profile } from "@prisma/client";
import Repository from "./base.repo";

export default class ProfileRepository extends Repository<Profile> {
    constructor() {
        super("profile");
    }

    public async getProfileByUserId(userId: string): Promise<Profile | null> {
        const profileData = await this.model.findFirst({
            where: {
                fkUserId: userId,
            }
        });

        return profileData;
    }
}