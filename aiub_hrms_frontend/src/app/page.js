import { redirect } from "next/navigation";

export default function RootPage() {
  // Middleware handles auth checks. 
  // We simply redirect the root path to the dashboard.
  redirect("/dashboard");
}
