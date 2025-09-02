import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { COLORS } from "../constants/colors";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen = () => {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert(
        "Erro no Login",
        "Não foi possível fazer login com o Google. Tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        {/* Logo/Ícone */}
        <View style={styles.logoContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Personal Budget</Text>
          <Text style={styles.appSubtitle}>
            Gerencie suas finanças pessoais
          </Text>
        </View>

        {/* Formulário de Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.descriptionText}>
            Faça login com sua conta Google para começar a gerenciar suas
            finanças
          </Text>

          {/* Botão Google */}
          <View style={styles.buttonContainer}>
            <GoogleAuthButton
              onPress={handleGoogleLogin}
              disabled={isLoading}
              loading={isLoading}
              title="Entrar com Google"
            />
          </View>

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Ao fazer login, você concorda com nossos termos de uso e política
              de privacidade.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  loginContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 24,
  },
  infoContainer: {
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default LoginScreen;
