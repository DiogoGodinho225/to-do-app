import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(req: NextRequest, context: { params: any }) {
    const params = await context.params;
    const res = await req.json();
    const projectId = Number(params.id);
    const userId = Number(params.userId);
    const id = res.id //id do user que faz a remoção

    if (!projectId || !userId || !id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }

    const project = await prisma.projects.findFirst({
        where: { id: projectId }
    })


    const permission = await prisma.member_permissions.findFirst({
        where: { user_id: id, project_id: projectId, permission_id: 3 }
    })

    if (project?.owner_id != id && !permission) {
        return NextResponse.json({ message: "Não tem permissão!" }, {status: 400})
    }

    await prisma.$transaction(async (tx) => {
        await tx.member_permissions.deleteMany({
            where: { project_id: projectId, user_id: userId }
        })

        await tx.project_members.delete({
            where: {
                project_id_user_id: {
                    project_id: projectId,
                    user_id: userId,
                },
            }
        })
    })

    return NextResponse.json({ message: "Membro removido!" }, {status: 200})
}