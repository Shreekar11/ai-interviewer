import UserRepository from "@/repository/user.repo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { data } = await req.json();
  const userRepository = new UserRepository();

  try {
    const userData = await userRepository.getUserByEmail(data.email);
    if (userData) {
      return NextResponse.json(
        {
          status: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }
    const createUserRepsonse = await userRepository.create(data);
    return NextResponse.json(
      {
        status: true,
        message: "User created successfully",
        data: createUserRepsonse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user", error);
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userRepository = new UserRepository();

  try {
    const userData = await userRepository.get(id || "");
    if (!userData) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "User retrieved successfully",
        data: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retreiving user", error);
  }
}
