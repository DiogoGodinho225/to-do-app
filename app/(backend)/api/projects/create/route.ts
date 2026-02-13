import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/app/lib/prisma';

export async function POST(req: NextRequest){

    const {title, description, owner_id} = await req.json();

    if(!title || !owner_id){
        return NextResponse.json({message: 'Dados em falta!'}, {status: 400});
    }

    if(title.lenght > 60){
        NextResponse.json({message: 'Título excede o tamanho!'}, {status: 400});
    }

    await prisma.projects.create({
        data:{
            description: description,
            owner_id: owner_id,
            title: title,
        }
    })

    return NextResponse.json({message: 'Novo projeto criado!'}, {status:200});

}