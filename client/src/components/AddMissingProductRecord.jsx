import React, { useState } from "react";
import Select from "react-select";
import { getProductsQuery } from "../queries";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import styled from "styled-components";
import { categories } from "../utlis";

//Query for products
//Mutation for adding missing product record

const StyledGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledGroupBadge = styled.span`
    background-color : #EBECF0;
    border-radius: 2em;
    color: "#172B4D";
    display: inline-block;
    font-size: 12;
    font-weight: normal;
    line-height: 1;
    min-width: 1;
    padding: 0.16666666666667em 0.5em;
    text-align : center;
`;

const formatGroupLabel = data => (
  <StyledGroup>
    <span>{data.label}</span>
    <StyledGroupBadge>{data.options.length}</StyledGroupBadge>
  </StyledGroup>
);

const AddMissingProductRecord = ({ data: { products } }) => {
  const productOptions = products
    ? products.map(elem => ({
        value: elem.name,
        label: elem.name,
        category: elem.category
      }))
    : [];

  const groupedProductOptions = categories.map(category => ({
    label: category,
    options: []
  }));

  productOptions.forEach(elem => {
    groupedProductOptions.forEach(productOption => {
      if (elem.category === productOption.label)
        productOption.options.push(elem);
    });
  });

  console.log(groupedProductOptions);

  return (
    //Form with the necesary field to add a new missing product record
    //An autocomplete text input, populated with all the products names that we are fetching from the query. Required.
    //A text input for the optional comment.
    //A Radio button to mark the item as important
    <Select
      //   defaultValue={"Search for a product"}
      placeholder="Search for a product"
      options={groupedProductOptions}
      formatGroupLabel={formatGroupLabel}
    />
  );
};

export default graphql(getProductsQuery)(AddMissingProductRecord);
