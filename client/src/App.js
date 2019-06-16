import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import AddMissingProductRecord from "./components/AddMissingProductRecord";
import Dialog from "@material-ui/core/Dialog";
import styled, { keyframes } from "styled-components";

const uri =
  process.env.NODE_ENV === "production"
    ? "/graphql"
    : "http://localhost:4000/graphql";

const client = new ApolloClient({ uri });

function App() {
  const [open, setOpen] = React.useState(false);

  const slideInKeyframes = keyframes`
    0% {
    transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  `;

  const SlideIn = styled.div`
    animation: ${slideInKeyframes} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      both;
  `;

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  // function showNewProductModal() {
  //   return (

  //   );
  // }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Hello from the app!</h1>
        <Products />
        <AddMissingProductRecord />
        <button onClick={handleClickOpen}>open</button>
        <Dialog fullScreen open={open} onClose={handleClose}>
          <SlideIn>
            <AddProduct onClose={handleClose} />
          </SlideIn>
        </Dialog>
      </div>
    </ApolloProvider>
  );
}

export default App;
