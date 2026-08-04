import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function DELETE(req: NextRequest, context: any) {
    const params = await context.params;
    const id = Number(params.id)
    const res = await req.json()

    if (!id) {
        return NextResponse.json({ message: "Dados em falta!" }, { status: 400 })
    }

    const project = await prisma.projects.findFirst({
        where: { id: res.projectId }
    })

    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: res.userId, project_id: res.projectId, permission_id: 4 }
    })

    if (project?.owner_id != res.userId && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, { status: 400 })
    }


    await prisma.$transaction(async (tx) => {

        await tx.subtasks.deleteMany({
            where:{task_id:id}
        })

        await tx.tasks.delete({
            where: { id: id },
            
        })
    })

    return NextResponse.json({ message: "Tarefa removida!" }, { status: 200 })
}