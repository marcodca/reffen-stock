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

const Products = ({data}) => {
    console.log(data);
    return (
        <h3>
            Here we are trying to output some date from the products!
            <ul>
                {data.products && data.products.map( product => <li key={product.id}>{product.name}</li>)}
            </ul>

        </h3>
    )
}

export default graphql(getProductsQuery)(Products);
