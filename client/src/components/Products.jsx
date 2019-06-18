import React from "react";
import { graphql, compose } from "react-apollo";
import { getProductsQuery, getMissingProductsRecordsQuery } from "../queries";

const Products = ({products : {products}, missingProductRecords :{missingProductRecords}}) => {
    console.log(products)
    console.log(missingProductRecords)
  return (
    <>
      <h3>
        Here we are trying to output some data from the products!
        <ul>
          {products &&
            products.map(product => (
              <li key={product.id}>{product.name}</li>
            ))}
        </ul>
      </h3>
      <h3>
        And here from the missing products records!
        <ul>
          {missingProductRecords &&
            missingProductRecords.map(missingProductRecord => (
              <li key={missingProductRecord.id}>{missingProductRecord.product.name}</li>
            ))
            }
        </ul>
      </h3>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" })
)(Products);
