import AppBar from "./AppBar";
import { useEffect, useState } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from 'yup';
import { Categories } from "../_const/categories";
import { ExpenseList } from "../_types/expenseList";
import { useNavigate, useParams } from "react-router-dom";
import { Constants } from "../_const/constants";


interface ManageExpenseProps {
    isAdding: boolean
    title: string;
    buttonText: string;
}

const ManageExpense = ({ isAdding, title, buttonText }: Partial<ManageExpenseProps>) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [expense, setExpense] = useState<ExpenseList>({} as ExpenseList)
    const expenseListString = sessionStorage.getItem(Constants.EXPENSE_LIST);
    let existingExpenseList: ExpenseList[] = [];
    const [allCategories, setAllCategories] = useState(Categories);

    const [selectedExpenseType, setSelectedExpenseType] = useState<string>('Cash In');

    useEffect(() => {
        const sessionCategories = sessionStorage.getItem('Categories');
        if (sessionCategories) {
            setAllCategories(JSON.parse(sessionCategories))
        }

    }, [])

    const expenseTypes = ['Cash In', 'Cash Out']
    if (expenseListString) {
        existingExpenseList = JSON.parse(expenseListString);
    }

    useEffect(() => {
        if (id) {
            const expense = existingExpenseList.find(expense => expense.id === Number(id)) || {} as ExpenseList;
            setExpense(expense);
            setSelectedExpenseType(expense.type)
        }
    }, [])

    const validationSchema = Yup.object().shape({
        amount: Yup.string()
            .test('is-greater-than-zero', 'Amount must be greater than 0', value => parseFloat(value || '0') > 0)
            .required('Amount is required'),
    });


    const initialValues: ExpenseList = {
        id: expense?.id ? expense.id : 0,
        type: expense?.type ? expense.type : selectedExpenseType,
        category: expense?.category ? expense.category : 'Food',
        date: expense?.date ? expense.date : new Date().toISOString().split('T')[0],
        amount: expense?.amount ?? expense.amount,
        description: expense?.description ? expense.description : '',
    }

    const submitExpenseData = (values: ExpenseList) => {
        let maxId = 0;
        if (existingExpenseList && existingExpenseList.length > 0) {
            existingExpenseList.forEach(expense => {
                if (expense.id && expense.id > maxId) {
                    maxId = expense.id;
                }
            });
        }
        const updatedExpenseList = isAdding
            ? [...existingExpenseList, { ...values, id: maxId + 1 }]
            : existingExpenseList.map(expense => (expense.id === values.id ? { ...expense, ...values } : expense));

        sessionStorage.setItem('expenseList', JSON.stringify(updatedExpenseList));
        navigate("/");
    };

    return (<><AppBar title={title} isButton={!isAdding} isButtonText={buttonText} />
        <main className="m-8 md:m-20 absolute top-16 w-[80%] md:w-[90%] left-0 right-0">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitExpenseData}
                enableReinitialize={true}
            >
                {(props: FormikProps<ExpenseList>) => {
                    const { isValid, errors, touched, dirty, values, setFieldValue } =
                        props;

                    const expenseTypeChange = (type: string) => {
                        console.log(values, 'values', type)

                        setFieldValue('type', type)
                        setSelectedExpenseType(type)
                    };

                    return (
                        <Form>
                            <div className="mb-4 text-base md:text-lg">
                                <label
                                    htmlFor="category"
                                    className="font-semibold text-secondaryFont mb-2"
                                >
                                    Type
                                </label>
                                <div className="flex mt-2">
                                    {expenseTypes.map((type) => (
                                        <div key={type} className={`px-4 py-2 ${type === "Cash In" ? 'rounded-l' : 'rounded-r'} w-36 text-center font-semibold text-white ${selectedExpenseType === type ? 'bg-primaryBlue ' : 'bg-lightBlue'}`} onClick={() => expenseTypeChange(type)}>{type}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="category"
                                    className="font-semibold text-secondaryFont mb-2"
                                >
                                    Category
                                </label>
                                <Field
                                    type="text"
                                    as="select"
                                    className="p-3 desktop:mr-3 mb-2 focus:outline-none relative bg-white dark:bg-black text-sm border-2 hover:border-primaryCyan focus:border-primaryCyan focus:invalid:border-primaryRed rounded-md"
                                    name="category"
                                    placeholder="Category"
                                    autoComplete="off"
                                >
                                    {allCategories.map((category, index) => (
                                        <option key={index} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="amount"
                                    className="font-semibold text-secondaryFont mb-2"
                                >
                                    Amount
                                </label>
                                <Field
                                    type="number"
                                    className="p-3 mb-2 focus:outline-none relative bg-white dark:bg-black text-sm border-2 hover:border-primaryCyan focus:border-primaryCyan focus:invalid:border-primaryRed rounded-md"
                                    name="amount"
                                    placeholder="Enter Amount"
                                    autoComplete="off"
                                />
                                {touched.amount && errors.amount !== '' && (
                                    <div className="text-primaryRed text-left">
                                        {errors.amount}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="amount"
                                    className="font-semibold text-secondaryFont mb-2"
                                >
                                    Date
                                </label>
                                <Field
                                    type="date"
                                    name="date"
                                    placeholder="YYYY-MM-DD"
                                    className="p-3 mb-2 focus:outline-none relative bg-white dark:bg-black text-sm border-2 hover:border-primaryCyan focus:border-primaryCyan focus:invalid:border-primaryRed rounded-md"
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="amount"
                                    className="font-semibold text-secondaryFont mb-2"
                                >
                                    Description
                                </label>
                                <Field
                                    type="text"
                                    as="textarea"
                                    className="w-full h-24 p-3 focus:outline-none relative bg-white dark:bg-black text-sm border-2 hover:border-primaryCyan focus:border-primaryCyan focus:invalid:border-primaryRed rounded-md"
                                    name="description"
                                    placeholder="Spent for noble cause"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="fixed md:relative bottom-0 py-4 flex justify-center left-0 right-0 font-medium">
                                <a href="/" className="text-primaryBlue text-center px-3 py-1 text-lg  border border-primaryBlue w-44 m-2" >Cancel</a>
                                <button disabled={!isValid || !dirty} type="submit" className={`bg-primaryBlue text-white px-3 py-1 text-lg w-44 m-2  ${!isValid || !dirty
                                    ? 'opacity-50 pointer-events-none'
                                    : ''}
` } >{isAdding ? 'Add' : ' Update'}</button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </main></>);
}

export default ManageExpense;