import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(){
    const permissions = await prisma.permissions.findMany()

    return NextResponse.json({permissions}, {status: 200})
}