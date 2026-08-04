import { prisma } from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: any) {

    const params = await context.params;
    const id = Number(params.id)
    const res = await req.json();
    const status = res.status;

    if (!id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 })
    }


    if (Number(status) == 0) {
        await prisma.$transaction(async (tx) => {
            var invite = await tx.invites.findFirst({
                where: { id: id }
            })

            if (!invite) {
                return NextResponse.json({ message: 'Convite não encontrado!' }, { status: 404 })
            }

            const project = await tx.projects.findFirst({
                where: { id: invite.project_id }
            })

            if (!project) {

                tx.invites.delete({
                    where: { id: id, project_id: invite.project_id, invitedUser_id: invite.invitedUser_id }
                })

                return NextResponse.json({ message: 'Convite inválido!' }, { status: 400 })
            }

            invite = await tx.invites.update({
                where: { id: id },
                data: {
                    status: 1,
                    accepted_at: new Date
                }
            })

            await prisma.project_members.create({
                data: { project_id: invite.project_id, user_id: invite.invitedUser_id, role_id: 2, joined_at: new Date() } //bug
            });

        })
    }else{
        await prisma.invites.delete({
            where:{id: id}
        }) //bug

        return NextResponse.json({message: 'Convite recusado!'}, {status: 200});
    }



    return NextResponse.json({ message: 'Convite aceite!' }, { status: 200 });

}