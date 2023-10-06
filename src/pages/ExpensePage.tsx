import AppBar from "../components/AppBar";
import BottomNavigation from "../components/BottomNavigation";
import ExpenseTile from "../components/ExpenseTile";

const ExpensePage = () => {

    return (<><AppBar title='Expense Tracking' isButton={true} isButtonText="Add" /><ExpenseTile /><BottomNavigation /></>);
}

export default ExpensePage;