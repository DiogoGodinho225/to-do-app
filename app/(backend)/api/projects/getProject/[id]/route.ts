    import { NextResponse, NextRequest } from "next/server";
    import { prisma } from "@/app/lib/prisma";

    export async function GET(req: NextRequest, context :{params: any}){
        const params = await context.params;
        const id = params.id;

        if(!id){
            return NextResponse.json({message: 'Dados não fornecidos!'}, {status: 400});
        }

        const project = await prisma.projects.findUnique({
            where: {id: Number(id)},
            include: {
                tasks:{
                    include: {subtasks: true},
                },
            },
        });

        if(!project){
            return NextResponse.json({message: 'Projeto não encontrado!'}, {status: 404});
        }

        return NextResponse.json({message: 'Projeto encontrado!', project}, {status:200});
    }