import React from "react";
import { graphql, compose } from "react-apollo";
import { getProductsQuery, getMissingProductsRecordsQuery } from "../queries";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import media from "../styles/media";

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
`

const MissingProductRecords = ({
  products: { products },
  missingProductRecords: { missingProductRecords }
}) => {
  return (
    <>
      <Container>
        {missingProductRecords &&
          missingProductRecords.map(missingProduct => (
            <MissingProductCard>
              {console.log(missingProduct)}
              <Typography variant="h6">{missingProduct.product.name}</Typography>
              <Typography variant='subtitle2'>
                Missing since: {missingProduct.dateAdded}
              </Typography>         
            </MissingProductCard>
          ))}
      </Container>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" })
)(MissingProductRecords);
