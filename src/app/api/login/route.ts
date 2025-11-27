import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { error } from "node:console";

export async function POST(request:Request) {
    try{
        const data = await request.json();
        const {email, password} = data

        if(!email || !password){
            return NextResponse.json({error: "Faltan datos"}, {status: 400});
        }

        //busqueda por usuario
        const userFound = await prisma.users.findUnique({
            where:{
                email: email
            }
        });

        if (!userFound){
            return NextResponse.json({error:"Credenciale no validas"}, {status: 401});
        }

        //comparacion de contraseñas
        const passwordMatched = await bcrypt.compare(password, userFound.password);
        if(!passwordMatched){
            return NextResponse.json({error:"Credenciales invalidas"}, {status:401});
        }

        //jwt con jose
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({id:userFound.id, email:userFound.email})
            .setProtectedHeader({ alg: "HS256"})
            .setExpirationTime("1h")
            .sign(secret);

        //HttpOnly guardado
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
        });

        return NextResponse.json({
            message:"login exitoso",
            user:{id: userFound.id, name: userFound.name, email: userFound.email}
        });
    }catch(error){
        return NextResponse.json({error:"Error en el login"}, {status: 500});
    }
}