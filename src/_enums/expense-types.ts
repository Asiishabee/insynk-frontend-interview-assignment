export enum ExpenseTypeEnum {
    CashIn = "Cash In",
    CashOut = "Cash Out",
}

export const ExpenseTypeEnumMap: Map<string, string> = new Map([
    [ExpenseTypeEnum.CashIn, 'Cash In'],
    [ExpenseTypeEnum.CashOut, 'Cash Out'],
  ]);
  