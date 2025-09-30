import { gql } from "@apollo/client";

export const GET_ZELLER_CUSTOMERS = gql`
  query GetZellerCustomers {
    listZellerCustomers{
        items {       
          id 
          name
          email          
          role
        }
        nextToken
      }
  }
`;