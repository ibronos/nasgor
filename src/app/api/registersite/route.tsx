import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const totalUser = await prisma.user.count();

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: {
                totalUser: totalUser
            }
        }
    );
}

export const POST = async (request: NextRequest) =>{

    const totalUser = await prisma.user.count();

    if(totalUser > 0) {
        return NextResponse.json(
            { 
                success: false,
                message: "user found!",
                data: {}
            },
            {status: 301}
        );
    }

      
    const body = await request.json();
    const all = await prisma.user.create({
        data:{
            email: body.email,
            name: body.name,
            password: await bcrypt.hash(body.password, Number(process.env.PASSWORD_HASH)),
        }
    });

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: {}
        }
    );

}