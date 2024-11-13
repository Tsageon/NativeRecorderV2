import 'react-native-gesture-handler'; 
import React, { useState, useEffect, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, Button, StatusBar, Text, StyleSheet, Alert } from 'react-native';
import { registrationScreen } from './components/Registration';
import { LoginScreen } from './components/Login';
import FeedbackScreen from './components/feedback';
import RecordingsScreen from './components/Recording';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Stack = createStackNavigator();

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('Error caught in ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <FeedbackScreen />;
    }

    return this.props.children;  
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    const user = {}; 
    await AsyncStorage.setItem('user', JSON.stringify(user)); 
    setIsLoggedIn(true);
  };
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => (
            <ErrorBoundary>
              <HomeScreen {...props} isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
            </ErrorBoundary>
          )}
        </Stack.Screen>
        <Stack.Screen name="Registration" component={registrationScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen
          name="Recordings"
          component={RecordingsScreen}
          options={{ title: 'Recordings' }}
        />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation, isLoggedIn, handleLogin }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <Text style={styles.title}>Welcome to Generic Recorder</Text>

    <View style={styles.buttonContainer}>
      <Button title="Go to Registration" onPress={() => navigation.navigate('Registration')} />
    </View>
    <View style={styles.buttonContainer}>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        title="Go to Recordings"
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate('Recordings');
          } else {
            Alert.alert('Access Denied', 'Please log in to access recordings.');
          }
        }}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        title="Send Feedback"
        onPress={() => navigation.navigate('Feedback')}  
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: 200,
    marginBottom: 15,
    borderRadius: 20,
  },
});