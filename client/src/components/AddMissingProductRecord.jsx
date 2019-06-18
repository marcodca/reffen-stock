import React, { useState } from "react";
import Select from "react-select";
import { getProductsQuery } from "../queries";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import styled from "styled-components";
import { categories } from "../utlis";

//Mutation for adding missing product record

//Styled-Components
const StyledGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
`;
const CategoryIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const StyledCategoryBadge = styled.span`
  background-color: #ebecf0;
  border-radius: 2em;
  color: "#172B4D";
  display: inline-block;
  font-size: 12;
  font-weight: normal;
  line-height: 1;
  min-width: 1;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;
//

//A componenent for the the categories info display in the select input
const formatGroupLabel = ({ label, icon, options}) => (
  <StyledGroup>
    <CategoryInfo>
      <CategoryIcon src={icon} />
      <div>{label}</div>
    </CategoryInfo>
    <StyledCategoryBadge>{options.length}</StyledCategoryBadge>
  </StyledGroup>
);

//

const AddMissingProductRecord = ({ data: { products } }) => {

  //Select Input

  const [ selectInput, setSelectInput ] = useState(null);

  const handleSelectInput = e => {
    const { value } = e;
    setSelectInput(value);
    console.log(value);
  }

  //All the the products in a value-label format.
  const productOptions = products
    ? products.map(elem => ({
        value: elem.id,
        label: elem.name,
        category: elem.category
      }))
    : [];
  
  //An array containing a category object with their label, icon, and an empty array for the options that is gonna contain in the future.
  const groupedProductOptions = categories.map(({ label, icon }) => ({
    label,
    icon,
    options: []
  }));

  //We populate the option property in each category object with their corresponing options.
  productOptions.forEach(elem => {
    groupedProductOptions.forEach(productOption => {
      if (elem.category === productOption.label)
        productOption.options.push(elem);
    });
  });

  return (
    //Form with the necesary field to add a new missing product record
    //An autocomplete text input, populated with all the products names that we are fetching from the query. Required.
    //A text input for the optional comment.
    //A Radio button to mark the item as important
    <>
      <Select
        placeholder="Search for a product"
        options={groupedProductOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={handleSelectInput}
      />
    </>
  );
};

export default graphql(getProductsQuery)(AddMissingProductRecord);
