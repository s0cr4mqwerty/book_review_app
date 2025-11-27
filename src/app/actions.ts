"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

//Obtener mi ID desde el token 
export async function getMyUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.id as string;
    } catch (error) {
        return null;
    }
}
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    redirect("/login");
}