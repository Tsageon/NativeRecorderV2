import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Mailer from 'react-native-mail';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  const sendFeedbackEmail = (feedback) => {
    Mailer.mail({
      subject: 'App Feedback',
      recipients: ['sagaetshepo@gmail.com'],
      body: feedback,
      isHTML: false,
    }, (error, event) => {
      if (error) {
        console.error('Mail error:', error);
        Alert.alert('Failed to send feedback. Please try again.');
      } else {
        console.log('Mail sent:', event);
        Alert.alert('Feedback sent successfully!');
        setFeedback(''); 
      }
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