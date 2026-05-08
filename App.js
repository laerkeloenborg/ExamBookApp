import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Modal } from 'react-native';
import { useState } from 'react';
import { database, storage } from './firebase'
import Login from './components/Login';
import Books from './components/Books';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth, signOut } from "firebase/auth";

const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <Login onLogin={() => setLoggedIn(true)}></Login>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline"
            }
            else if (route.name === "Book") {
              iconName = focused ? "book" : "book-outline"
            }
            else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline"
            }

            return (
              <Ionicons name={iconName} size={size} color={color} />
            )
          },

          tabBarActiveTintColor: "#254F50",
          tabBarInactiveTintColor: "gray"
        })}
      >

        <Tab.Screen
          name="Home"
          component={HomePage}
        />

        <Tab.Screen
          name="Book"
          component={AddBookPage}
        />

        <Tab.Screen name="Profile">
          {() => (
            <ProfilePage onLogout={() => setLoggedIn(false)} />
          )}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  )

}

function HomePage() {
  return (
    <View>
      <Text>Hej</Text>
    </View>
  )
}


function AddBookPage() {
  return (
    <Books />
  )
}


function ProfilePage({ onLogout }) {

  async function logout() {
    await signOut(getAuth());
    onLogout();
  }

  return (
    <View>
      <Text>Logout</Text>

      <Button title="Logout" onPress={logout} />
    </View>
  )
}