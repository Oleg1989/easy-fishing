import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from './routes';
import { selectIsAuthenticated } from './containerSlice';
import { useAppSelector } from '../app/hooks';
import { Error } from './components/error/Error';


export function Container() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const routes = useRoutes(isAuthenticated);

  return (
    <Router>
      <div className="container">
        {routes}
        <Error />
      </div>
    </Router >
  );
}
