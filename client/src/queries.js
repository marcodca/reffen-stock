import { gql } from "apollo-boost";

export const addProductMutation = gql`
  mutation(
    $name: String!
    $category: String!
    $availableInBars: [String]!
    $description: String
  ) {
    addProduct(
      name: $name
      category: $category
      availableInBars: $availableInBars
      description: $description
    ) {
      id
      name
      category
    }
  }
`;

export const getProductsQuery = gql`
  {
    products {
      name
      category
      availableInBars
      id
    }
  }
`;

export const getMissingProductsRecordsQuery = gql`
  {
    missingProductRecords {
      id
      dateAdded
      comment
      markedAsImportant
      product {
        name
        category
        availableInBars
        description
      }
    }
  }
`;
