"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { categories } from "@/constants/categories";
import { Card, CardContent } from "@/components/ui/card";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
};

type MonthlyData = {
  month: string;
  total: number;
};

type CategoryData = {
  name: string;
  value: number;
};

export default function DashboardPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    count: 0,
    topCategory: "",
    latestDate: "",
  });

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        const monthly: Record<string, number> = {};
        const category: Record<string, number> = {};

        let total = 0;
        let latestDate = "";

        data.forEach((t: Transaction) => {
          const month = new Date(t.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          monthly[month] = (monthly[month] || 0) + t.amount;

          category[t.category] = (category[t.category] || 0) + t.amount;

          total += t.amount;

          if (!latestDate || new Date(t.date) > new Date(latestDate)) {
            latestDate = t.date;
          }
        });

        const monthlyChartData = Object.entries(monthly).map(
          ([month, total]) => ({ month, total })
        );

        const categoryChartData = Object.entries(category).map(
          ([name, value]) => ({ name, value })
        );

        const topCategory = Object.entries(category).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] || "N/A";

        setMonthlyData(monthlyChartData);
        setCategoryData(categoryChartData);
        setSummary({
          total,
          count: data.length,
          topCategory,
          latestDate: latestDate
            ? new Date(latestDate).toLocaleDateString()
            : "N/A",
        });
      });
  }, []);

  const COLORS = categories.map((c, i) => {
    if (typeof c === "string") {
      const defaultPalette = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#FF8042",
        "#8dd1e1",
        "#d0ed57",
      ];
      return defaultPalette[i % defaultPalette.length];
    } else {
      return c.color;
    }
  });

  return (
    <main className="w-full min-h-screen p-4">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold mt-1">₹ {summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-lg font-medium mt-1">{summary.topCategory}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-lg font-medium mt-1">{summary.count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Latest Activity</p>
            <p className="text-lg font-medium mt-1">{summary.latestDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Expenses */}
        <Card>
          <CardContent className="p-4 h-80">
            <h2 className="text-lg font-semibold mb-2">
              Monthly Expenses
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardContent className="p-4 h-80">
            <h2 className="text-lg font-semibold mb-2">
              Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
