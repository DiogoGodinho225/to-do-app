import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest){

    const data = await req.json();

    const {invitedUser_Id, invitedBy_Id, description, project_id} = data;

    if(!invitedUser_Id || !invitedBy_Id || !description || !project_id){
        return NextResponse.json({message: 'Dados em falta!'}, {status: 400});
    }

    await prisma.invites.create({
        data: {
            project_id: project_id,
            invitedBy_id: invitedBy_Id,
            invitedUser_id: invitedUser_Id,
            description: description,
            status: 0,
            accepted_at: '',
        }
    })

    return NextResponse.json({message: 'Convite enviado!'}, {status: 200});
    
}