import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
    try{
        const reviews = await prisma.reviews.findMany({
            include:{
                users:{
                    select:{name: true}
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        });

        return NextResponse.json(reviews);
    }catch(error){
        return NextResponse.json({error: "Error al obtener reseñas"}, {status:500});
    }
}

export async function POST(request:Request) {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if(!token){
            return NextResponse.json({error:"No autorizado"}, {status:401});
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const data = await request.json();
        const {bookTitle, review, rating, mood} = data;
        console.log(mood)
        if(!bookTitle || !review || !rating || !mood){
            return NextResponse.json({error:"Faltan datos"},{status:400});
        }
        const newReview = await prisma.reviews.create({
            data: {
                bookTitle: bookTitle,
                rating: rating,
                mood: mood,
                users:{
                    connect:{id:userId}
                },  
                review:review,
            }
        });
        return NextResponse.json(newReview,{status:201});
    }catch(error){
        return NextResponse.json({error:"Error al crear la reseña"}, {status:500});
    }
}