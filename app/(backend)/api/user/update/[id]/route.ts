import { NextResponse, NextRequest } from "next/server";
import {prisma} from '@/app/lib/prisma';

export async function PUT(req: NextRequest, context: { params: any; }){

    const params = await context.params;
    const id = params.id;

    if(!id){
        return NextResponse.json({message: 'Id não fornecido!'}, {status: 400});
    }

    const user = await prisma.users.findUnique({
        where: {id: Number(id)}
    })

    if(!user){
       return NextResponse.json({message: 'Utilizador não encontrado!'}, {status: 404});
    }

    const formData = await req.formData()
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const imageUrl = formData.get('image_url');
    const lastLogin = formData.get('last_login');
    const status = formData.get('status');

    await prisma.users.update({
        where: {id: Number(id)},
        data: {
            first_name: firstName?.toString() ?? undefined,
            last_name: lastName?.toString() ?? undefined,
            email: email?.toString() ?? undefined,
            image_url: imageUrl?.toString() ?? undefined,
            status: Number(status) ?? undefined,
            last_login: lastLogin ? new Date(lastLogin as string) : undefined,
        }
    })

    return NextResponse.json({message: 'Utilizador atualizado!'});

} 