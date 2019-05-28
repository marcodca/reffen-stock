import React from 'react';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getProductsQuery = gql`
{
    products{
      name
      category
      availableInBars
      id
    }
  }
`

const Products = (props) => {
    console.log(props);
    return (
        <h3>
            Here we are trying to outpeut some date from the products!
        </h3>
    )
}

export default graphql(getProductsQuery)(Products);
