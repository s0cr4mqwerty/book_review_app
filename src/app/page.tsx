import { redirect } from "next/navigation";

export default function Home() {
  redirect("/reviews"); // El middleware se encargará de mandarlo al login si no tiene sesión
}