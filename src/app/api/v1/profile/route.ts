import ProfileRepository from "@/repository/profile.repo";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const handleError = (error: unknown, operation: string) => {
  console.error(`Error ${operation} profile:`, error);
  return NextResponse.json(
    {
      status: false,
      message: `An error occurred while ${operation} the profile.`,
    },
    { status: 500 }
  );
};

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const { data } = await req.json();

    if (!data || !data.userId) {
      return NextResponse.json(
        {
          status: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const profileRepository = new ProfileRepository();

    const profileData = await profileRepository.getProfileByUserId(data.userId);

    if (profileData) {
      return NextResponse.json(
        {
          status: false,
          message: "Profile already exists with this userId",
        },
        { status: 400 }
      );
    }

    const newProfile = await prisma.$transaction(async (tx) => {
      const createdProfile = await tx.profile.create({
        data: {
          fkUserId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          aboutMe: data.aboutMe,
        },
      });

      if (data.experience && Array.isArray(data.experience)) {
        await Promise.all(
          data.experience.map(
            (exp: {
              company: string;
              position: string;
              description: string;
              startDate: Date;
              endDate: Date;
            }) =>
              tx.experience.create({
                data: {
                  fkProfileId: createdProfile.id,
                  company: exp.company,
                  position: exp.position,
                  description: exp.description,
                  startDate: new Date(exp.startDate),
                  endDate: new Date(exp.endDate),
                },
              })
          )
        );
      }

      if (data.projects && Array.isArray(data.projects)) {
        await Promise.all(
          data.projects.map(
            (project: {
              projectName: string;
              description: string;
              startDate: Date;
              endDate: Date;
            }) =>
              tx.project.create({
                data: {
                  fkProfileId: createdProfile.id,
                  projectName: project.projectName,
                  description: project.description,
                  startDate: new Date(project.startDate),
                  endDate: new Date(project.endDate),
                },
              })
          )
        );
      }

      if (data.skills && Array.isArray(data.skills)) {
        await Promise.all(
          data.skills.map((skill: { skillName: string; description: string }) =>
            tx.skill.create({
              data: {
                fkProfileId: createdProfile.id,
                skillName: skill.skillName,
                description: skill.description,
              },
            })
          )
        );
      }

      return tx.profile.findUnique({
        where: { id: createdProfile.id },
        include: {
          experience: true,
          projects: true,
          skills: true,
        },
      });
    });

    await prisma.$disconnect();

    return NextResponse.json(
      {
        status: true,
        message: "Profile created successfully!",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    await prisma.$disconnect();
    return handleError(error, "creating");
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          status: false,
          message: "userId parameter is required",
        },
        { status: 400 }
      );
    }

    const profileRepository = new ProfileRepository();
    const profileData = await profileRepository.getProfileByUserId(userId);

    if (!profileData) {
      return NextResponse.json(
        {
          status: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Profile retrieved successfully!",
        data: profileData,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "retrieving");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!data || !data.userId) {
      return NextResponse.json(
        {
          status: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const profileRepository = new ProfileRepository();
    const profileData = await profileRepository.getProfileByUserId(data.userId);

    if (!profileData) {
      return NextResponse.json(
        {
          status: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    const updateProfile = await profileRepository.patch(profileData.id, data);

    return NextResponse.json(
      {
        status: true,
        message: "Profile updated successfully!",
        data: updateProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "updating");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          status: false,
          message: "userId parameter is required",
        },
        { status: 400 }
      );
    }

    const profileRepository = new ProfileRepository();
    const profileData = await profileRepository.getProfileByUserId(userId);

    if (!profileData) {
      return NextResponse.json(
        {
          status: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    await profileRepository.delete(profileData.id);

    return NextResponse.json(
      {
        status: true,
        message: "Profile deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "deleting");
  }
}
