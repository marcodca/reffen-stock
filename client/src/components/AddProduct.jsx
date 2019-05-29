import React, { useState } from "react";
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import { getProductsQuery } from './Products';

//check available in bars as a list!
const addProductMutation = gql`
  mutation ($name : String!, $category : String!, $availableInBars : [String]!, $comment : String ){
    addProduct(name : $name, category : $category, availableInBars : $availableInBars, comment : $comment){
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
    comment : ""
  }

const AddProduct = (props) => {

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
          const {name, category, availableInBars, comment } = product;
          props.mutate({
            variables : {
              name, category, availableInBars, comment
            },
            refetchQueries: [{query : getProductsQuery}]
          })
          setProduct(defaultProduct);
        }}
      >
        Name:
        <input
          name="name"
          value={product["name"]}
          onChange={e => setProductFields("name", e.target.value)}
        />
        Category:
        <input
          name="category"
          value={product["category"]}
          onChange={e => setProductFields("category", e.target.value)}
        />
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
