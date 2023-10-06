import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import ExpensePage from './pages/ExpensePage';
import ManageExpense from './components/ManageExpense';
import { Constants } from './_const/constants';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ExpensePage />} />
        <Route path='/CategoriesPage' element={<CategoriesPage />} />
        <Route path="/ManageExpense" element={<ManageExpense isAdding={true} title='Add Expense'/>} />
        <Route path="/ManageExpense/:id" element={<ManageExpense isAdding={false} title='Edit Expense' buttonText={Constants.REMOVE}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
