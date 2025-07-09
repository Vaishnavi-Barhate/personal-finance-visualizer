"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categories } from "@/constants/categories";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const openModal = () => {
    setFormData({
      amount: "",
      date: "",
      description: "",
      category: "",
      id: null,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.date ||
      !formData.description ||
      !formData.category
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    const method = formData.id ? "PUT" : "POST";

    await fetch("/api/transactions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: formData.id,
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description,
        category: formData.category,
      }),
    });

    setIsModalOpen(false);
    await fetchTransactions();
    setLoading(false);
  };

  const handleEdit = (transaction: any) => {
    setFormData({
      amount: transaction.amount,
      date: transaction.date.substring(0, 10),
      description: transaction.description,
      category: transaction.category,
      id: transaction._id,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);

    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    await fetchTransactions();
    setLoading(false);
  };

  return (
    <main className="w-full min-h-screen px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">
          
        </h1>
        <Button
          onClick={openModal}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Add Transaction
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200">
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t._id}>
                <TableCell>₹ {t.amount}</TableCell>
                <TableCell>{t.date?.substring(0, 10)}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(t._id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {formData.id ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              <Input
                placeholder="Date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

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

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading
                    ? "Saving..."
                    : formData.id
                    ? "Update Transaction"
                    : "Add Transaction"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
