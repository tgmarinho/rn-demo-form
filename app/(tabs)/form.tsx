import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(2, "Mobile must be at least 2 characters"),
  ssn: z.string().min(2, "SSN must be at least 2 characters"),
  confirmSsn: z.string().min(2, "Confirm SSN must be at least 2 characters"),
  contactEmergencyName: z
    .string()
    .min(2, "Emergency contact name must be at least 2 characters"),
  contactEmergencyMobile: z
    .string()
    .min(2, "Emergency contact mobile must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(2, "Address must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function FormScreen2() {
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<keyof FormValues, number>>(
    {} as Record<keyof FormValues, number>
  );
  const inputRefs = useRef<Record<keyof FormValues, TextInput | null>>(
    {} as Record<keyof FormValues, TextInput | null>
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onLayout = (name: keyof FormValues) => (e: LayoutChangeEvent) => {
    positions.current[name] = e.nativeEvent.layout.y;
  };

  const onInvalid = () => {
    const firstErrorField = Object.keys(errors)[0] as keyof FormValues;
    const y = positions.current[firstErrorField];

    if (typeof y === "number" && scrollRef.current) {
      scrollRef.current.scrollTo({ y: y - 150, animated: true });
    }

    const inputRef = inputRefs.current[firstErrorField];
    if (inputRef) {
      setTimeout(() => {
        inputRef.focus();
      }, 300);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          {/* Espaço para o "header" com margem superior */}
          <View style={styles.header} />
          {(
            [
              "firstName",
              "lastName",
              "email",
              "mobile",
              "ssn",
              "confirmSsn",
              "contactEmergencyName",
              "contactEmergencyMobile",
              "address",
              "city",
              "password",
            ] as (keyof FormValues)[]
          ).map((field) => (
            <View
              key={field}
              onLayout={onLayout(field)}
              style={styles.inputContainer}
            >
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <Controller
                control={control}
                name={field}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[field] = ref;
                    }}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={field === "password"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    style={[styles.input, errors[field] && styles.inputError]}
                    placeholderTextColor="#999"
                  />
                )}
              />
              {errors[field] && (
                <Text style={styles.errorText}>{errors[field]?.message}</Text>
              )}
            </View>
          ))}
          {/* Espaço para o "footer" com margem inferior */}
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={handleSubmit(onSubmit, onInvalid)}
            />
          </View>
          <View style={styles.footer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    backgroundColor: "#fff",
    paddingBottom: 40, // Margem inferior aumentada
  },
  header: {
    height: 60, // Margem superior como espaço vazio
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    height: 60, // Margem inferior como espaço vazio
    backgroundColor: "#fff",
  },
});
