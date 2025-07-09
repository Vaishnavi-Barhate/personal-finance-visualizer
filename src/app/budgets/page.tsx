"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/constants/categories";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    month: "",
    amount: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: formData.category,
        month: formData.month,
        amount: Number(formData.amount),
      }),
    });

    setFormData({
      category: "",
      month: "",
      amount: "",
    });

    fetchBudgets();
    setShowModal(false);
  };

  return (
    <main className="w-full min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"></h1>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowModal(true)}
        >
          Set Budget
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Set Budget</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* Category Dropdown */}
              <select
                className="border p-2 rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) =>
                  typeof cat === "string" ? (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ) : (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  )
                )}
              </select>

              {/* Month Input */}
              <Input
                placeholder="Month (e.g. Jul-2025)"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
              />

              {/* Amount */}
              <Input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />

              <div className="flex gap-2 mt-2">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Budget
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gradient-to-r from-purple-100 to-purple-200">
            <tr>
              <th className="text-left py-2 px-4 border-b">Category</th>
              <th className="text-left py-2 px-4 border-b">Month</th>
              <th className="text-left py-2 px-4 border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={`${b.category}-${b.month}`}>
                <td className="py-2 px-4 border-b">{b.category}</td>
                <td className="py-2 px-4 border-b">{b.month}</td>
                <td className="py-2 px-4 border-b">₹ {b.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
