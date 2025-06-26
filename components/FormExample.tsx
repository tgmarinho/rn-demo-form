import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

// Definindo o esquema de validação com Zod
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "O primeiro nome deve ter pelo menos 2 caracteres"),
    lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Por favor, insira um e-mail válido"),
    ssn: z
      .string()
      .min(9, "SSN deve ter pelo menos 9 dígitos")
      .max(11, "SSN deve ter no máximo 11 dígitos"),
    mobile: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
    confirmSsn: z.string(),
    contactEmergencyName: z
      .string()
      .min(2, "Nome do contato de emergência deve ter pelo menos 2 caracteres"),
    contactEmergencyMobile: z
      .string()
      .min(10, "Telefone de emergência deve ter pelo menos 10 dígitos"),
  })
  .refine((data) => data.ssn === data.confirmSsn, {
    message: "SSN e confirmação de SSN devem ser iguais",
    path: ["confirmSsn"],
  });

// Tipo inferido do esquema
type FormData = z.infer<typeof formSchema>;

const FormExample: React.FC = () => {
  // Ref para o ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  // Refs para cada campo de input
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const ssnRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const confirmSsnRef = useRef<TextInput>(null);
  const contactEmergencyNameRef = useRef<TextInput>(null);
  const contactEmergencyMobileRef = useRef<TextInput>(null);

  // Ref para armazenar as posições dos campos
  const positions = useRef<Record<keyof FormData, number>>(
    {} as Record<keyof FormData, number>
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ssn: "",
      mobile: "",
      address: "",
      confirmSsn: "",
      contactEmergencyName: "",
      contactEmergencyMobile: "",
    },
  });

  // Função para capturar a posição de cada campo
  const onLayout = (name: keyof FormData) => (e: LayoutChangeEvent) => {
    positions.current[name] = e.nativeEvent.layout.y;
  };

  // Função para focar no primeiro campo com erro e fazer scroll
  const focusFirstError = () => {
    const firstError = Object.keys(errors)[0] as keyof FormData;
    const y = positions.current[firstError];

    if (typeof y === "number") {
      scrollViewRef.current?.scrollTo({ y, animated: true });

      // Foca no campo após o scroll
      setTimeout(() => {
        switch (firstError) {
          case "firstName":
            firstNameRef.current?.focus();
            break;
          case "lastName":
            lastNameRef.current?.focus();
            break;
          case "email":
            emailRef.current?.focus();
            break;
          case "ssn":
            ssnRef.current?.focus();
            break;
          case "mobile":
            mobileRef.current?.focus();
            break;
          case "address":
            addressRef.current?.focus();
            break;
          case "confirmSsn":
            confirmSsnRef.current?.focus();
            break;
          case "contactEmergencyName":
            contactEmergencyNameRef.current?.focus();
            break;
          case "contactEmergencyMobile":
            contactEmergencyMobileRef.current?.focus();
            break;
        }
      }, 300);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    Alert.alert("Sucesso!", "Formulário enviado com sucesso!", [
      {
        text: "OK",
        onPress: () => reset(),
      },
    ]);
  };

  const onError = () => {
    // Foca no primeiro campo com erro após um delay para garantir que os erros foram processados
    setTimeout(() => {
      focusFirstError();
    }, 100);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Formulário de Cadastro</Text>

        {/* Primeiro Nome */}
        <View onLayout={onLayout("firstName")} style={styles.fieldContainer}>
          <Text style={styles.label}>Primeiro Nome *</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={firstNameRef}
                style={[styles.input, errors.firstName && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu primeiro nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
            )}
          />
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName.message}</Text>
          )}
        </View>

        {/* Sobrenome */}
        <View onLayout={onLayout("lastName")} style={styles.fieldContainer}>
          <Text style={styles.label}>Sobrenome *</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={lastNameRef}
                style={[styles.input, errors.lastName && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu sobrenome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            )}
          />
          {errors.lastName && (
            <Text style={styles.error}>{errors.lastName.message}</Text>
          )}
        </View>

        {/* Email */}
        <View onLayout={onLayout("email")} style={styles.fieldContainer}>
          <Text style={styles.label}>E-mail *</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={emailRef}
                style={[styles.input, errors.email && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => ssnRef.current?.focus()}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>

        {/* SSN */}
        <View onLayout={onLayout("ssn")} style={styles.fieldContainer}>
          <Text style={styles.label}>SSN *</Text>
          <Controller
            control={control}
            name="ssn"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={ssnRef}
                style={[styles.input, errors.ssn && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu SSN"
                keyboardType="numeric"
                maxLength={11}
                returnKeyType="next"
                onSubmitEditing={() => mobileRef.current?.focus()}
              />
            )}
          />
          {errors.ssn && <Text style={styles.error}>{errors.ssn.message}</Text>}
        </View>

        {/* Confirmar SSN */}
        <View onLayout={onLayout("confirmSsn")} style={styles.fieldContainer}>
          <Text style={styles.label}>Confirmar SSN *</Text>
          <Controller
            control={control}
            name="confirmSsn"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={confirmSsnRef}
                style={[styles.input, errors.confirmSsn && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirme seu SSN"
                keyboardType="numeric"
                maxLength={11}
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
              />
            )}
          />
          {errors.confirmSsn && (
            <Text style={styles.error}>{errors.confirmSsn.message}</Text>
          )}
        </View>

        {/* Telefone Móvel */}
        <View onLayout={onLayout("mobile")} style={styles.fieldContainer}>
          <Text style={styles.label}>Telefone Móvel *</Text>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={mobileRef}
                style={[styles.input, errors.mobile && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu telefone móvel"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
              />
            )}
          />
          {errors.mobile && (
            <Text style={styles.error}>{errors.mobile.message}</Text>
          )}
        </View>

        {/* Endereço */}
        <View onLayout={onLayout("address")} style={styles.fieldContainer}>
          <Text style={styles.label}>Endereço *</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={addressRef}
                style={[
                  styles.input,
                  styles.textArea,
                  errors.address && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Digite seu endereço completo"
                multiline
                numberOfLines={3}
                returnKeyType="next"
                onSubmitEditing={() => contactEmergencyNameRef.current?.focus()}
              />
            )}
          />
          {errors.address && (
            <Text style={styles.error}>{errors.address.message}</Text>
          )}
        </View>

        {/* Contato de Emergência - Nome */}
        <View
          onLayout={onLayout("contactEmergencyName")}
          style={styles.fieldContainer}
        >
          <Text style={styles.label}>Nome do Contato de Emergência *</Text>
          <Controller
            control={control}
            name="contactEmergencyName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={contactEmergencyNameRef}
                style={[
                  styles.input,
                  errors.contactEmergencyName && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nome do contato de emergência"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() =>
                  contactEmergencyMobileRef.current?.focus()
                }
              />
            )}
          />
          {errors.contactEmergencyName && (
            <Text style={styles.error}>
              {errors.contactEmergencyName.message}
            </Text>
          )}
        </View>

        {/* Contato de Emergência - Telefone */}
        <View
          onLayout={onLayout("contactEmergencyMobile")}
          style={styles.fieldContainer}
        >
          <Text style={styles.label}>Telefone do Contato de Emergência *</Text>
          <Controller
            control={control}
            name="contactEmergencyMobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={contactEmergencyMobileRef}
                style={[
                  styles.input,
                  errors.contactEmergencyMobile && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Telefone do contato de emergência"
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            )}
          />
          {errors.contactEmergencyMobile && (
            <Text style={styles.error}>
              {errors.contactEmergencyMobile.message}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Enviar Formulário"
            onPress={handleSubmit(onSubmit, onError)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ff6b6b",
    borderWidth: 2,
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 12,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default FormExample;
