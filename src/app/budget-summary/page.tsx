"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BudgetSummary = {
  category: string;
  budget: number;
  actualSpent: number;
  status: string;
  diffPercent?: number;
  barColor?: string;
}

export default function BudgetSummaryPage() {
  const [month, setMonth] = useState("Jul-2025");
  const [data, setData] = useState<BudgetSummary[]>([]);
  const [insights, setInsights] = useState<
    { text: string; type: "over" | "under" }[]
  >([]);

  const fetchSummary = useCallback(async () => {
    const res = await fetch(`/api/budget-summary?month=${month}`);
    const result = await res.json();

    const updated = result.map((item: BudgetSummary) => {
      const budgetNum = Number(item.budget) || 0;
      const actualNum = Number(item.actualSpent) || 0;

      const diff =
        budgetNum === 0
          ? 0
          : ((actualNum - budgetNum) / budgetNum) * 100;

      return {
        ...item,
        diffPercent: diff.toFixed(1),
        barColor: item.status === "Over" ? "#ff6b6b" : "#4caf50",
      };
    });

    setData(updated);

    // Generate structured insights
    const insightsArray: { text: string; type: "over" | "under" }[] = [];
    updated.forEach((item: BudgetSummary) => {
      const budgetNum = Number(item.budget) || 0;
      const actualNum = Number(item.actualSpent) || 0;
      const diffPercent = Number(item.diffPercent);

      if (item.status === "Over") {
        insightsArray.push({
          text: `You spent ₹${actualNum} on ${item.category}, which is ${diffPercent}% OVER your budget of ₹${budgetNum}.`,
          type: "over",
        });
      } else {
        insightsArray.push({
          text: `Good job! You spent ₹${actualNum} on ${item.category}, which is ${Math.abs(diffPercent)}% UNDER your budget of ₹${budgetNum}.`,
          type: "under",
        });
      }
    });

    setInsights(insightsArray);
  }, [month]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <main className="w-full min-h-screen p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchSummary();
        }}
        className="flex gap-2 mb-6"
      >
        <Input
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Enter month e.g. Jul-2025"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-red-500 to-red-700 text-white"
        >
          Fetch
        </Button>
      </form>

      {data.length === 0 ? (
        <p>No data found for {month}.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [`₹${value}`, name]}
              />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget">
                <LabelList
                  dataKey="budget"
                  position="top"
                  formatter={(val) => `₹${val}`}
                />
              </Bar>
              <Bar
                dataKey="actualSpent"
                name="Actual Spent"
                fill="#4caf50"
              >
                <LabelList
                  dataKey="diffPercent"
                  content={({ x, y, value }) => {
                    if (value == null) return null;

                    const safeY = typeof y === "number" ? y - 10 : 0;

                    return (
                      <text
                        x={x}
                        y={safeY}
                        textAnchor="middle"
                        fill="#333"
                        fontSize={12}
                      >
                        {`${value}%`}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Insights */}
          <div className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold mb-2">Alerts</h2>
            {insights.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded bg-gray-100"
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    item.type === "over" ? "bg-red-600" : "bg-green-600"
                  }`}
                ></span>
                <span className="text-black text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
