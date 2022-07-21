import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import TabNavigator from "./app/navigation/tabNavigator";

import { useNetInfo } from "@react-native-community/netinfo";
import NoNet from "./app/components/screen/noNet";

const CUSTOM_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "white" },
};

const App = () => {
  const [notInternet, setNoInternet] = useState(false);
  const netInfo = useNetInfo();

  const fetchNetInfo = () => {
    const { isConnected, isInternetReachable } = netInfo;
    if (isConnected === false && isInternetReachable === false) {
      setNoInternet(true);
    } else {
      setNoInternet(false);
    }
  };

  useEffect(() => {
    fetchNetInfo();
  }, [netInfo]);

  if (notInternet) return <NoNet onRefresh={fetchNetInfo} />;
  return (
    <NavigationContainer theme={CUSTOM_THEME}>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
