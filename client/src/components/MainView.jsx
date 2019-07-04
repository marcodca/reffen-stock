import React, { useState } from "react";
import Products from "./Products";
import AddProduct from "./AddProduct";
import AddMissingProductRecord from "./AddMissingProductRecord";

import styled, { css } from "styled-components/macro";
import media from "../styles/media";
import { SlideIn, SlideInBlurred } from "../styles/animations";
import { logoIcon } from '../styles/icons';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import Dialog from "@material-ui/core/Dialog";

import appBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import CssBaseline from "@material-ui/core/CssBaseline";
import drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

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
  const [tabsValue, setTabsValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabsValue(newValue);
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
  `;

  //Drawer

  const { container } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawerWidth = 240;

  const AppBar = styled(appBar)`
    margin-left: ${drawerWidth};
    background-color: ${props => props.theme.primary};
    ${media.down.sm`width :calc(100% - ${drawerWidth}px)`};
    ${props =>
      tabsValue === 0
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

  //Snackbar

  const [openSnackbar, setOpenSnackbar] = React.useState({
    value : false,
    message: null
  });



  function handleClickSnackbarButton(message) {
    setOpenSnackbar({value : true, message});
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar({
      value : false,
      message: null
    });
  }

  return (
    <Container>
      <CssBaseline />
      <AppBar position="fixed">
        <img
          css={`
            margin: 1% auto 0 auto;
          `}
          width={85} 
          src={logoIcon}
        />
        <Tabs variant="fullWidth" value={tabsValue} onChange={handleChange}>
          <LinkTab label="Out of stock" />
          <LinkTab label="Cocktail counter" />
        </Tabs>
      </AppBar>
      {
        //Mobile
      }
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
              <AddMissingProductRecord
                onClose={handleDrawerToggle}
                openAddProductDialog={handleClickOpen}
                setOpenSnackbar={setOpenSnackbar} 
              />
            </SlideInBlurred>
          </Drawer>
        </Hidden>
        {
          //Desktop
        }
        <Hidden xsDown implementation="css">
          <Drawer
            variant="persistent" //middle way between permanent and temporary
            open={tabsValue === 0}
            anchor={"left"}
          >
            <AddMissingProductRecord openAddProductDialog={handleClickOpen} setOpenSnackbar={setOpenSnackbar} />
          </Drawer>
        </Hidden>
      </DrawerNav>
      {tabsValue === 0 && (
        <TabContainer>
          <Products />
          <button onClick={handleClickOpen}>open</button>
          <Dialog fullScreen open={open}>
            <SlideIn>
              <AddProduct 
                onClose={handleClose} 
                setOpenSnackbar={setOpenSnackbar} 
              />
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
      {tabsValue === 1 && <TabContainer>Page Two</TabContainer>}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={openSnackbar.value}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          css={`
            background-color: green;
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            div {
              margin: 0 !important;
            }
          `}
          message={
            <span
              id="message-id"
              css={`
                display: inline-flex;
                align-items: flex-end;
              `}
            >
              <CheckCircleIcon />
              <span css={`
                margin-left: 25%;
              `}>{openSnackbar.message}</span>
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    </Container>
  );
};
export default MainView;
