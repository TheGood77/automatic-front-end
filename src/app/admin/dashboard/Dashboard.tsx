"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "../../api/users";
import GeneratePDF from "./Components/GeneratePDF";
import UserCreation from "./Components/UserCreation";

export function AdminDashboard() {
  const { error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <UserCreation />
      <GeneratePDF />
    </div>
  );
}
