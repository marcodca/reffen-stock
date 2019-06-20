import React, { useState } from "react";
import Products from "./Products";
import AddProduct from "./AddProduct";
import AddMissingProductRecord from "./AddMissingProductRecord";
import Dialog from "@material-ui/core/Dialog";
import styled, { keyframes } from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const LinkTab = props => (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );

const Container = styled.div`
    flex-grow : 1;
    background-color: lightblue;
`
//

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
  animation: ${slideInKeyframes} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`;

const MainView = props => {

  //Create product dialog  
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Tabs
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  return (
    <Container>
      <AppBar position="static">
        <Tabs variant="fullWidth" value={value} onChange={handleChange}>
          <LinkTab label="Out of stock"  />
          <LinkTab label="Cocktail counter" />
        </Tabs>
      </AppBar>
      {value === 0 && (
        <TabContainer>
            <Products />
            <AddMissingProductRecord />
            <button onClick={handleClickOpen}>open</button>
            <Dialog fullScreen open={open}>
              <SlideIn>
                <AddProduct onClose={handleClose} />
              </SlideIn>
            </Dialog>
        </TabContainer>
      )}
      {value === 1 && <TabContainer>Page Two</TabContainer>}
    </Container>
  );
};
export default MainView;
