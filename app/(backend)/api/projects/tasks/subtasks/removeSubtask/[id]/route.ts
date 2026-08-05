import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function DELETE(req: NextRequest, context: any) {
    const params = await context.params;
    const id = Number(params.id)
    const res = await req.json()

    if (!id) {
        return NextResponse.json({ message: "Dados em falta!" }, { status: 400 })
    }

    const task = await prisma.tasks.findFirst({
        where: { id: res.taskId }
    })

    if(!task){
        return NextResponse.json({ message: "Tarefa não encontrada!" }, { status: 404 })
    }

    const project = await prisma.projects.findFirst({
        where:{id: task.project_id}
    })

    if(!project){
        return NextResponse.json({ message: "Projeto não encontrado!" }, { status: 404 })
    }

    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: res.userId, project_id: project.id, permission_id: 4 }
    })

    if (project?.owner_id != res.userId && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, { status: 400 })
    }


    await prisma.subtasks.delete({
        where: {id: id}
    })

    return NextResponse.json({ message: "Subtarefa removida!" }, { status: 200 })
}