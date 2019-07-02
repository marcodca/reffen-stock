import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import theme from "./styles/theme";
import MainView from "./components/MainView";

//Set the correspondig uri for production and development
const uri =
  process.env.NODE_ENV === "production"
    ? "/graphql"
    : "http://localhost:4000/graphql";

const client = new ApolloClient({ uri });

const App = () => {
  return (
    <ApolloProvider client={client}>
      <StylesProvider injectFirst>
        <StyledThemeProvider theme={theme}>
          <MainView />
        </StyledThemeProvider>
      </StylesProvider>
    </ApolloProvider>
  );
};

export default App;
