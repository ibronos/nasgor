import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) =>{

    const formData = await request.formData();
    const email: string | null = formData.get('email') as string;
    const name: string | null = formData.get('name') as string;
    const password: string | null = formData.get('password') as string;
    const imageId: string | number | null = formData.get('imageId') as string;

    const all = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: await bcrypt.hash(password, Number(process.env.PASSWORD_HASH)),
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

export const GET = async (request: NextRequest) => {

    const search = new URL(request.url).search;
    const urlParams = new URLSearchParams(search);
    const pageParams = urlParams.get("page");
    const limitParams = urlParams.get("limit");
    const searchParams = urlParams.get("search");

    const page = pageParams ? parseInt( pageParams ) : 1;
    const limit = limitParams ? parseInt( limitParams ) : 10;
    const searchVal = searchParams ? searchParams : "";
    const skip = (page - 1) * limit;

    const total = await prisma.user.count();
    const totalPagination = Math.ceil(total/limit);

    const all = await prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true
        },
        where:{
            name: {
                contains: searchVal,
            },
        },
    });

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: all,
            totalData: total,
            page: page,
            totalPagination: totalPagination,
            limit: limit
        }
    );
}