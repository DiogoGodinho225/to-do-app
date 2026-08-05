import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function POST(req: NextRequest) {
    const res = await req.json()
    const projectId = res.projectId
    const userId = res.userId
    const data = res.data

    if (!data || !projectId || !userId) {
        return NextResponse.json({ message: 'Dados não fornecidos!' }, { status: 400 });
    }

    const project = await prisma.projects.findFirst({
        where: { id: projectId }
    })

    if (!project) {
        return NextResponse.json({ message: 'Projecto não encontrado!' }, { status: 404 });
    }

    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: userId, project_id: projectId, permission_id: 4 }
    })

    if (project?.owner_id != userId && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, { status: 400 })
    }

    await prisma.tasks.create({
        data: {
            title: data.title,
            description: data.description,
            user_id: Number(data.user_id),        
            project_id: Number(projectId),        
            status_id: Number(data.status_id),    
            priority_id: Number(data.priority_id), 
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        }
    });

    return NextResponse.json({ message: "Tarefa criada!" }, { status: 200 })
}