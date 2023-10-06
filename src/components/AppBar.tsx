import { useNavigate, useParams } from "react-router-dom";
import { Constants } from "../_const/constants";
import { ExpenseList } from "../_types/expenseList";

interface AppBarInterface {
    title: string;
    isButton: boolean;
    isButtonText: string;
}


const AppBar = ({ title, isButton, isButtonText }: Partial<AppBarInterface>) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const expenseListString = sessionStorage.getItem(Constants.EXPENSE_LIST);
    let existingExpenseList: ExpenseList[] = [];

    if (expenseListString) {
        existingExpenseList = JSON.parse(expenseListString);
    }

    const deleteExpense = (confirm: boolean) => {

        if (confirm) {
            const updatedExpenseList = existingExpenseList.filter((expense) => expense.id !== Number(id));
            sessionStorage.setItem(Constants.EXPENSE_LIST, JSON.stringify(updatedExpenseList));
            navigate("/");
        }
    }

    return (
        <nav className="bg-lightBlue p-4 fixed w-full z-10">
            <div className={`container mx-auto flex ${isButton ? 'justify-between' : 'justify-center'} items-center `}>
                <div className={`text-darkBlue font-bold text-center ${isButton ? 'basis-3/4' : ''} md:text-2xl`}>{title}</div>
                {isButton && (<div className="basis-1/4">
                    <button className="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-2/4">{isButtonText !== Constants.REMOVE ? (<a href="/ManageExpense">
                        {isButtonText}
                    </a>) : (<><label htmlFor="remove" >
                        {isButtonText}
                    </label><input type="checkbox" id="remove" className="modal-toggle" /><div className="modal">
                            <div className="modal-box text-primaryBlack text-left">
                                <h3 className="font-bold text-base ">Are you Sure you want to delete this Expense?</h3>

                                <div className="modal-action">
                                    <label htmlFor="remove" className="btn">Cancel</label>
                                    <label htmlFor="remove" className="btn" onClick={() => deleteExpense(true)}>Confirm</label>
                                </div>
                            </div>
                        </div></>)}</button>
                </div>)}
            </div>
        </nav>
    );
}

export default AppBar;