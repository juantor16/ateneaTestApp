import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("@users");
      let users = jsonData != null ? JSON.parse(jsonData) : [];

      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        setErrorMessage(null);
        props.navigation.navigate("Home");
      } else {
        setErrorMessage("Username or password is incorrect");
      }
    } catch (e) {
      setErrorMessage(e.toString());
    }
  };

  const handleForgotPassword = () => {
    props.navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    props.navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        testID="username_input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
        testID="password_input"
      />
      {errorMessage && (
        <Text style={styles.error} testID="errorMessage_text">
          {errorMessage}
        </Text>
      )}
      <Button title="Log In" onPress={handleLogin} testID="logIn_button" />
      <Button
        title="Forgot Password?"
        onPress={handleForgotPassword}
        testID="forgotPassword_button"
      />
      <Button title="Don't have an account? Sign Up" onPress={handleSignUp} testID="signUp_button" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    textAlign: "center",
    color: "red",
  },
});
