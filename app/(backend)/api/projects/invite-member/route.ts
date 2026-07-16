import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest){

    const res = await req.json();
    const {tag, invitedBy_id, description, project_id} = res.data;


    if(!tag || !invitedBy_id || !description || !project_id){
        return NextResponse.json({message: 'Dados em falta!'}, {status: 400});
    }

    const invitedUser = await prisma.users.findUnique({
        where: {tag: tag}
    })

    if(!invitedUser || invitedUser.id == invitedBy_id){
        return NextResponse.json({message: 'Utilizador inválido!'}, {status: 400});
    }

    await prisma.invites.create({
        data: {
            project_id: Number(project_id),
            invitedBy_id: invitedBy_id,
            invitedUser_id: invitedUser.id,
            description: description,
            status: 0,
            accepted_at: new Date(0),
        }
    })

    return NextResponse.json({message: 'Convite enviado!'}, {status: 200});
    
}