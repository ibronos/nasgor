import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Post_Category } from "@prisma/client";

const prisma = new PrismaClient();

export const PATCH = async (request: NextRequest, {params}: {params: {id: string}}) =>{
 
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

    const deleteOldCat = await prisma.categories_On_Posts.deleteMany({
        where: {
            post_id: Number(params.id)
        },
    });

    const post = await prisma.post.update({
        where:{
            id: Number(params.id)
        },
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

export const DELETE = async (request: NextRequest, {params}: {params: {id: string}}) =>{
    const all = await prisma.post.delete({
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

    const all = await prisma.post.findFirst({
        where:{
            id: Number(params.id)
        },
        include: {
          categories: true,
        },
      })

    return NextResponse.json(
        { 
            success: true,
            message: "",
            data: all
        }
    );
}