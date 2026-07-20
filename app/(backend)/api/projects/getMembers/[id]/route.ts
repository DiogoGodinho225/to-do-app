import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: any }) {

    const params = await context.params;
    const id = Number(params.id);

    if (!id) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }

    const project_members = await prisma.project_members.findMany({
        where: { project_id: id },
        include: {
            user: {
                select: {
                   
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    tag: true,
                    image_url: true,
                    status: true,
                    last_login: true,
                   
                    member_permissions: {
                        where:{project_id: id}
                    }
                },
            },
            role: true
        },
    },
    );

    return NextResponse.json({ message: 'Membros do projeto!', project_members: project_members }, { status: 200 });

}