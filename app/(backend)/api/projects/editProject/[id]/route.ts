import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function PUT(req: NextResponse, context: any) {
    const params = await context.params;
    const id = Number(params.id);
    const res = await req.json();
    const data = res.data;
    const userId = res.userId;

    if (!id) {
        return NextResponse.json({ message: 'Id não fornecido!' }, { status: 400 });
    }

    const project = await prisma.projects.findFirst({
        where: { id: id }
    })

    if (!project) {
        return NextResponse.json({ message: 'Projeto não encontrado!' }, { status: 404 });
    }

    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: userId, project_id: id, permission_id: 4 }
    })

    if (project?.owner_id != userId && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, { status: 400 })
    }


    await prisma.projects.update({
        where: { id: id },
        data: {
            title: data.title ?? undefined,
            description: data.description ?? undefined,
        }
    });

    return NextResponse.json({ message: 'Projeto atualizado!' }, { status: 200 })
}