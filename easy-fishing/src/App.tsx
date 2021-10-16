import React from 'react';
import { Container } from './views/Container';
import './App.css';
import firebase from './firebase';
import { getDatabase } from "firebase/database";
import { isAuthenticated } from './views/containerSlice';
import { useAppDispatch } from './app/hooks';

getDatabase(firebase);

function App() {
  const dispatch = useAppDispatch();

  if (localStorage.getItem('token')) {
    dispatch(isAuthenticated());
  }

  return (
    <Container />
  );
}

export default App;
