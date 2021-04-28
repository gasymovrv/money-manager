import React from 'react';
import { Component } from 'react';
import './main.css';
import { Income } from '../../interfaces/income.interface';
import { IncomeType } from '../../interfaces/income.interface';
import { Expense } from '../../interfaces/expense.interface';
import { ExpenseType } from '../../interfaces/expense.interface';
import { getExpenseTypes } from '../../services/api.service';
import { getIncomeTypes } from '../../services/api.service';
import { getAccumulations } from '../../services/api.service';
import { SearchResult } from '../../interfaces/common.interface';
import { Accumulation } from '../../interfaces/accumulation.interface';
import Header from '../header/header';
import { User } from '../../interfaces/user.interface';

type Column = {
  name: string
  type?: string
}

type Row = {
  id: number
  date: string
  incomes: Array<Income | null | undefined>
  expenses: Array<Expense | null | undefined>
  savings: number
}

type MainState = {
  columns: Column[],
  rows: Row[]
}

type MainProps = {
  user: User,
}

function stringSort(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  } else if (s1 === s2) {
    return 0;
  } else {
    return -1;
  }
}

function incomeTypeSort(t1: IncomeType, t2: IncomeType): number {
  return stringSort(t1.name, t2.name);
}

function expenseTypeSort(t1: ExpenseType, t2: ExpenseType): number {
  return stringSort(t1.name, t2.name);
}

class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)

    this.state = {
      columns: [],
      rows: []
    }
  }

  async componentDidMount() {
    let columns: Column[] = [{name: 'Date'}];

    const expenseTypes = await getExpenseTypes();
    expenseTypes.sort(expenseTypeSort);
    const expColumns: Column[] = expenseTypes.map(({name}: ExpenseType) => {
        return {name: name, type: 'EXPENSE'}
      }
    );

    const incomeTypes = await getIncomeTypes();
    incomeTypes.sort(incomeTypeSort);
    const incColumns: Column[] = incomeTypes.map(({name}: IncomeType) => {
        return {name: name, type: 'INCOME'}
      }
    );

    columns = columns.concat(incColumns).concat(expColumns);
    columns.push({name: 'Savings'});

    const searchResult: SearchResult<Accumulation> = await getAccumulations();
    const accumulations = searchResult.result;
    const rows: Row[] = accumulations.map(({id, date, value, expensesByType, incomesByType}: Accumulation) => {
      const expenses: Array<Expense | undefined> = [];
      const incomes: Array<Income | undefined> = [];

      expenseTypes.forEach(({name}: ExpenseType) => {
        const exp = expensesByType.get(name);
        expenses.push(exp);
      })
      incomeTypes.forEach(({name}: IncomeType) => {
        const inc = incomesByType.get(name);
        incomes.push(inc);
      });

      return {id, date, incomes, expenses, savings: value};
    });

    this.setState({columns: columns, rows: rows});
  }

  shouldComponentUpdate(nextProps: MainProps, nextState: MainState): boolean {
    return true;
  }

  render() {
    return (
      <>
        <Header user={this.props.user}/>
        <main>
          <table>
            <tbody>
            <tr>
              {this.state.columns.map(({name, type}: Column) =>
                <th key={name} className={
                  type === 'EXPENSE' ?
                    'dark-red' : type === 'INCOME' ?
                    'dark-green' : ''
                }>{name}</th>
              )}
            </tr>
            {this.state.rows.map(({id, date, incomes, expenses, savings}: Row) =>
              <tr key={id}>
                <td key={'date_' + id}>{date}</td>
                {incomes.map((inc: Income | null | undefined) =>
                  inc ? <td className="green" key={id + '_' + inc.id}>{inc.value}</td> : <td/>
                )}
                {expenses.map((exp: Expense | null | undefined) =>
                  exp ? <td className="red" key={id + '_' + exp.id}>{exp.value}</td> : <td/>
                )}
                <td key={'savings_' + id}>{savings}</td>
              </tr>
            )}
            </tbody>
          </table>
        </main>
      </>
    );
  }
}

export default Main;
