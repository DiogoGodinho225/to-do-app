import { prisma } from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: any) {

    const params = await context.params;
    const id = params.id;

    if (!id) {
        NextResponse.json({ message: 'Dados em falta!' }, { status: 400 })
    }


    await prisma.$transaction(async (tx) => {

        const invite = await tx.invites.update({
            where: { id: id },
            data: {
                status: 1,
                accepted_at: Date.now().toString()
            }
        })

        await prisma.project_members.create({
            data: { project_id: invite.project_id, user_id: invite.invitedUser_id, role_id: 2, joined_at: new Date() }
        });

    })


    NextResponse.json({ message: 'Convite aceite!' }, { status: 200 });

}