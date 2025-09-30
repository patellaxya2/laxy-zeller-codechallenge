/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import '@babel/polyfill';
import React, { } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApolloProvider, } from '@apollo/client/react';
import client from './src/graphql/setup';
import Routes from './src/navigation/Routes';
import { enableScreens } from 'react-native-screens';

import { RealmProvider, } from './src/realm/setup';

enableScreens();


function App(): React.JSX.Element {

  return (
    <ApolloProvider client={client}>
      <RealmProvider>
        <SafeAreaProvider>
          <Routes />
        </SafeAreaProvider>
      </RealmProvider>
    </ApolloProvider>
  );
}



export default App;
