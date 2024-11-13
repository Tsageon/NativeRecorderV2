# Generic Recorder App

A mobile application that allows users to register, log in, and access recordings. The app provides a navigation flow that includes user registration, login, feedback submission, and recordings access. 

## Features

- **User Authentication**
  - Registration: Users can create an account by providing their details.
  - Login: Existing users can log in to access the app's features.
  
- **Recordings Screen**
  - View recordings once logged in.

- **Error Handling**
  - An error boundary is implemented to catch runtime errors in the app and display a feedback screen if something goes wrong.

- **Feedback Screen**
  - Users can send feedback when they experience issues or bugs.

- **Navigation**
  - **Home**: The main screen with options to navigate to Registration, Login, Recordings, and Feedback screens.
  - **Registration**: A form to register a new user.
  - **Login**: A form to log in an existing user.
  - **Recordings**: Displays the recordings once the user logs in.
  - **Feedback**: Allows users to submit feedback.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tsageon/generic-recorder.git

2. install the dependecies:
   ```bash
   npm install

3. Run it and pray that it works:
   ```bash
   npx expo start    