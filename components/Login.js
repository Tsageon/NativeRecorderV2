import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return;
    }
    await AsyncStorage.setItem('email', email);
    console.log('Logged in with:', email, password);
    navigation.navigate('Recordings');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A8A8A8"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A8A8A8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button style={styles.button} title="Login" onPress={handleLogin}  />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    color: '#333', 
    fontWeight: 'bold',
    marginBottom: 25, 
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: 280,
    borderColor: 'royalblue',
    borderWidth: 1,
    borderRadius: 5, 
    backgroundColor: '#ffffff', 
    marginBottom: 10,
    paddingHorizontal: 12,
    color: 'black',
  },
  link: {
    color: '#1a73e8', 
    fontWeight: '500', 
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});