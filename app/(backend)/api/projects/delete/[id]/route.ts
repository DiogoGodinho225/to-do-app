import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: NextRequest, context: { params: any }) {

    const params = await context.params;
    const id = Number(params.id);
    const res = await req.json();


    if (!id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }

    const project = await prisma.projects.findFirst({
        where: { id: id }
    })

    if (res.userId == project?.owner_id) {
        await prisma.$transaction(async (tx) => {
            await tx.invites.deleteMany({
                where: { project_id: id }
            })

            await tx.project_members.deleteMany({
                where: { project_id: id }
            })

            await tx.member_permissions.deleteMany({
                where: { project_id: id }
            })

            await tx.subtasks.deleteMany({
                where: {
                    task: {
                        project_id: id
                    }
                }
            });


            await tx.tasks.deleteMany({
                where: { project_id: id }
            });

            await tx.projects.delete({
                where: { id: id }
            })

        })
    } else {
        await prisma.$transaction(async (tx) => {
            await tx.invites.deleteMany({
                where: { project_id: id, invitedUser: res.userId }
            })

            await tx.project_members.deleteMany({
                where: { project_id: id,  user_id: res.userId}
            })

            await tx.member_permissions.deleteMany({
                where: { project_id: id, user_id: res.userId }
            })

            await tx.tasks.updateMany({
                where: {user_id: res.userId},
                data:{
                    user_id: project?.owner_id
                }
            })
        })
    }



    return NextResponse.json({ message: 'Projeto eliminado!' }, { status: 200 });
}