import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request:NextRequest) {
    const token = request.cookies.get("auth_token");

    if(!token){
        return NextResponse.redirect(new URL("/login", request.url));
    }
    

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token.value, secret);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config={
    matcher:[
        "/reviews/:path*",
        "/add-review/:path*",
        "/api/reviews/:path*"
    ]
}