import React, { useState, useEffect, useRef } from "react";
import { graphql, compose } from "react-apollo";
import {
  getProductsQuery,
  getMissingProductsRecordsQuery,
  deleteMissingProductRecord
} from "../queries";
import styled from "styled-components/macro";
import media from "../styles/media";
import { bars, categories } from "../utlis";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { inStock } from "../styles/icons";

const Container = styled.div`
  width: 100%;
  margin-top: 5.5rem;
  ${media.down.sm`
    margin-top: 7.5rem;
  `};
`;

const StyledProductCard = styled(Paper)`
  width: 90%;
  padding: 3%;
  margin: 4% auto;
`;

const CategoryDisplay = ({ category, children }) => {
  const Line = () => (
    <div
      css={`
        width: 70%;
        height: 2px;
        background-color: grey;
        border-radius: 5%;
      `}
    />
  );

  return (
    <>
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 95%;
          margin: 0 auto;
        `}
      >
        <Line />
        <div
          css={`
            display: flex;
            padding: 4%;
          `}
        >
          <Typography variant="subtitle2">{category.label}</Typography>
          <img width="24" src={category.icon} alt="" />
        </div>
        <Line />
      </div>
      {children}
    </>
  );
};

let latestBarValue;

//When a missing product record is deleted (marked as in stock) the value of the selectBar gets set again to "all bars" check how to fix this with useEffect

const MissingProductRecords = ({
  missingProductRecords: { missingProductRecords },
  deleteMissingProductRecord,
  setOpenSnackbar
}) => {


  const [selectBar, setSelectBar] = useState( latestBarValue || "All bars");

  useEffect(()=>{
    latestBarValue = selectBar;
  })
  //
  const MissingProductCard = ({ missingProduct }) => {
    const {
      id,
      dateAdded,
      comment,
      product: { name }
    } = missingProduct;

    return (
      <StyledProductCard>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle2">
          <div
            css={`
              margin-top: 1%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              ${media.down.sm`align-items: baseline;`}
            `}
          >
            <Typography
              variant="subtitle1"
              css={`
                ${media.down.sm`display: flex; flex-direction: column;`}
              `}
            >
              <b>Missing since: </b>
              {dateAdded}
            </Typography>

            {comment && (
              <Typography
                variant="subtitle1"
                css={`
                  ${media.down
                    .sm`display: flex; flex-direction: column; width: 33%; text-align : center;`}
                `}
              >
                <b>Comment: </b> {comment}
              </Typography>
            )}
            <Button
              onClick={() => {
                handleDeleteMissingProductRecord(id);
              }}
              css={`
                span {
                  display: flex;
                  flex-direction: column;
                }
              `}
            >
              <img src={inStock} width={40} alt="in-stock icon" />
              <Typography variant="button">
                Mark as
                <br />
                in stock
              </Typography>
            </Button>
          </div>
        </Typography>
      </StyledProductCard>
    );
  };

  //

  const missingProductRecordsByBar =
    selectBar === "All bars"
      ? missingProductRecords
      : missingProductRecords.filter(record => {
          return record.product.availableInBars.includes(selectBar);
        });

  const missingProductRecordsByBarAndCategory = missingProductRecordsByBar
    ? missingProductRecordsByBar.reduce((acc, elem) => {
        if (!(elem.product.category in acc)) acc[elem.product.category] = [];
        acc[elem.product.category].push(elem);
        return acc;
      }, {})
    : null;

  const handleDeleteMissingProductRecord = id => {
    deleteMissingProductRecord({
      variables: {
        missingProductRecordId: id
      },
      //refetch the get Missing Product Records query
      refetchQueries: [{ query: getMissingProductsRecordsQuery }]
    }).then(({ data: { deleteMissingProductRecord } }) => {
      setOpenSnackbar({
        value: true,
        message: `${deleteMissingProductRecord.product.name} is in stock now`
      });
    });
  };

  return (
    <>
      <Container>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: baseline;
          `}
        >
          <Typography variant="button">Show missing products for:</Typography>
          <Select
            css={`
              margin-left: 0.75rem;
            `}
            value={selectBar}
            onChange={event => {
              setSelectBar(event.target.value);
              return;
            }}
          >
            <MenuItem value={"All bars"}>All bars</MenuItem>
            {bars.map((bar, index) => (
              <MenuItem key={index} value={bar}>
                {bar}
              </MenuItem>
            ))}
          </Select>
        </div>

        {missingProductRecordsByBarAndCategory &&
          Object.keys(missingProductRecordsByBarAndCategory).map(
            (category, index) => {
              const [productCat] = categories.filter(elem => {
                return elem.label === category;
              });

              return (
                <CategoryDisplay category={productCat} key={index}>
                  {missingProductRecordsByBarAndCategory[category].map(
                    (missingProduct, index) => (
                      <MissingProductCard missingProduct={missingProduct} key={index} />
                    )
                  )}
                </CategoryDisplay>
              );
            }
          )}
      </Container>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" }),
  graphql(deleteMissingProductRecord, { name: "deleteMissingProductRecord" })
)(MissingProductRecords);
