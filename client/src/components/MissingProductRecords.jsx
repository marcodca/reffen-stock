import React from "react";
import { graphql, compose } from "react-apollo";
import { getProductsQuery, getMissingProductsRecordsQuery } from "../queries";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import media from "../styles/media";

const Container = styled.div`
  margin-top: 35px;
  ${media.down.sm`
    margin-top: 75px
  `};
`;

const MissingProductRecords = ({
  products: { products },
  missingProductRecords: { missingProductRecords }
}) => {
  return (
    <>
      <Container>
        {missingProductRecords &&
          missingProductRecords.map(missingProduct => (

            <Paper>
              {console.log(missingProduct)}
              <Typography variant="h4">{missingProduct.product.name}</Typography>
            </Paper>
          ))}
      </Container>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" })
)(MissingProductRecords);
