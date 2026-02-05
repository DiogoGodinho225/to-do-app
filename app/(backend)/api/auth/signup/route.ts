import { NextRequest, NextResponse, userAgent } from "next/server";
import { prisma } from '@/app/lib/prisma';
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

function generateTag(length = 5){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let tag = "#";

    for(let i = 0; i < length; i++){
        tag += chars[Math.floor(Math.random() * chars.length)];
    }

    return tag;
}

export async function POST(req: NextRequest){
    try{
        const {first_name, last_name, email, password} = await req.json();

        if(!first_name || !last_name || !email || !password){
            return NextResponse.json({message: 'Campos obrigatórios em falta!'}, {status: 400});
        }
        
        const existingUser = await prisma.users.findUnique({
            where: {email}
        })

        if(existingUser){
            return NextResponse.json({message: 'Email já registado!'}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const tag = generateTag();
        const lastLogin = new Date();

        const user = await prisma.users.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash: hashedPassword,
                tag,
                last_login: lastLogin,
                status: 0,
            }
        })

        return NextResponse.json({message: 'Utilizador registado com sucesso!', userId: user.id}, {status: 200});

    }catch(error){
        console.log(error);
        return NextResponse.json({message: 'Internal server error.'}, {status: 500});
    }
}