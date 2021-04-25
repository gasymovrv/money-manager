import React, { Component } from 'react';
import { getCurrentUser } from "./services/api.service";
import { getExpenseTypes } from "./services/api.service";
import { getIncomeTypes } from "./services/api.service";
import { getAccumulations } from "./services/api.service";
import { User } from "./interfaces/user.interface";
import { ExpenseType } from "./interfaces/expense.interface";
import { Expense } from "./interfaces/expense.interface";
import { IncomeType } from "./interfaces/income.interface";
import { Income } from "./interfaces/income.interface";
import { Accumulation } from "./interfaces/accumulation.interface";
import { SearchResult } from "./interfaces/common.interface";

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

type AppState = {
  user: User,
  columns: Column[],
  rows: Row[]
}

type AppProps = {
  title?: string,
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

class MainTable extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.state = {
      user: {
        id: '',
        name: '',
        picture: '',
        email: '',
      },
      columns: [],
      rows: []
    }
  }

  static defaultProps: AppProps = {
    title: "Default title",
  }

  async componentDidMount() {
    let columns: Column[] = [{name: "Date"}];

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
    columns.push({name: "Savings"});

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

    const currentUser = await getCurrentUser();
    this.setState({user: currentUser, columns: columns, rows: rows});
  }

  shouldComponentUpdate(nextProps: AppProps, nextState: AppState): boolean {
    return true;
  }

  render() {
    const user = this.state.user;

    return (
      <div>

        <header>
          <div>
            <h1>{this.props.title}</h1>
          </div>
          <div className="account">
            <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
            <div>
              <img src={user.picture} alt="not found"/>
            </div>
          </div>
        </header>

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
      </div>
    );
  }
}

const App = () => <MainTable title="Money Manager"/>

export default App;