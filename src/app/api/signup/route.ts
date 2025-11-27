import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request:Request) {
    try{
        const data = await request.json()
        const {name, email, password} = data
        
        if (!name || !email || !password){
            return NextResponse.json({error:"faltan datos"},{status:400});
        }

        //Verificamos si existe el el email
        const userFound = await prisma.users.findUnique({
            where:{
                email: email
            }
        });

        if (userFound){
            return NextResponse.json({error:"el email ya esta registrado"}, {status:409});
        }
        //hasheo de las contraseñas
        const hashedPassword = await bcrypt.hash(password, 10);

        //creación del usuario 
        const newUser = await prisma.users.create({
            data:{
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        
        const {password: _, ...userWithoutPassword} = newUser;
        return NextResponse.json({
            message: "Usuario creado exitosamente",
            user: userWithoutPassword
        }, { status: 201 });

    }catch(error){
        return NextResponse.json({error:"Error al crear su usuario"}, {status:409});

    }
}