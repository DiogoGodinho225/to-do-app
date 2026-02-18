import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: NextRequest, context: { params: any }) {

    const params = await context.params;
    const id = Number(params.id);


    if (!id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }


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
            where:{id:id}
        })
    })


    return NextResponse.json({message: 'Projeto eliminado!'}, {status:200});
}