import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function PUT(req: NextRequest, context: any) {
    const params = await context.params;
    const id = Number(params.id);
    const res = await req.json();
    const data = res.data;
    const userId = res.userId;
    const projectId = res.projectId

    if (!id) {
        return NextResponse.json({ message: 'Id não fornecido!' }, { status: 400 });
    }

    const project = await prisma.projects.findFirst({
        where: { id: projectId }
    })

    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: userId, project_id: projectId, permission_id: 4 }
    })

    if (project?.owner_id != userId && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, { status: 400 })
    }

    const task = await prisma.tasks.findUnique({
        where: { id: Number(id) }
    })

    if (!task) {
        return NextResponse.json({ message: 'Tarefa não encontrada!' }, { status: 404 });
    }

    await prisma.tasks.update({
        where: { id: id },
        data: {
            title: data.title ?? undefined,
            description: data.description ?? undefined,
            user_id: data.user_id !== undefined ? Number(data.user_id) : undefined,
            priority_id: data.priority_id !== undefined ? Number(data.priority_id) : undefined,
            status_id: data.status_id !== undefined ? Number(data.status_id) : undefined,

            dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
        }
    });

    return NextResponse.json({ message: 'Tarefa atualizada!' }, { status: 200 })
}