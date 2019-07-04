import React, { useState } from "react";
import { graphql } from "react-apollo";
import { getProductsQuery, addProductMutation } from "../queries";
import styled, { css } from "styled-components/macro";

import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { categories, bars as barsArray } from "../utlis";

const AddProduct = props => {
  //DefaultValues for the inputs
  const defaultInputs = {
    name: { value: "", isValid: false },
    categories: { value: "", isValid: false },
    availableInBars: () => {
      const bars = { "All bars": true };
      barsArray.forEach(bar => {
        bars[bar] = true;
      });
      return bars;
    },
    description: ""
  };

  //Name
  const [nameInput, setNameInput] = useState(defaultInputs.name);

  const handleNameInput = e => {
    e.target.focus({ preventScroll: true });
    let { value } = e.target;

    if (value.length >= 4) {
      value = value.length < 25 ? value : value.slice(0, 25);
      setNameInput({ value, isValid: true });
    } else {
      setNameInput({ value, isValid: false });
    }
  };

  //Category
  const [categoryInput, setCategoryInput] = useState(defaultInputs.categories);

  const handleCategoryInput = e => {
    const { value } = e.target;
    if (value !== "") {
      setCategoryInput({ value, isValid: true });
    } else {
      setCategoryInput({ value, isValid: false });
    }
  };

  //AvailableInBars
  const [availableInBarsInput, setAvailableInBarsInput] = useState(
    defaultInputs.availableInBars
  );

  const handleAvailableInBarsInput = e => {
    const { name } = e.target;
    const inputValues = { ...availableInBarsInput };
    //if target event name is all, set all the keys to true
    if (name === "All bars") {
      Object.getOwnPropertyNames(inputValues).forEach(
        bar => (inputValues[bar] = true)
      );
      setAvailableInBarsInput(inputValues);
      return;
    }
    //toggle the value
    inputValues[name] = !inputValues[name];

    //if one of the checkboxes is not checked, the all checkbox can't be neighter
    if (!checkBarStatus(inputValues)) {
      inputValues["All bars"] = false;
    }
    //A default, if none checkbox is selected, all of them are gonna be checked!
    if (checkBarStatus(inputValues, false)) {
      Object.getOwnPropertyNames(inputValues).forEach(
        bar => (inputValues[bar] = true)
      );
    }
    setAvailableInBarsInput(inputValues);
    return;
  };

  //A helper function to check if all the properties of an object are set into true or false
  const checkBarStatus = (obj, bool = true) =>
    Object.getOwnPropertyNames(obj).reduce((acc, elem) => {
      if (elem === "All bars") return acc;
      acc = acc === true && obj[elem] === bool ? true : false;
      return acc;
    }, true);

  //Description
  const [descriptionInput, setDescriptionInput] = useState(
    defaultInputs.description
  );

  const handleDescriptionInput = e => {
    let { value } = e.target;
    value = value.length < 50 ? value : value.slice(0, 50);
    setDescriptionInput(value);
  };

  const handleCreateProduct = () => {
    //Extract the inputs value
    const name = nameInput.value.trim(),
      category = categoryInput.value,
      description = descriptionInput.trim(),
      availableInBars = Object.entries(availableInBarsInput).reduce(
        (acc, [barLabel, barValue]) => {
          acc =
            barLabel === "All bars" || !barValue
              ? [...acc]
              : [...acc, barLabel];
          return acc;
        },
        []
      );
    //Make the mutation,
    props
      .mutate({
        variables: {
          name,
          category,
          availableInBars,
          description
        },
        //refetch the getproduct query
        refetchQueries: [{ query: getProductsQuery }]
      })
      .then(({ data: { addProduct } }) => {
        props.setOpenSnackbar({
          value: true,
          message: `${addProduct.name} was successfully created`
        });
      });

    //Set the input's values back to default
    setNameInput(defaultInputs.name);
    setCategoryInput(defaultInputs.categories);
    setAvailableInBarsInput(defaultInputs.availableInBars);
    setDescriptionInput(defaultInputs.description);
    //Close the dialog
    props.onClose();
  };

  //Styled components

  const Checkboxes = styled(FormGroup)`
    display: grid;
    grid-template-columns: auto auto;
    margin-top: 1rem;
    padding: 3%;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 3%;
    background-color: white;
    legend {
      color: black;
      margin-bottom: 1em;
    }
    legend,
    label:first-of-type {
      grid-column-start: span 2;
      justify-self: center;
    }
  `;

  const TextInputStyle = css`
    input {
      background-color: white;
    }
    label {
      color: black !important;
    }
  `;

  return (
    <div
      css={`
        width: 43vw;
        min-width: calc(333px - 2rem);
        padding: 2%;
        border-radius: 3%;
        margin: 0 auto;
        padding-bottom: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        background-color: rgba(178, 177, 207, 0.1);
      `}
    >
      <Typography variant="h5">Create new product</Typography>
      {
        //Erw, an issue on mobile (android), the viw is scroll to bottom when the input get focus and the keyboard pops up, I'll have to chek on that later
      }
      <TextField
        label="Product name *"
        margin="normal"
        variant="outlined"
        onChange={handleNameInput}
        value={nameInput.value}
        helperText={nameInput.isValid ? null : "At least 4 characters"}
        error={nameInput.isValid ? false : true}
        css={TextInputStyle}
      />
      {
        <FormControl
          css={`
            background-color: white;
            border: 1px solid rgba(0, 0, 0, 0.23);
            border-radius: 3%;
            padding: 3%;
            div:focus {
              background-color: white;
            }
            .MuiFormHelperText-root {
              color: red;
            }
          `}
        >
          <InputLabel
            htmlFor="category"
            css={`
              color: black;
              margin-left: 3%;
              margin-top: 2%;
              &:focus {
                color: black !important;
                margin-top: 2%;
              }
            `}
          >
            Category *
          </InputLabel>
          <Select
            required
            variant="outlined"
            value={categoryInput.value}
            onChange={handleCategoryInput}
            error={categoryInput.isValid ? false : true}
          >
            <MenuItem value="" disabled>
              <em>None</em>
            </MenuItem>
            {categories.map(({ label }) => (
              <MenuItem
                value={label}
                key={label}
                css={`
                  background-color: white;
                `}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
          {!categoryInput.isValid && (
            <FormHelperText>You must select a category</FormHelperText>
          )}
        </FormControl>
      }
      <Checkboxes>
        <FormLabel component="legend">
          Bars in where the product is available *
        </FormLabel>
        {Object.getOwnPropertyNames(availableInBarsInput).map((bar, index) => {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  color="primary"
                  disabled={
                    bar === "All bars" && checkBarStatus(availableInBarsInput)
                      ? true
                      : false
                  }
                  name={bar}
                  checked={
                    bar === "All bars" && checkBarStatus(availableInBarsInput)
                      ? true
                      : availableInBarsInput[bar]
                  }
                  onChange={handleAvailableInBarsInput}
                />
              }
              label={bar}
            />
          );
        })}
      </Checkboxes>
      <TextField
        label="Optional product description"
        margin="normal"
        variant="outlined"
        onChange={handleDescriptionInput}
        value={descriptionInput}
        css={TextInputStyle}
      />
      <Typography variant="caption" align="left" gutterBottom>
        * Required field
      </Typography>
      <div
        css={`
          width: 80%;
          min-width: 270px;
          margin: 0 auto;
          display: flex;
          justify-content: space-evenly;
        `}
      >
        <Button
          variant="contained"
          disabled={nameInput.isValid && categoryInput.isValid ? false : true}
          onClick={handleCreateProduct}
        >
          Create product
        </Button>
        <Button variant="contained" onClick={props.onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default graphql(addProductMutation)(AddProduct);
