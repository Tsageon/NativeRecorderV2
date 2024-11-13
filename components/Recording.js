import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecordingsScreen({ navigation }) {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState(null);
  const [newRecordingName, setNewRecordingName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail);
      if (storedEmail) {
        loadRecordings(storedEmail);
      }
    };
    fetchEmail();
  }, []);

  async function loadRecordings(email) {
    const storedRecordings = await AsyncStorage.getItem(email) || '[]';
    setRecordings(JSON.parse(storedRecordings));
  }

  async function startRecording() {
    if (!newRecordingName) {
      Alert.alert('Enter a name for the recording');
      return;
    }
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newRecording = {
        id: Date.now().toString(),
        name: newRecordingName, 
        uri,
        date: new Date().toLocaleString(),
      };
      setRecording(null);
      setNewRecordingName(''); 
      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);
      await AsyncStorage.setItem(email, JSON.stringify(updatedRecordings));
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  async function handleRecording() {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  async function playRecording(recording) {
    const { sound } = await Audio.Sound.createAsync({ uri: recording.uri });
    await sound.playAsync();
  }

  async function deleteRecording(id) {
    const updatedRecordings = recordings.filter((rec) => rec.id !== id);
    setRecordings(updatedRecordings);
    await AsyncStorage.setItem(email, JSON.stringify(updatedRecordings));
  }

  const filteredRecordings = recordings.filter((rec) =>
    rec.date.includes(searchTerm)
  );

  const renderItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>{item.name} - {item.date}</Text>
      <View style={styles.recordingButtons}>
        <TouchableOpacity style={styles.playButton} onPress={() => playRecording(item)}>
          <Icon name="play" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecording(item.id)}>
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('email');
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by date"
        placeholderTextColor="#888"
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      {!isRecording && (
        <TextInput
          placeholder="Enter recording name"
          placeholderTextColor="#888"
          onChangeText={setNewRecordingName}
          value={newRecordingName}
          style={styles.nameInput}
        />
      )}
      <TouchableOpacity style={styles.recordButton} onPress={handleRecording}>
        <Icon name={isRecording ? "stop" : "microphone"} size={24} color="#fff" />
        <Text style={styles.recordButtonText}>{isRecording ? "Stop Recording" : "New Voice Note"}</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredRecordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.recordingsList}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    padding: 20,
  },
  searchInput: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'royalblue',
    borderRadius: 10,
    color: '#fff',
    backgroundColor: 'white',
  },
  nameInput: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'royalblue',
    borderRadius: 10,
    color: '#fff',
    backgroundColor: 'white',
  },
  recordButton: {
    backgroundColor: '#F94144',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  recordingsList: {
    marginTop: 15,
  },
  recordingItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  recordingText: {
    color: 'black',
    fontSize: 14,
    marginBottom: 10,
  },
  recordingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: 'grey',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
