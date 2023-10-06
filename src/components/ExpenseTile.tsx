import { Constants } from "../_const/constants";
import { ExpenseTypeEnum } from "../_enums/expense-types";
import { ExpenseList } from "../_types/expenseList";

interface GroupedExpenses {
    [key: string]: ExpenseList[];
}

const formatDate = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

const groupAndSortExpenses = (expenses: ExpenseList[]): GroupedExpenses => {
    const groupedExpenses: GroupedExpenses = {};

    expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const month = formatDate(date);

        groupedExpenses[month] = groupedExpenses[month] || [];
        groupedExpenses[month].push(expense);
    });

    const sortedExpenseByMonth = Object.fromEntries(
        Object.entries(groupedExpenses).sort((a, b) => {
            const monthA = parseInt(a[0].split('-')[1]);
            const monthB = parseInt(b[0].split('-')[1]);
            return monthB - monthA;
        })
    );

    return sortedExpenseByMonth;
};


const calculateTotalAmount = (expenses: ExpenseList[]): string => {
    const cashInTotal = expenses.reduce((total, expense) => {
        const amount = expense.type === ExpenseTypeEnum.CashIn ? +expense.amount : -expense.amount;
        return total + amount;
    }, 0);

    const formattedTotal = `Rs.${Math.abs(cashInTotal)}`;
    return cashInTotal < 0 ? `-${formattedTotal}` : formattedTotal;
};

const ExpenseTile = () => {
    const expenseListString = sessionStorage.getItem(Constants.EXPENSE_LIST);
    let existingExpenseList: ExpenseList[] = [];

    if (expenseListString) {
        existingExpenseList = JSON.parse(expenseListString);
    }

    // Group expenses by month
    const groupedExpenses = groupAndSortExpenses(existingExpenseList);

    return (
        <div className="p-4 md:px-40 md:py-12 absolute top-16 w-full">
            {Object.keys(groupedExpenses).map(month => (
                <div key={month} className="mb-8">
                    <div className="flex justify-between p-2 border-b-2 border-primaryBlue text-primaryBlue font-semibold">
                        <h3 className="text-lg md:text-xl">{month}</h3>
                        <p className="text-xl md:text-2xl">{calculateTotalAmount(groupedExpenses[month])}</p>
                    </div>
                    {groupedExpenses[month].map(expense => (
                        <a href={`/ManageExpense/${expense.id}`} key={expense.id}
                            className={`flex justify-between p-2 border-b ${expense.type === ExpenseTypeEnum.CashIn ? 'text-primaryBlue border-primaryBlue' : 'text-primaryGreen border-primaryGreen'} font-semibold`}>
                            <h3 className="text-base  md:text-lg font-semibold">{expense.category}</h3>
                            <p className="text-lg  md:text-xl font-medium">{expense.type === ExpenseTypeEnum.CashIn ? '+' : '-'}Rs.{expense.amount}</p>
                        </a>
                    ))}

                </div>
            ))}
            {Object.keys(groupedExpenses).length === 0 && (
                <div className="flex flex-col justify-center h-full items-center p-2">
                    <img src="./assets/empty.svg" alt="" className="w-40 h-40" />
                    <p className="text-primaryRed font-semibold">No Expenses.</p>
                    <p className="text-primaryRed font-semibold">Start Adding expenses by clicking Add</p>
                </div>
            )}
        </div>
    );
}

export default ExpenseTile;
