import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reviewId = id;

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const reviewToDelete = await prisma.reviews.findUnique({
            where: { id: reviewId }
        });

        if (!reviewToDelete) {
            return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
        }

        if (reviewToDelete.userId !== userId) {
            return NextResponse.json({ error: "No eres el dueño de esta reseña" }, { status: 403 });
        }
        await prisma.reviews.delete({
            where: { id: reviewId }
        });

        return NextResponse.json({ message: "Eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar:", error);
        return NextResponse.json({ error: "Error interno al eliminar" }, { status: 500 });
    }
}