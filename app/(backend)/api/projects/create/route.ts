import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {

    const { title, description, owner_id } = await req.json();

    if (!title || !owner_id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }

    if (title.lenght > 60) {
        NextResponse.json({ message: 'Título excede o tamanho!' }, { status: 400 });
    }

    await prisma.$transaction(async (prisma) => {
        const project = await prisma.projects.create({
            data: { title, description, owner_id }
        });

        await prisma.project_members.create({
            data: { project_id: project.id, user_id: owner_id, role_id: 1, joined_at: new Date()}
        });
    });


    return NextResponse.json({ message: 'Novo projeto criado!' }, { status: 200 });

}