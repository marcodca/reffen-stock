import React from 'react';
import { graphql } from 'react-apollo';
import { getProductsQuery } from '../queries';

const Products = ({data}) => {
    console.log(data)
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
