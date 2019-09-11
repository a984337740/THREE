import * as React from 'react';
import  { Layout } from './Page';
import { Router } from 'react-router-dom';
import history from './store/history';

class App extends React.Component {
  public render() {
    return (
      <Router history = { history }>
        <Layout/>
        </Router>
    ); 
  }
}

export default App;
