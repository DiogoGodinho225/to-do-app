import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest){
    const response = await req.json();
    const permissions = response.memberPermissions;
    const {userId, projectId, id} = response;

    if(!permissions){
        return NextResponse.json({message: "Dados em falta!"}, {status: 400})
    }

    const project = await prisma.projects.findFirst({
        where: {id: projectId}
    })

    const permission = await prisma.member_permissions.findFirst({
        where: {user_id: id, project_id: projectId, permission_id: 5}
    })

    if(project?.owner_id != id && !permission){
        return NextResponse.json({message: "Não tem permissão!"}, {status: 400})
    }

    if(permissions.length > 0){

        await prisma.$transaction(async (tx) => {

            await tx.member_permissions.deleteMany({
                where:{user_id: userId, project_id: projectId}
            })

            await tx.member_permissions.createMany({
                data:permissions.map((p:any)=>({
                    user_id: p.user_id,
                    project_id: p.project_id,
                    permission_id: p.permission_id
                }))
            })
        })

        return NextResponse.json({message: "Permissões atualizadas!"}, {status: 200})
    }

    await prisma.member_permissions.deleteMany({
        where:{user_id: userId, project_id: projectId}
    })
 
    return NextResponse.json({message: "Permissões atualizadas!"}, {status: 200})
}