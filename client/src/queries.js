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
      description
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
      description
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
        id
        name
        category
        availableInBars
        description
      }
    }
  }
`;

export const addMissingProductRecordMutation = gql`
  mutation($productId: ID!, $markedAsImportant: Boolean!, $comment: String) {
    addMissingProductRecord(
      productId: $productId
      markedAsImportant: $markedAsImportant
      comment: $comment
    ) {
      id
      dateAdded
      comment
      markedAsImportant
      product {
        id
        name
        category
        availableInBars
        description
      }
    }
  }
`;

export const deleteMissingProductRecord = gql`
mutation($missingProductRecordId: ID!) {
  deleteMissingProductRecord(id: $missingProductRecordId){
    id
    product{
      id
      name
    }
  }
}
`;
