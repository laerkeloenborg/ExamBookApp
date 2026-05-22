import { useState } from 'react';
import Login from './components/pages/Login';
import Profile from './components/pages/Profile';
import Home from './components/pages/Home'
import AddBook from './components/pages/AddBook'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

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
          headerShown: false,
          
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
          component={Home}
        />

        <Tab.Screen
          name="Book"
          component={AddBook}
        />

        <Tab.Screen name="Profile">
          {() => (
            <Profile onLogout={() => setLoggedIn(false)} />
          )}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  )

}

