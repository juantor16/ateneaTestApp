import React from "react";
import { Button, TextInput, View, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (values) => {
  try {
    const jsonData = await AsyncStorage.getItem("@users");
    let users = jsonData != null ? JSON.parse(jsonData) : [];

    for (let user of users) {
      if (user.username === values.username || user.email === values.email) {
        throw "Username or Email already exists";
      }
    }

    users.push(values);
    await AsyncStorage.setItem("@users", JSON.stringify(users));
  } catch (e) {
    throw e;
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
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .max(15, "Password must be at most 15 characters")
    .matches(
      /(?=.*[0-9])(?=.*[!@#$%^&*])/g,
      "Password must contain a number and a special character"
    )
    .required("Password is required"),
});

export default function SignUpScreen(props) {
  const [error, setError] = React.useState(null);

  const handleSignUp = (values) => {
    console.log(values);
    storeData(values)
      .then(() => {
        props.navigation.navigate("Login"); // Navigate to the Login screen
      })
      .catch((error) => {
        // Handle error here. Show an error message to the user
        setError(error);
        console.log(error);
      });
  };

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSignUp}
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
            placeholder="Username"
            style={styles.input}
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            testID="username_input"
          />
          {touched.username && errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            testID="email_input"
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry
            testID="password_input"
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            onPress={() => {
              setError(null);
              handleSubmit();
            }}
            title="Sign Up"
            testID="submit_button"
          />
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
