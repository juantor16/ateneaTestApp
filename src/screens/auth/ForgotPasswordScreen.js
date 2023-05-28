import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotPasswordScreen(props) {
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleVerifyUser = async (username, email) => {
    try {
      const jsonData = await AsyncStorage.getItem("@users");
      let users = jsonData != null ? JSON.parse(jsonData) : [];

      const user = users.find(
        (user) => user.username === username && user.email === email
      );

      if (user) {
        setShowNewPasswordField(true);
        setErrorMessage(null);
      } else {
        setErrorMessage("No user found with provided username and email");
      }
    } catch (e) {
      setErrorMessage(e);
    }
  };

  const handleResetPassword = async (username, email, newPassword) => {
    try {
      const jsonData = await AsyncStorage.getItem("@users");
      let users = jsonData != null ? JSON.parse(jsonData) : [];

      let userIndex = users.findIndex(
        (user) => user.username === username && user.email === email
      );
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        await AsyncStorage.setItem("@users", JSON.stringify(users));
        setErrorMessage(null);
        Alert.alert("Success", "Password reset successfully", [
          {
            text: "OK",
            onPress: () => props.navigation.navigate("Login"),
          },
        ]);
      } else {
        setErrorMessage("No user found with provided username and email");
      }
    } catch (e) {
      setErrorMessage(e.toString());
    }
  };

  // This schema defines the validation rules for each field
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .max(15, "Username must be at most 15 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    newPassword: Yup.string()
      .min(4, "New password must be at least 4 characters")
      .max(15, "New password must be at most 15 characters")
      .matches(
        /(?=.*[0-9])(?=.*[!@#$%^&*])/g,
        "New password must contain a number and a special character"
      )
      .required("New password is required"),
  });

  return (
    <Formik
      initialValues={{ username: "", email: "", newPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleResetPassword(values.username, values.email, values.newPassword)
      }
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            testID="username_input"
          />
          {touched.username && errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            testID="email_input"
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}
          <Button
            title="Verify User"
            onPress={() => handleVerifyUser(values.username, values.email)}
            testID="verifyUser_button"
          />
          {showNewPasswordField && (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                value={values.newPassword}
                secureTextEntry
                testID="newPassword_input"
              />
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword}</Text>
              )}
              <Button
                title="Reset Password"
                onPress={handleSubmit}
                testID="resetPassword_button"
              />
            </>
          )}
          {errorMessage && <Text testID="error_text">{errorMessage}</Text>}
        </View>
      )}
    </Formik>
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
