import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const PATCH = async (request: NextRequest, {params}: {params: {id: string}}) => {
 
    const formData = await request.formData();
    const email: string | null = formData.get('email') as string;
    const name: string | null = formData.get('name') as string;
    const password: string | null = formData.get('password') as string;
    const imageId: string | number | null = formData.get('imageId') as string;
    let passUpdate;

    if( password && password != "" ){
        passUpdate = await bcrypt.hash(password, Number(process.env.PASSWORD_HASH));
    } else {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(params.id)
            }
        });

        passUpdate = user?.password;
    }

    const all = await prisma.user.update({
        where:{
            id: Number(params.id)
        },
        data: {
            name: name,
            email: email,
            password: passUpdate,
            image_id: imageId && Number (imageId) !== 0 ? Number (imageId) : null
        }
    });

     return NextResponse.json(
        { 
            success: true,
            message: "",
            data: all
        }
    );
}

export const DELETE = async (request: NextRequest, {params}: {params: {id: string}}) =>{
    const all = await prisma.user.delete({
        where:{
            id: Number(params.id)
        }
    });

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: all
        }
    );
}

export const GET = async (request: NextRequest, {params}: {params: {id: string}}) => {

    const {id} = params;

    const all = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }
    });

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: all
        }
    );
}