import React, { useState } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { getProductsQuery } from "./Products";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { categories } from "../utlis";

//check available in bars as a list!
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

const defaultProduct = {
  name: "",
  category: "",
  availableInBars: [],
  markedAsImportant: false,
  comment: ""
};

const AddProduct = props => {
  //Name
  const [nameInput, setNameInput] = useState({ value: "", isValid: false });

  const handleNameInput = e => {
    const { value } = e.target;
    if (value.length >= 4) {
      setNameInput({ value, isValid: true });
    } else {
      setNameInput({ value, isValid: false });
    }
  };

  //Category
  const [categoryInput, setCategoryInput] = useState({value : "", isValid : false})
  
  const handleCategoryInput = (e) => {
    const { value } = e.target;
    if (value !== ""){
      setCategoryInput({value, isValid: true})
    }
    else {
      setCategoryInput({value, isValid: false})
    }
  }


  const [product, setProduct] = useState(defaultProduct);

  const setProductFields = (key, value) => {
    const tempProduct = { ...product };
    tempProduct[key] = value;
    setProduct(tempProduct);
    return;
  };

  return (
    <>
      <h4>Add new product</h4>

      <form
        id="create-product"
        onSubmit={e => {
          e.preventDefault();
          console.log(product);
          console.log(categoryInput);
          const { name, category, availableInBars, comment } = product;
          props.mutate({
            variables: {
              name,
              category,
              availableInBars,
              comment
            },
            refetchQueries: [{ query: getProductsQuery }]
          });
          setProduct(defaultProduct);
        }}
      >
        <TextField
          label="Product name"
          margin="normal"
          variant="outlined"
          onChange={handleNameInput}
          value={nameInput.value}
          helperText={nameInput.isValid ? null : "At least 4 characters"}
          error={nameInput.isValid ? false : true}
        />
        {//Min width should be applied to the select element(120)}
        <FormControl>
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            variant="outlined"
            value={categoryInput.value}
            onChange={handleCategoryInput}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem 
                value={category} 
                key={index}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>}
        available in:
        <input
          name="available-in-bars"
          value={product["availableInBars"]}
          onChange={e => setProductFields("availableInBars", [e.target.value])}
        />
        comment:
        <input
          name="comment"
          value={product["comment"]}
          onChange={e => setProductFields("comment", e.target.value)}
        />
        <button>see</button>
      </form>
    </>
  );
};

export default graphql(addProductMutation)(AddProduct);
