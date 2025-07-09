import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/transaction";
import { NextRequest } from "next/server";

export async function GET() {
  await connectDB();

  const transactions = await Transaction.find().sort({ date: -1 });
  return Response.json(transactions);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const newTransaction = await Transaction.create({
  amount: body.amount,
  date: body.date,
  description: body.description,
  category: body.category, 
  });


  return Response.json(newTransaction);
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const updatedTransaction = await Transaction.findByIdAndUpdate(
  body.id,
  {
    amount: body.amount,
    date: body.date,
    description: body.description,
    category: body.category, 
  },
  { new: true }
);


  return Response.json(updatedTransaction);
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  await Transaction.findByIdAndDelete(body.id);

  return new Response("Transaction deleted", { status: 200 });
}
