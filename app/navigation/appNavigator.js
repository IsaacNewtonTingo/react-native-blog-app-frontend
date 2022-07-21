import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import PostDetail from "../components/screen/postDetail";
import Home from "../components/screen/home";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerShadowVisible: false,
          headerLeft: (props) => (
            <TouchableWithoutFeedback onPress={navigation.goBack} {...props}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
        name="PostDetail"
        component={PostDetail}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
