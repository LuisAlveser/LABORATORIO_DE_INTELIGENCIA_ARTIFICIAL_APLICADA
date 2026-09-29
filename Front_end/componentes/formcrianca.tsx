import React from 'react';
import {
  Alert,
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
import { ArrowRight, CalendarDays, Sparkles, UserRound, X } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import {
  CriancaFormInput,
  CriancaFormOutput,
  criarCriancaSchema,
} from '../schema/zod';
import { CadastrarCriancaServico } from '../servicos/crianca/cadastrar';
import { Spinner } from './animacaocarregamento';

const cores = {
  fundo: '#F7F8F5',
  superficie: '#FFFFFF',
  primaria: '#287C72',
  primariaEscura: '#20675F',
  texto: '#263633',
  textoSecundario: '#74827E',
  borda: '#E2E9E5',
  campo: '#FBFCFA',
  suave: '#EDF5F2',
  erro: '#C94C4C',
};

type CadastroCriancaFormData = z.infer<typeof criarCriancaSchema>;

export interface JanelaProp {
  cadastroCrianca: boolean;
  setCadastroCrianca: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FormCrianca({
  cadastroCrianca,
  setCadastroCrianca,
}: JanelaProp) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CriancaFormInput>({
    resolver: zodResolver(criarCriancaSchema) as any,
    defaultValues: {
      nome: '',
      idade: '',
      numero_pagina: 5,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (dados: CriancaFormOutput) => {
      const token = await SecureStore.getItemAsync('user_token');

      if (!token) {
        throw new Error('Sua sessão expirou. Entre novamente na sua conta.');
      }

      return CadastrarCriancaServico.cadastrar(dados, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['criancas'] });
      reset();
      setCadastroCrianca(false);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem ??
        error.message ??
        'Não foi possível cadastrar. Tente novamente.';

      Alert.alert('Não foi possível cadastrar', mensagem);
    },
  });

  const onSubmit = (dados: CriancaFormInput) => {
    mutate({
      ...dados,
      numero_pagina: 5
    });
  };

  if (!cadastroCrianca) return null;

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
        <View style={styles.linhaFechar}>
          <TouchableOpacity
            style={styles.botaoFechar}
            onPress={() => setCadastroCrianca(false)}
            disabled={isPending}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Fechar cadastro"
          >
            <X size={20} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>

        <View style={styles.cabecalho}>
          <View style={styles.iconeCabecalho}>
            <Sparkles size={25} color={cores.primaria} />
          </View>
          <Text style={styles.selo}>UM NOVO CAPÍTULO</Text>
          <Text style={styles.titulo}>Vamos conhecer seu pequeno?</Text>
          <Text style={styles.subtitulo}>
            Conte um pouquinho sobre a criança para criarmos histórias com a
            cara dela.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Perfil da criança</Text>
          <Text style={styles.dicaCard}>
            Você pode atualizar essas informações depois.
          </Text>

          <Text style={styles.label}>Nome da criança</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.campo, errors.nome && styles.campoErro]}>
                <UserRound size={19} color={cores.textoSecundario} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Pedro"
                  placeholderTextColor="#9AA6A2"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Nome da criança"
                />
              </View>
            )}
          />
          {errors.nome?.message && (
            <Text style={styles.textoErro}>{errors.nome.message}</Text>
          )}

          <Text style={styles.label}>Idade</Text>
          <Controller
            control={control}
            name="idade"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.campo, errors.idade && styles.campoErro]}>
                <CalendarDays size={19} color={cores.textoSecundario} />
                <TextInput
                  style={styles.input}
                  placeholder="Idade em anos"
                  placeholderTextColor="#9AA6A2"
                  keyboardType="number-pad"
                  maxLength={2}
                  returnKeyType="done"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value ?? '')}
                  accessibilityLabel="Idade da criança"
                />
                <Text style={styles.sufixoIdade}>anos</Text>
              </View>
            )}
          />
          {errors.idade?.message && (
            <Text style={styles.textoErro}>{errors.idade.message}</Text>
          )}

          <TouchableOpacity
            style={[styles.botao, isPending && styles.botaoDesabilitado]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <>
                <Text style={styles.textoBotao}>Cadastrar perfil</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.textoPrivacidade}>
            As informações do perfil são usadas para personalizar as histórias.
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  linhaFechar: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  botaoFechar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 15,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconeCabecalho: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.suave,
    borderRadius: 20,
    marginBottom: 14,
  },
  selo: {
    color: cores.primaria,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  titulo: {
    color: cores.texto,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitulo: {
    maxWidth: 320,
    color: cores.textoSecundario,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
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
  tituloCard: {
    color: cores.texto,
    fontSize: 19,
    fontWeight: '700',
  },
  dicaCard: {
    color: cores.textoSecundario,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 21,
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
    marginBottom: 16,
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
  sufixoIdade: {
    color: cores.textoSecundario,
    fontSize: 13,
  },
  textoErro: {
    color: cores.erro,
    fontSize: 12,
    marginTop: -11,
    marginBottom: 13,
    marginLeft: 3,
  },
  botao: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: cores.primaria,
    borderRadius: 14,
    marginTop: 5,
  },
  botaoDesabilitado: {
    backgroundColor: '#9ABDB7',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textoPrivacidade: {
    color: cores.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});