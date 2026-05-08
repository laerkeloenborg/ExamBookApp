import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function App() {
   
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions= {({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName

            if(route.name === "Home"){
              iconName = focused ? "home" : "home-outline"
            }
            else if(route.name === "Book"){
              iconName = focused ? "book" : "book-outline"
            }
            else if(route.name === "Profile"){
              iconName = focused ? "person" : "person-outline"
            }

            return (
              <Ionicons name={iconName} size={size} color={color}/>
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

        <Tab.Screen
          name="Profile"
          component={ProfilePage}
        />

      </Tab.Navigator>
    </NavigationContainer>
  )

}

function HomePage(){
  return(
     <View>
      <Text>Hej</Text>
    </View>
  )
}

function AddBookPage(){
  return (
    <View>
      <Text>Med</Text>
    </View>
  )
}

function ProfilePage(){
  return (
     <View>
      <Text>Dig</Text>
    </View>
  )
}