import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { compose, graphql } from "react-apollo";
import styled from "styled-components/macro";
import { deleteMissingProductRecord, getMissingProductsRecordsQuery, getProductsQuery } from "../queries";
import { exclamationMark, inStock } from "../styles/icons";
import media from "../styles/media";
import { bars, categories } from "../utlis";


const Container = styled.div`
  width: 100%;
  margin-top: 4rem;
  ${media.down.sm`
    margin-top: 5.8rem;
  `};
`;

const StyledProductCard = styled(Paper)`
  width: 90%;
  padding: 3%;
  margin: 4% auto;
`;

const ImportantProductsDisplay = ({ products }) => {

  return (
    <Box
      css={`
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={`
          display: flex;
        `}
      >
        <img width={24} src={exclamationMark} alt="" css={`margin-right: 4px;`}/>
        <Typography variant='h6'> Highlights:</Typography>
      </div>

      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 7px;
        `}
      >
        {products.map(product => (
          <Box
            key={product.id}
            fontSize={18}
            css={`
              padding: 5px;
              margin: 3px;
              background: rgba(22, 53, 204, 0.25);
              border-radius: 4%;
            `}
          >
            {product.product.name}
          </Box>
        ))}
      </div>
    </Box>
  );
};

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

//A reference outside the functional component that lets keep the track of the last bar that was selected
let latestBarValue;

const MissingProductRecords = ({
  missingProductRecords: { missingProductRecords },
  deleteMissingProductRecord,
  setOpenSnackbar,
  openDrawer
}) => {
  const [selectBar, setSelectBar] = useState(latestBarValue || "All bars");

  useEffect(() => {
    latestBarValue = selectBar;
  }, [selectBar]);
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

  const importantProducts = missingProductRecordsByBar
    ? Object.values(missingProductRecordsByBar).filter(
        productRecord => productRecord.markedAsImportant
      )
    : [];

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

        {Boolean(importantProducts.length) && (
          <ImportantProductsDisplay products={importantProducts} />
        )}

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
                      <MissingProductCard
                        missingProduct={missingProduct}
                        key={index}
                      />
                    )
                  )}
                </CategoryDisplay>
              );
            }
          )}
        <Hidden smUp implementation="css">
          <div
            css={`
              display: flex;
              justify-content: center;
            `}
          >
            <Button
              css={`
                margin-bottom: 1rem;
                background-color: lightblue;
                padding: 9px 11px;
              `}
              onClick={openDrawer}
            >
              Report new missing product
            </Button>
          </div>
        </Hidden>
      </Container>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" }),
  graphql(deleteMissingProductRecord, { name: "deleteMissingProductRecord" })
)(MissingProductRecords);
