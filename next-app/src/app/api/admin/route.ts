import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user.role as UserRole;

  if (role === UserRole.ADMIN || role === UserRole.OWNER) {
    return new NextResponse(null, {
      status: 200,
    });
  }

  return new NextResponse(null, {
    status: 403,
  });
}
