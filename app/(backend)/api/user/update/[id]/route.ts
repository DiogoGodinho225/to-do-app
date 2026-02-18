import { NextResponse, NextRequest } from "next/server";
import { prisma } from '@/app/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';


export async function PUT(req: NextRequest, context: { params: any; }) {

    const params = await context.params;
    const id = params.id;

    if (!id) {
        return NextResponse.json({ message: 'Id não fornecido!' }, { status: 400 });
    }

    var user = await prisma.users.findUnique({
        where: { id: Number(id) }
    })

    if (!user) {
        return NextResponse.json({ message: 'Utilizador não encontrado!' }, { status: 404 });
    }

    const formData = await req.formData()
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const image = formData.get('image') as File | null;
    const lastLogin = formData.get('last_login');
    const status = formData.get('status');

    let imageUrl: string | undefined;

    if (image && image instanceof File && image.size > 0) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        await fs.mkdir(uploadDir, { recursive: true });

        const oldImageUrl = user.image_url;

        if (oldImageUrl) {
            const oldPath = path.join(process.cwd(), 'public', oldImageUrl);
            await fs.unlink(oldPath).catch(() => { });
        }

        const fileName = `${Date.now()}-${user.last_name}.png`;
        const filePath = path.join(uploadDir, fileName);

        const arrayBuffer = await image.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));


        imageUrl = `/uploads/${fileName}`;
    }

    await prisma.users.update({
        where: { id: Number(id) },
        data: {
            first_name: firstName?.toString() ?? undefined,
            last_name: lastName?.toString() ?? undefined,
            email: email?.toString() ?? undefined,
            image_url: imageUrl?.toString() ?? undefined,
            status: Number(status) ?? undefined,
            last_login: lastLogin ? new Date(lastLogin as string) : undefined,
        }
    })

    return NextResponse.json({ message: 'Utilizador atualizado!'});

} 