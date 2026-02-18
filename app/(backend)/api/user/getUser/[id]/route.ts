import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context : {params:any}){
    const params = await context.params;
    const id = Number(params.id);

    if(!id){
        return NextResponse.json({message: 'Dados em falta!'}, {status: 400});
    }

    const user = await prisma.users.findUnique({
        where: {id:id}
    });

    if(!user){
        return NextResponse.json({message: 'Utilizador não encontrado!'}, {status: 404});
    }


    return NextResponse.json({message: 'Utilizador encontrado!', user}, {status: 200});
}