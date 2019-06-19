import React, { useState } from "react";
import Select from "react-select";
import {
  getProductsQuery,
  addMissingProductRecordMutation,
  getMissingProductsRecordsQuery
} from "../queries";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import { categories } from "../utlis";
import { exclamationMark } from "../styles/icons";

import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

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
  color: #172b4d;
  display: inline-block;
  font-size: 12;
  font-weight: normal;
  line-height: 1;
  min-width: 1;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;

const ExclamationMarkIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 5px;
  filter: ${props => (props.isChecked ? "contrast(100%)" : "contrast(0%)")};
`;

//

//A componenent for the the categories info display in the select input
const formatGroupLabel = ({ label, icon, options }) => (
  <StyledGroup>
    <CategoryInfo>
      <CategoryIcon src={icon} />
      <div>{label}</div>
    </CategoryInfo>
    <StyledCategoryBadge>{options.length}</StyledCategoryBadge>
  </StyledGroup>
);

//

const AddMissingProductRecord = ({
  products: { products },
  addNewMissingProductRecord
}) => {
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

  //Select Input

  const [selectInput, setSelectInput] = useState(null);

  const handleSelectInput = e => {
    const { value } = e;
    console.log(value)
    setSelectInput(value);
  };

  //Comment input
  const [commentInput, setCommentInput] = useState("");

  const handleCommentInput = e => {
    const { value } = e.target;
    setCommentInput(value);
  };

  //Mark as important radio input

  const [isImportant, setIsImportant] = useState(false);

  const handleIsImportantInput = () => {
    setIsImportant(!isImportant);
  };

  const IsImportantLabel = (
    <span
      style={{
        display: "inline-flex",
        alignContent: "center"
      }}
    >
      <ExclamationMarkIcon src={exclamationMark} isChecked={isImportant} />
      <span>Highlight record</span>
    </span>
  );

  //Handle report new missing product

  const handleReportNewMissingProductRecord = () => {
    //Extract the values
    const productId = selectInput,
    markedAsImportant = isImportant,
    comment = commentInput.trim();

    addNewMissingProductRecord({
      variables: {
        productId,
        markedAsImportant,
        comment
      },
      //refetch the get Missing Product Records query
      refetchQueries: [{ query: getMissingProductsRecordsQuery }]
    });
    //Clear the input values
    setSelectInput(null);
    setCommentInput("");
    setIsImportant(false);
  };

  return (
    //Form with the necesary field to add a new missing product record
    //An autocomplete text input, populated with all the products names that we are fetching from the query. Required.
    //A text input for the optional comment.
    //A Radio button to mark the item as important
    <form>
      <Select
        placeholder="Search for a product"
        options={groupedProductOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={handleSelectInput}
        value={selectInput ? undefined : "" }
      />

      <TextField
        style={{ zIndex: "-0" }}
        label="Comment"
        margin="normal"
        variant="outlined"
        onChange={handleCommentInput}
        value={commentInput}
      />
      <FormControlLabel
        style={{
          alignContent: "center"
        }}
        control={
          <Switch
            checked={isImportant}
            onChange={handleIsImportantInput}
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        }
        label={IsImportantLabel}
        labelPlacement="start"
      />
      <Button
        disabled={selectInput ? false : true}
        onClick={handleReportNewMissingProductRecord}
      >
        Report new missing product
      </Button>
      <Button>Cancel</Button>
    </form>
  );
};
export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(addMissingProductRecordMutation, {
    name: "addNewMissingProductRecord"
  })
)(AddMissingProductRecord);
