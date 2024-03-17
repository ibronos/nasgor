import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) =>{

    const formData = await request.formData();
    const title: string | null = formData.get('title') as string;
    const slug: string | null = formData.get('slug') as string;
    const content: string | null = formData.get('content') as string;
    const published: string | null = formData.get('published') as string;
    const imageId: string | null = formData.get('imageId') as string;
    const authorId: string | null = formData.get('authorId') as string;
    const categories: string | null = formData.get('categories') as string;

    let dataCat:any[] = [];
    JSON.parse(categories).map((id: any) => {
        dataCat.push({category_id: id});                    
    });

    const post = await prisma.post.create({
        data: {
            title: title,
            slug: slug,
            content: content,
            published: published == "true" ? 1 : 0,
            image_id: imageId ? Number(imageId) : null,
            author_id: Number(authorId),
            categories: {
                createMany: {
                    data: dataCat
                }
            },
        }
    });

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: post
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

    const total = await prisma.post.count();
    const totalPagination = Math.ceil(total/limit);

    const all = await prisma.post.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          published: true
        },
        where:{
            title: {
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