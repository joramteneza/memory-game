import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anonymousId, score } = body;

    if (!anonymousId || typeof score !== "number") {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    const newScore = await prisma.score.create({
      data: { anonymousId, score },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
