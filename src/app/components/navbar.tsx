"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4 
      bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800"
    >
      <h1 className="text-xl font-bold text-white">
        Personal Finance Visualizer
      </h1>
      <div className="flex gap-3">
        <Link href="/transactions">
          <Button
            variant="link"
            className="text-white hover:text-gray-200 hover:underline"
          >
            Transactions
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="link"
            className="text-white hover:text-gray-200 hover:underline"
          >
            Expenses
          </Button>
        </Link>
        <Link href="/budgets">
          <Button
            variant="link"
            className="text-white hover:text-gray-200 hover:underline"
          >
            Budgets
          </Button>
        </Link>
        <Link href="/budget-summary">
          <Button
            variant="link"
            className="text-white hover:text-gray-200 hover:underline"
          >
           Insights
          </Button>
        </Link>
      </div>
    </nav>
  );
}
