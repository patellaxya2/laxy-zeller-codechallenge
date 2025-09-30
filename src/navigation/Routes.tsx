import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { useEffect } from 'react'
import DashBoardScreen from '../screens/DashBoardScreen';
import AddNewUserScreen from '../screens/AddNewUserScreen';
import { IGetZellerCustomersResponse, StackParamList, } from '../types';
import { useQuery } from '@apollo/client/react';
import { useRealm } from '../realm/setup';
import { GET_ZELLER_CUSTOMERS } from '../graphql/queries';
import { syncZellerCustomers } from '../utils/functinos';
const Stack = createNativeStackNavigator<StackParamList>();

function Routes(): React.JSX.Element {
  const { loading, error, data } = useQuery<IGetZellerCustomersResponse>(GET_ZELLER_CUSTOMERS);
  const realm = useRealm()
  useEffect(() => {

    if (!error && !loading) {
      doSyncWithBackend()
    }
  }, [loading])


  const doSyncWithBackend = () => {
    try {
      const apiData = data?.listZellerCustomers.items || [];

      syncZellerCustomers(realm, apiData)
    } catch (error) {
      console.log("error in sync: ", error);

    }

  }

  return (
    <NavigationContainer

    >
      <Stack.Navigator initialRouteName={"Dashboard"}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Dashboard" component={DashBoardScreen} />
        <Stack.Screen name="AddNewUser" component={AddNewUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes