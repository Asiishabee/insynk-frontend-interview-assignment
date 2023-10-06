import AppBar from "../components/AppBar";
import BottomNavigation from "../components/BottomNavigation";
import { Categories } from "../_const/categories";
import { useEffect, useState } from "react";
import { Constants } from "../_const/constants";
import { ExpenseList } from "../_types/expenseList";

const CategoriesPage = () => {
    const [showInput, setShowInput] = useState(false);
    const [allCategories, setAllCategories] = useState(Categories);
    const [newCategoryName, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState('');
    const [addUpdateBtnText, setAddUpdateBtnText] = useState('Add');

    useEffect(() => {
        const sessionCategories = sessionStorage.getItem('Categories');
        if (sessionCategories) {
            setAllCategories(JSON.parse(sessionCategories))
        }

    }, [])

    const removeCategory = (categoryName: string) => {
        const expenseListString = sessionStorage.getItem(Constants.EXPENSE_LIST);

        const updatedCategories = allCategories.filter((category) => category.name !== categoryName);
        setAllCategories(updatedCategories)
        sessionStorage.setItem('Categories', JSON.stringify(updatedCategories));

        if (expenseListString) {
            const existingExpenseList = JSON.parse(expenseListString);
            const updatedExpenseList = existingExpenseList.filter((expense: ExpenseList) => expense.category !== categoryName);
            sessionStorage.setItem(Constants.EXPENSE_LIST, JSON.stringify(updatedExpenseList));
        }
    }


    const addCategory = () => {
        let updatedCategories;
        if (addUpdateBtnText === 'Update') {

            updatedCategories = allCategories.map((category) =>
                category.name === editingCategory ? { ...category, name: newCategoryName } : category
            );
            setEditingCategory("");
        } else {

            let maxOrder = 0;
            if (allCategories && allCategories.length > 0) {
                allCategories.forEach((category) => {
                    if (category.order && category.order > maxOrder) {
                        maxOrder = category.order;
                    }
                });
            }

            const newCategory = {
                name: newCategoryName,
                order: maxOrder + 1,
                isMain: false,
            };

            updatedCategories = [...allCategories, newCategory];
        }

        setAllCategories(updatedCategories);
        sessionStorage.setItem("Categories", JSON.stringify(updatedCategories));
        setNewCategory("");
        setShowInput(false);
    };


    const setUpdateCateoryValue = (categoryName: string, isMain: boolean) => {
        if (!isMain) {
            setEditingCategory(categoryName)
            setShowInput(true);
            setAddUpdateBtnText('Update');
            setNewCategory(categoryName)
        }

    }

    return (<><AppBar title={"Category List"} isButton={false} />

        <div className="p-4 md:px-40 text-primaryBlue font-semibold text-lg absolute top-16 w-full">
            {allCategories.map((category) => (
                <div
                    key={category.name}
                    className="border-b border-primaryBlue p-2 flex justify-between group"

                >
                    <p className="capitalize cursor-pointer" onClick={() => setUpdateCateoryValue(category.name, category.isMain)}>{category.name}</p>
                    <label htmlFor={`delete-${category.name}`} className="text-primaryRed hidden group-hover:inline-block cursor-pointer" onClick={() => { setShowInput(false); setNewCategory('') }}>{!category.isMain && 'X'}</label>
                    <input type="checkbox" id={`delete-${category.name}`} className="modal-toggle" /><div className="modal">
                        <div className="modal-box text-primaryBlack text-left">
                            <h3 className="font-bold text-sm mb-2">{category.name} will be removed</h3>
                            <h3 className="font-bold text-sm mb-2">{category.name}All expense with this category also will be removed</h3>
                            <h3 className="font-bold text-sm ">Do you really want to remove?</h3>
                            <div className="modal-action">
                                <label htmlFor={`delete-${category.name}`} className="btn bg-white border-primaryBlue text-primaryBlue">Cancel</label>
                                <label htmlFor={`delete-${category.name}`} className="btn bg-primaryBlue text-white" onClick={() => removeCategory(category.name)}>Confirm</label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {showInput && (<><input type="text" placeholder="Type here" className="border p-2 border-primaryBlue w-full my-4" value={newCategoryName} onChange={(e) => setNewCategory(e.target.value)} />
                <div className="text-right"><button className="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-36 my-4" onClick={() => addCategory()}>
                    {addUpdateBtnText}</button> </div></>)}
            <div className="text-right">
                {!showInput && (<button className="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-36 my-4" onClick={() => { setShowInput(true); setAddUpdateBtnText('Add') }}>Add</button>)}
            </div>
        </div>
        <BottomNavigation pageType={'category'} /></>);
}

export default CategoriesPage;