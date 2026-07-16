import { prisma } from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, context: any){

    const params = await context.params;
    const id = params.id;

    if(!id){
        return NextResponse.json({message: 'Dados em falta!'}, {status: 400});
    }

    const invites = await prisma.invites.findMany({
        where: {invitedUser_id: Number(id)},
        include: {
            invitedBy: {
                select:{
                    first_name: true,
                    last_name: true,
                    tag: true,
                }
            },
            project: {
                select:{
                    title: true,
                }
            }
        }
    })

    return NextResponse.json({invites}, {status: 200});

}