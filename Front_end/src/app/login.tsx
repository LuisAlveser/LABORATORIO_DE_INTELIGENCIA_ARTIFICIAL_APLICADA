import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';

import { loginSchema } from '../../schema/zod';
import { loginServico } from '../../servicos/autenticacao/login';
import { Spinner } from '../../componentes/animacaocarregamento';

export type LoginFormData = z.infer<typeof loginSchema>;

const cores = {
  fundo: '#F7F8F5',
  superficie: '#FFFFFF',
  primaria: '#287C72',
  texto: '#263633',
  textoSecundario: '#74827E',
  borda: '#E2E9E5',
  campo: '#FBFCFA',
  erro: '#C94C4C',
};

export default function LoginScreen() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginServico.login,
    onSuccess: async (data: any) => {
      if (data?.token) {
        await SecureStore.setItemAsync('user_token', data.token);
      }
      reset();
      router.replace('/telaprincipal' as any);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem ??
        (error.request
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
          : error.message ?? 'Confira seus dados e tente novamente.');

      Alert.alert('Não foi possível entrar', mensagem);
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <Image
            source={require('@/assets/expo.icon/Assets/mascote.png')}
            style={styles.mascote}
            resizeMode="contain"
            accessibilityLabel="Mascote do aplicativo"
          />
          <Text style={styles.selo}>QUE BOM TER VOCÊ DE VOLTA</Text>
          <Text style={styles.titulo}>Olá novamente!</Text>
          <Text style={styles.subtitulo}>
            Entre para continuar criando histórias especiais.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloFormulario}>Entrar na sua conta</Text>
          <Text style={styles.dicaFormulario}>
            Use seu e-mail e sua senha para acessar.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.campo, errors.email && styles.campoErro]}>
                <Mail size={19} color={cores.textoSecundario} />
                <TextInput
                  style={styles.input}
                  placeholder="voce@exemplo.com"
                  placeholderTextColor="#9AA6A2"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="E-mail"
                />
              </View>
            )}
          />
          {errors.email && (
            <Text style={styles.textoErro}>{errors.email.message}</Text>
          )}

          <Text style={styles.label}>Senha</Text>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.campo, errors.senha && styles.campoErro]}>
                <Lock size={19} color={cores.textoSecundario} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9AA6A2"
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  returnKeyType="done"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Senha"
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha((visivel) => !visivel)}
                  style={styles.botaoIcone}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  hitSlop={10}
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} color={cores.textoSecundario} />
                  ) : (
                    <Eye size={19} color={cores.textoSecundario} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.senha && (
            <Text style={styles.textoErro}>{errors.senha.message}</Text>
          )}

          <TouchableOpacity
            disabled={isPending}
            style={[styles.botao, isPending && styles.botaoDesabilitado]}
            onPress={handleSubmit((dados) => mutate(dados))}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linhaConta}>
            <Text style={styles.textoConta}>Ainda não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.rodape}>
          Suas histórias e momentos em família esperam por você.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 28 : 20,
    paddingBottom: 28,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mascote: {
    width: 126,
    height: 126,
    marginBottom: 10,
  },
  selo: {
    color: cores.primaria,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  titulo: {
    color: cores.texto,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 310,
  },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EEF1ED',
    shadowColor: '#263633',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  tituloFormulario: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
  },
  dicaFormulario: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
  },
  campo: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: cores.campo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 15,
  },
  campoErro: {
    borderColor: cores.erro,
  },
  input: {
    flex: 1,
    color: cores.texto,
    fontSize: 15,
    paddingVertical: 12,
  },
  botaoIcone: {
    padding: 4,
  },
  textoErro: {
    color: cores.erro,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 3,
  },
  botao: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primaria,
    borderRadius: 14,
    marginTop: 6,
  },
  botaoDesabilitado: {
    backgroundColor: '#9ABDB7',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linhaConta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textoConta: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  link: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '700',
  },
  rodape: {
    color: cores.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});