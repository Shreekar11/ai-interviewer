import { IRepository } from "@/types/repo";
import { PrismaClient } from "@prisma/client";

export default class Repository<T extends any> implements IRepository<T> {
  private prisma: PrismaClient;
  private modelName: string;

  constructor(modelName: string) {
    this.prisma = new PrismaClient();
    this.modelName = modelName;
  }

  public get model() {
    return (this.prisma as any)[this.modelName];
  }

  public async get(id: string): Promise<T | null> {
    const data = await this.model.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  public async create(data: Omit<T, "id">): Promise<T> {
    const createData = await this.model.create({
      data,
    });

    return createData;
  }

  public async patch(
    id: string,
    data: Partial<Omit<T, "id">>
  ): Promise<T | null> {
    const updateData = await this.model.update({
      where: {
        id,
      },
      data,
    });

    return updateData;
  }

  public async delete(id: string): Promise<T | null> {
    const deleteData = await this.model.delete({
      where: {
        id,
      },
    });

    return deleteData;
  }
}
