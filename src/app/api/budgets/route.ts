import { connectDB } from "@/lib/mongodb";
import { Budget } from "@/models/budget";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { category, month, amount } = body;

    if (!category || !month || amount == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let budget = await Budget.findOne({ category, month });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ category, month, amount });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 });
  }
}
