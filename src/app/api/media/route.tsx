import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from "path";
import { PrismaClient, Media } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  
  return await upload(file);
}

export async function upload(file:File) {
    
    if (!file) {
      return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const rndInt = randomIntFromInterval(100, 999);
    let filename = file.name;
    filename = filename.toLowerCase();

    let fileRename = Date.now().toString() + "_" + rndInt + "-" + filename;
    const pathFile = path.join(process.cwd(), `/public/media/${fileRename}`);

    await writeFile(pathFile, buffer)

    // console.log(`open ${pathFile} to see the uploaded file`);

    const createData = await prisma.media.create({
        data: {
            name: fileRename
        }
    });

    return NextResponse.json({ 
      success: true,
      message: "",
      data: {
          media: createData
      }
    })

}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function getFileByName(name:string) {

    const all = await prisma.media.findFirst({
        where: {
            name: name
        }
    });

    return NextResponse.json({ 
      success: true,
      message: "",
      data: {
          data: all
      }
    });

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

    const total = await prisma.media.count();
    const totalPagination = Math.ceil(total/limit);

    const all = await prisma.media.findMany({
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