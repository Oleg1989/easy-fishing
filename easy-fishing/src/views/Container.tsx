import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { UserPageTable } from './pages/UserPageTable';
import { UserPage } from './pages/UserPage';
import { MainPage } from './pages/MainPage';

// import { useAppSelector, useAppDispatch } from '../app/hooks';
// import { selectContainer } from './containerSlice';


export function Container() {
  // const count = useAppSelector(selectContainer);
  // const dispatch = useAppDispatch();

  return (
    <div className="md:container md:mx-auto">
      <Router>
        <div>
          <Switch>
            <Route path="/user/page/table">
              <UserPageTable />
            </Route>
            <Route path="/user/page">
              <UserPage />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/registration">
              <Registration />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>
        </div>
      </Router >
    </div>
  );
}
