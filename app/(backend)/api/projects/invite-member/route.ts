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

    const project = await prisma.projects.findFirst({
        where: {id: project_id}
    })

    const permission = await prisma.member_permissions.findFirst({
        where: {user_id: invitedBy_id, project_id: project_id, permission_id: 1}
    })

    if(project?.owner_id != invitedBy_id && !permission){
        return NextResponse.json({message: "Não tem permissão!"}, {status: 200})
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