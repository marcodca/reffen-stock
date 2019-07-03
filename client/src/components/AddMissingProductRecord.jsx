import React, { useState } from "react";
import Select from "react-select";
import {
  getProductsQuery,
  addMissingProductRecordMutation,
  getMissingProductsRecordsQuery
} from "../queries";
import { graphql, compose } from "react-apollo";
import styled from "styled-components/macro";
import { categories } from "../utlis";
import { exclamationMark } from "../styles/icons";

import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

//Styled-Components

const Container = styled.div`
  width: 90%;
  padding: 3%;
  margin: 0 auto;
  margin-top: 2em;
`;

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
  addNewMissingProductRecord,
  onClose,
  openAddProductDialog
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
    setSelectInput(value);
  };

  //Product description
  const ProductDescriptionDisplay = styled.div``;

  //Comment input
  const [commentInput, setCommentInput] = useState("");

  const handleCommentInput = e => {
    let { value } = e.target;

    value = value.length < 50 ? value : value.slice(0, 50);

    setCommentInput(value);
  };

  //Mark as important radio input

  const [isImportant, setIsImportant] = useState(false);

  const handleIsImportantInput = () => {
    setIsImportant(!isImportant);
  };

  const IsImportantLabel = (
    <span
      css={`
        display: inline-flex;
        align-content: center;
      `}
    >
      <ExclamationMarkIcon
        src={exclamationMark}
        isChecked={isImportant}
        css={`
          position: relative;
          top: 9px;
          left: 17px;
        `}
      />
      <span
        css={`
          text-align: center;
        `}
      >
        Highlight record
      </span>
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
    //We clear the inputs and close, calling cancel functionality
    handleCancel();
  };

  const handleCancel = () => {
    //Clear the input values
    setSelectInput(null);
    setCommentInput("");
    setIsImportant(false);
    //close the drawer on mobile
    onClose && onClose();
  };

  //message to be displayed when there are no options in the slect input
  const noOptionsMessage = () => (
    <span>
      No matchs, try{" "}
      <span
        css={`
          font-weight: bold;
        `}
        onClick={openAddProductDialog}
      >
        creating a new product
      </span>
    </span>
  );

  const [selectedProduct] = products
    ? products.filter(product => product.id === selectInput)
    : [""];

  return (
    <Container>
      <Typography
        variant="h5"
        align="center"
        css={`
          margin-bottom: 1em;
        `}
      >
        Report new missing product
      </Typography>
      <Select
        placeholder="Search for a product"
        options={groupedProductOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={handleSelectInput}
        value={selectInput ? undefined : ""}
        noOptionsMessage={noOptionsMessage}
      />
      <ProductDescriptionDisplay>
        {selectedProduct && selectedProduct.description && (
          <span
            css={`
              margin-top: 0.5em;
              margin-left: 2px;
            `}
          >
            <span
              css={`
                font-weight: bold;
              `}
            >
              Description:
            </span>
            {" " + selectedProduct.description}
          </span>
        )}
      </ProductDescriptionDisplay>
      <TextField
        style={{ zIndex: "-0" }}
        label="Optional comment"
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
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={openAddProductDialog}>Create new product</Button>
    </Container>
  );
};
export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(addMissingProductRecordMutation, {
    name: "addNewMissingProductRecord"
  })
)(AddMissingProductRecord);
