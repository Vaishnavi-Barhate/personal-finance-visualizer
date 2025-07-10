import { Schema, model, models, Document, Model } from "mongoose";

export interface IBudget extends Document {
  category: string;
  month: string;
  amount: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Budget: Model<IBudget> =
  models.Budget || model<IBudget>("Budget", BudgetSchema);
