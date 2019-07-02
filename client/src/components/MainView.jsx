import React, { useState } from "react";
import Products from "./Products";
import AddProduct from "./AddProduct";
import AddMissingProductRecord from "./AddMissingProductRecord";
import Dialog from "@material-ui/core/Dialog";
import styled, { css } from "styled-components";
import media from "../styles/media";
import { SlideIn, SlideInBlurred } from "../styles/animations";

import appBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import CssBaseline from "@material-ui/core/CssBaseline";
import drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";

const MainView = (props, context) => {
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
  };

  const TabContainer = props => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  };

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
    flex-grow: 1;
    display: flex;
;
`

  //Drawer

  const { container } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawerWidth = 240;

  const AppBar = styled(appBar)`
    margin-left: ${drawerWidth};
    background-color: ${props => props.theme.primary };
    ${media.down.sm`width :calc(100% - ${drawerWidth}px)`};
    ${props =>
      props.isfirsttabopen !== "false"
        ? ""
        : css`
            width: 100% !important;
          `}
  `;

  const DrawerNav = styled.nav`
    ${media.down.sm`width : ${drawerWidth}px;`}
    flex-shrink: 0;
  `;

  const Drawer = styled(drawer)`
    .MuiDrawer-paper {
      width: ${drawerWidth}px;
    }
  `;

  return (
            <Container>
            <CssBaseline />
            {
              //aghhh, funny error with that prop "is first tab open", got to come with lowercases and coertion to make it go away
            }
            <AppBar position="fixed" isfirsttabopen={String(value === 0)}>
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <LinkTab label="Out of stock" />
                <LinkTab label="Cocktail counter" />
              </Tabs>
            </AppBar>
            <DrawerNav aria-label="Report new missing product">
              <Hidden smUp implementation="css">
                <Drawer
                  container={container}
                  variant="temporary"
                  anchor={"left"}
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                  }}
                >
                  <SlideInBlurred>
                    <AddMissingProductRecord onClose={handleDrawerToggle}/>
                  </SlideInBlurred>
                </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Drawer
                  variant="persistent" //middle way between permanent and temporary
                  open={value === 0}
                  anchor={"left"}
                >
                  <AddMissingProductRecord />
                </Drawer>
              </Hidden>
            </DrawerNav>
            {value === 0 && (
              <TabContainer>
                <Products />
                <button onClick={handleClickOpen}>open</button>
                <Dialog fullScreen open={open}>
                  <SlideIn>
                    <AddProduct onClose={handleClose}  />
                  </SlideIn>
                </Dialog>
                <Hidden smUp implementation="css">
                  <Button
                    color="primary"
                    aria-label="Open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                  >
                    Open drawer
                  </Button>
                </Hidden>
              </TabContainer>
            )}
            {value === 1 && <TabContainer>Page Two</TabContainer>}
          </Container>
  );
};
export default MainView;
