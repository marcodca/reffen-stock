import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import Dialog from "@material-ui/core/Dialog";
import styled from 'styled-components';
import Slide from "@material-ui/core/Slide";

const uri =
  process.env.NODE_ENV === "production"
    ? "/graphql"
    : "http://localhost:4000/graphql";

const client = new ApolloClient({ uri });

function App() {
  const [open, setOpen] = React.useState(false);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Hello from the app!</h1>
        <Products />
        <button onClick={handleClickOpen}>open</button>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AddProduct />
        </Dialog>
      </div>
    </ApolloProvider>
  );
}

export default App;
