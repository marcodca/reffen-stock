import React, { useState } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { getProductsQuery } from "../queries";
import styled from "styled-components";
import { StylesProvider } from "@material-ui/styles";

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

const addProductMutation = gql`
  mutation(
    $name: String!
    $category: String!
    $availableInBars: [String]!
    $description: String
  ) {
    addProduct(
      name: $name
      category: $category
      availableInBars: $availableInBars
      description: $description
    ) {
      id
      name
      category
    }
  }
`;

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
    const { value } = e.target;
    if (value.length >= 4) {
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
    const { value } = e.target;
    setDescriptionInput(value);
  };

  const handleCreateProduct = () => {
    //Extract the inputs value
    const name = nameInput.value,
      category = categoryInput.value,
      description = descriptionInput,
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
    props.mutate({
      variables: {
        name,
        category,
        availableInBars,
        description
      },
      //refetch the getproduct query
      refetchQueries: [{ query: getProductsQuery }]
    });

    //Set the input's values back to default
    setNameInput(defaultInputs.name);
    setCategoryInput(defaultInputs.categories);
    setAvailableInBarsInput(defaultInputs.availableInBars);
    setDescriptionInput(defaultInputs.description);
  };

  //Styled components

  const Checkboxes = styled(FormGroup)`
    display: grid;
    grid-template-columns: auto auto;
    margin-top: 1rem;
    padding: 3%;
    border: 1px solid gray;
    border-radius: 5%;

    legend,
    label:first-of-type {
      grid-column-start: span 2;
      justify-self: center;
    }
  `;

  return (
    <div
      style={{
        width: "40vw",
        minWidth: "calc(300px - 2rem)",
        margin: "0 auto",
        paddingBottom: "2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h6">Create new product</Typography>
      <TextField
        label="Product name*"
        margin="normal"
        variant="outlined"
        onChange={handleNameInput}
        value={nameInput.value}
        helperText={nameInput.isValid ? null : "At least 4 characters"}
        error={nameInput.isValid ? false : true}
      />
      {
        //Min width should be applied to the select element(120)}
        <FormControl>
          <InputLabel htmlFor="category">Category*</InputLabel>
          <Select
            variant="outlined"
            value={categoryInput.value}
            onChange={handleCategoryInput}
            error={categoryInput.isValid ? false : true}
          >
            <MenuItem value="" disabled>
              <em>None</em>
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem value={category} key={index}>
                {category}
              </MenuItem>
            ))}
          </Select>
          {!categoryInput.isValid && (
            <FormHelperText>You must select a category</FormHelperText>
          )}
        </FormControl>
      }
      <StylesProvider injectFirst>
        <Checkboxes>
          <FormLabel component="legend">
            Bars in where the product is available*
          </FormLabel>
          {Object.getOwnPropertyNames(availableInBarsInput).map(
            (bar, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      disabled={
                        bar === "All bars" &&
                        checkBarStatus(availableInBarsInput)
                          ? true
                          : false
                      }
                      name={bar}
                      checked={
                        bar === "All bars" &&
                        checkBarStatus(availableInBarsInput)
                          ? true
                          : availableInBarsInput[bar]
                      }
                      onChange={handleAvailableInBarsInput}
                    />
                  }
                  label={bar}
                />
              );
            }
          )}
        </Checkboxes>
      </StylesProvider>
      <TextField
        label="Product description"
        margin="normal"
        variant="outlined"
        onChange={handleDescriptionInput}
        value={descriptionInput}
      />
      <Typography variant="caption" align="left" gutterBottom>
        * Required field
      </Typography>
      <div>
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
