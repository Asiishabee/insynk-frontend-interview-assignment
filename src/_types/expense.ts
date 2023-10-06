import { ExpenseTypeEnum } from "../_enums/expense-types"
import { Category } from "./category"

export interface Expense {
    type: ExpenseTypeEnum
    category: Category
    date: Date
    amount: number
    description: string
  }