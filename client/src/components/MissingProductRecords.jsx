import React, { useState, useEffect } from "react";
import { graphql, compose } from "react-apollo";
import {
  getProductsQuery,
  getMissingProductsRecordsQuery,
  deleteMissingProductRecord
} from "../queries";
import styled from "styled-components/macro";
import media from "../styles/media";
import { bars } from "../utlis";

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

const MissingProductCard = styled(Paper)`
  width: 90%;
  padding: 3%;
  margin: 4% auto;
`;

const MissingProductRecords = ({
  products: { products },
  missingProductRecords: { missingProductRecords },
  deleteMissingProductRecord,
  setOpenSnackbar
}) => {
  const [selectBar, setSelectBar] = useState("All bars");

  //

  const missingProductRecordsByBar =
    selectBar === "All bars"
      ? missingProductRecords
      : missingProductRecords.filter(record => {
          return record.product.availableInBars.includes(selectBar);
        });

  const handleDeleteMissingProductRecord = id => {
    deleteMissingProductRecord({
      variables: {
        missingProductRecordId: id
      },
      //refetch the get Missing Product Records query
      refetchQueries: [{ query: getMissingProductsRecordsQuery }]
    }).then(
      ({
        data: { deleteMissingProductRecord: deleteMissingProductRecord }
      }) => {
        setOpenSnackbar({
          value: true,
          message: `${deleteMissingProductRecord.product.name} is in stock now`
        });
      }
    );
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
          <Typography variant='button'>Show missing products for:</Typography>
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

        {missingProductRecordsByBar &&
          missingProductRecordsByBar.map(missingProduct => (
            <MissingProductCard key={missingProduct.id}>
              <Typography variant="h6">
                {missingProduct.product.name}
              </Typography>
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
                    {missingProduct.dateAdded}
                  </Typography>

                  {missingProduct.comment && (
                    <Typography
                      variant="subtitle1"
                      css={`
                        ${media.down
                          .sm`display: flex; flex-direction: column; width: 33%; text-align : center;`}
                      `}
                    >
                      <b>Comment: </b> {missingProduct.comment}
                    </Typography>
                  )}
                  <Button
                    onClick={() => {
                      handleDeleteMissingProductRecord(missingProduct.id);
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
            </MissingProductCard>
          ))}
      </Container>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" }),
  graphql(deleteMissingProductRecord, { name: "deleteMissingProductRecord" })
)(MissingProductRecords);
