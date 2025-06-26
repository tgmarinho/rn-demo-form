import ParallaxScrollView from "@/components/ParallaxScrollView";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
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
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(2),
  ssn: z.string().min(2),
  confirmSsn: z.string().min(2),
  contactEmergencyName: z.string().min(2),
  contactEmergencyMobile: z.string().min(2),
  password: z.string().min(6),
  address: z.string().min(2),
  city: z.string().min(2),
});
type FormValues = z.infer<typeof schema>;

export default function FormScreen2() {
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<keyof FormValues, number>>(
    {} as Record<keyof FormValues, number>
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
    const first = Object.keys(errors)[0] as keyof FormValues;
    const y = positions.current[first];
    if (typeof y === "number") {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20 }}
      >
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
            style={{ marginBottom: 20 }}
          >
            <Text>{field}</Text>
            <Controller
              control={control}
              name={field}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={field === "password"}
                  style={{
                    borderWidth: 1,
                    borderColor: errors[field] ? "red" : "#ccc",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              )}
            />
            {errors[field] && (
              <Text style={{ color: "red" }}>{errors[field]?.message}</Text>
            )}
          </View>
        ))}
        <Button title="Submit" onPress={handleSubmit(onSubmit, onInvalid)} />
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
