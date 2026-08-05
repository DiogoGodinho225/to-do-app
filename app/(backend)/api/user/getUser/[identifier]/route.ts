import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: { params: any }) {
    const params = await context.params;
    const identifier = String(params.identifier)

    if (!identifier) {
        return NextResponse.json({ message: 'Dados em falta!' }, { status: 400 });
    }

    let user;

    if (identifier[0] == '#') {
        user = await prisma.users.findUnique({
            where: { tag: identifier }, 
            select: {
                   
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    tag: true,
                    image_url: true,
                    status: true,
                    last_login: true,
                },
        },

        );
    } else {
        user = await prisma.users.findUnique({
            where: { id: Number(identifier) }
        });
    }

    if (!user) {
        return NextResponse.json({ message: 'Utilizador não encontrado!' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Utilizador encontrado!', user }, { status: 200 });
}