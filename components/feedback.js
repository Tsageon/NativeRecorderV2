import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  const sendFeedbackEmail = (feedback) => {
    if (!feedback) {
      Alert.alert('Please provide feedback before submitting.');
      return;
    }
  
    MailComposer.composeAsync({
      subject: 'App Feedback',
      recipients: ['sagaetshepo@gmail.com'],
      body: feedback,
    })
      .then((result) => {
        if (result.status === 'sent') {
          console.log('Mail sent:', result);
          Alert.alert('Feedback sent successfully!');
        } else {
          console.error('Mail failed to send:', result);
          Alert.alert('Failed to send feedback. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Mail error:', error);
        Alert.alert('An error occurred while sending feedback. Please try again.');
      });
  };
  
  
  const handleSubmit = () => {
    if (!feedback) {
      Alert.alert('Please provide feedback before submitting.');
      return;
    }
    sendFeedbackEmail(feedback);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <Button title="Submit Feedback" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
});

export default FeedbackScreen;