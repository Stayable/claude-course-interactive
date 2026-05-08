import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const body = (await req.json().catch(() => null)) as
    | { courseId?: string; lessonId?: string; completed?: boolean }
    | null;
  if (!body?.courseId || !body?.lessonId) {
    return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400 });
  }
  await prisma.progress.upsert({
    where: {
      userId_courseId_lessonId: {
        userId: session.user.id,
        courseId: body.courseId,
        lessonId: body.lessonId,
      },
    },
    create: {
      userId: session.user.id,
      courseId: body.courseId,
      lessonId: body.lessonId,
      completed: body.completed ?? true,
    },
    update: { completed: body.completed ?? true, updatedAt: new Date() },
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ items: [] }), { status: 200 });
  }
  const items = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
