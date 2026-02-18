import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/app/lib/prisma'


export async function GET(req:NextRequest, context:{params: any}){
    const params = await context.params;
    const id = Number(params.id);

    if(!id){
        return NextResponse.json({message: 'Dados em falta!'}, {status:400});
    }

    const projects = await prisma.projects.findMany({
        where:{owner_id:id}
    })

    return NextResponse.json({projects});
}