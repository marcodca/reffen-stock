import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Products from './components/Products';

const uri = process.env.NODE_ENV === "production" ? '/graphql' : 'http://localhost:4000/graphql';

const client = new ApolloClient({ uri });

function App() {
  return (
    <ApolloProvider client={ client }>
      <div className="App">
        <h1>Hello from the app!</h1>
        <Products/>
      </div>
    </ApolloProvider>
  );
}

export default App;
