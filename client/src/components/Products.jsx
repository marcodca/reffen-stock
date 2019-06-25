import React from "react";
import { graphql, compose } from "react-apollo";
import { getProductsQuery, getMissingProductsRecordsQuery } from "../queries";

const Products = ({
  products: { products },
  missingProductRecords: { missingProductRecords }
}) => {
  return (
    <>
      <h3>
        Here we are trying to output some data from the products!
        <ul>
          {products &&
            products.map(product => <li key={product.id}>{product.name}</li>)}
        </ul>
      </h3>
      <h3>And here from the missing products records!</h3>
      <ul>
        {missingProductRecords &&
          missingProductRecords.map(missingProductRecord => (
            <div key={missingProductRecord.id}>
              <li>name: {missingProductRecord.product.name}</li>
              <li>Date addedL: {missingProductRecord.dateAdded}</li>
              {missingProductRecord.comment && (
                <li>{missingProductRecord.comment}</li>
              )}
              {missingProductRecord.markedAsImportant && <li>Is important</li>}
              <li>---</li>
            </div>
          ))}
      </ul>
    </>
  );
};

export default compose(
  graphql(getProductsQuery, { name: "products" }),
  graphql(getMissingProductsRecordsQuery, { name: "missingProductRecords" })
)(Products);
