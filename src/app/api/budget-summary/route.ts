import { connectDB } from "@/lib/mongodb";
import { Budget } from "@/models/budget";
import { Transaction } from "@/models/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const month = req.nextUrl.searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 }
      );
    }

    //Fetch budgets for that month
    const budgets = await Budget.find({ month });

    //Fetch transactions for that month
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(`${month}-01`), // e.g. "Jul-2025-01"
        $lt: new Date(`${month}-31`),
      },
    });

    //Sum transactions per category
    const spendingMap: Record<string, number> = {};

    transactions.forEach((t) => {
      if (!spendingMap[t.category]) {
        spendingMap[t.category] = 0;
      }
      spendingMap[t.category] += t.amount;
    });

    //Merge budgets + spending
    const summary = budgets.map((b) => {
      const spent = spendingMap[b.category] || 0;
      const status = spent > b.amount ? "Over" : "Under";
      return {
        category: b.category,
        budget: b.amount,
        actualSpent: spent,
        status,
      };
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate budget summary" },
      { status: 500 }
    );
  }
}
