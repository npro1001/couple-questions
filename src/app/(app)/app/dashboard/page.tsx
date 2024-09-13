import DashboardCard from "@/components/dashboard-card";
import Header from "@/components/dashboard-header";
import React from "react";

export default function DashboardPage() {
  return (
    <main className="flex flex-col">
      <div className="h-[200px]" />
      <div className="flex flex-col items-center min-h-full ">
        <DashboardCard />
      </div>
    </main>
  );
}
