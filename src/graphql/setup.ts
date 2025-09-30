import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";


const awsconfig = {
    aws_appsync_graphqlEndpoint:
      "https://prrwjjssnvhpbcdwbcwx3nm3zm.appsync-api.ap-southeast-2.amazonaws.com/graphql",
    aws_appsync_region: "ap-southeast-2",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: "da2-d46dkkw5xnfbxkxkhi6twfb7re",
  };
    

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: awsconfig.aws_appsync_graphqlEndpoint,
    headers: {
        "x-api-key": awsconfig.aws_appsync_apiKey,
      },
  }),
});

export default client;
