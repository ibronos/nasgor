import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) =>{

    const body = await request.json();

    const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
    });

    if(!user){
        return NextResponse.json(
            { 
                success: false,
                message: "User not found",
            },
            {status: 301}
        );
    }

    const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours
    const expires = new Date().getTime() + EXPIRES_IN;
    const token = uuidv4();
    const resetUrl = request.headers.get('origin') + '/reset-password?token=' + token;
    const emailFrom = "hello@wapres.id";

    let htmlEmail = '<p>Visit this link to reset your password:</p>';
    htmlEmail += '<a href="'+ resetUrl +'">'+ resetUrl +'</a>';

    const userExist = await prisma.password_Reset.findUnique({
        where: {
            user_id: user.id,
        },
    });

    if (userExist) {
        await prisma.password_Reset.update({
            where:{
                user_id: user.id,
            },
            data: {
                token: token,
                expires: expires
            }
        });
    } else {
        await prisma.password_Reset.create({
            data:{
                user_id: user.id,
                token: token,
                expires: expires
            }
        });
    }

    await sendEmail({
        from: emailFrom,
        to: body.email,
        subject: "Reset Password",
        html: htmlEmail,
    });

    return NextResponse.json(
        { 
            success: true,
            message: "Email Sent!",
        }
    );

}
