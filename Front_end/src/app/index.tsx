import { cadastroServico } from "@/app/servicos/autenticacao/cadastro";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cadastroSchemaResponsavel } from '../app/schema/zod';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from "@/app/componentes/animacaocarregamento"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react-native";
import { useRouter } from 'expo-router'; // ajuste o import conforme seu roteador

export type CadastroFormData = z.infer<typeof cadastroSchemaResponsavel>;

// Paleta pensada para transmitir calma e acolhimento (tons suaves, baixo contraste agressivo)
const cores = {
  fundo: '#F4F6FB',
  cardFundo: '#FFFFFF',
  primaria: '#6C8EF5',
  primariaEscura: '#5578E8',
  texto: '#2E3350',
  textoSecundario: '#8A8FA3',
  borda: '#E4E7F2',
  erro: '#E5533D',
};

export default function App() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = React.useState<boolean>(false);
  const funcaoToggleSenha = () => setMostrarSenha(!mostrarSenha);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchemaResponsavel),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: cadastroServico.cadastrar,
    onSuccess: () => {
      Alert.alert('Sucesso!', 'Conta criada com sucesso.');
      reset();
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao conectar ao servidor.';
      Alert.alert('Erro no cadastro', mensagem);
    },
  });

  const onSubmit = (data: CadastroFormData) => {
    mutate(data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <Image
            source={require("@/assets/expo.icon/Assets/mascote.png")}
            style={styles.imagemBoasVindas}
            resizeMode="contain"
          />
          <Text style={styles.titulo}>Seja bem-vindo!</Text>
          <Text style={styles.subtitulo}>
            Crie sua conta e comece a montar histórias únicas para o seu filho
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nome completo</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, errors.nome && styles.inputErro]}>
                <User size={20} color={cores.textoSecundario} style={styles.iconeCampo} />
                <TextInput
                  style={styles.inputTexto}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#A6ABBD"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Nome completo"
                />
              </View>
            )}
          />
          {errors.nome && <Text style={styles.erroTexto}>{errors.nome.message}</Text>}

          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, errors.email && styles.inputErro]}>
                <Mail size={20} color={cores.textoSecundario} style={styles.iconeCampo} />
                <TextInput
                  style={styles.inputTexto}
                  placeholder="seu-email@exemplo.com"
                  placeholderTextColor="#A6ABBD"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="E-mail"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.erroTexto}>{errors.email.message}</Text>}

          <Text style={styles.label}>Senha</Text>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, errors.senha && styles.inputErro]}>
                <Lock size={20} color={cores.textoSecundario} style={styles.iconeCampo} />
                <TextInput
                  style={styles.inputTexto}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#A6ABBD"
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Senha"
                />
                <TouchableOpacity
                  onPress={funcaoToggleSenha}
                  style={styles.iconeBotao}
                  accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <Eye size={20} color={cores.textoSecundario} />
                  ) : (
                    <EyeOff size={20} color={cores.textoSecundario} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.senha && <Text style={styles.erroTexto}>{errors.senha.message}</Text>}

          <TouchableOpacity
            disabled={isPending}
            style={[styles.botao, isPending && styles.botaoDesabilitado]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
          >
            {isPending ? (
              <View style={styles.conteudoBotao}>
                <Spinner />
              </View>
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linhaLogin}>
            <Text style={styles.textoLogin}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.linkLogin}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagemBoasVindas: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: cores.texto,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: cores.cardFundo,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#3D4670',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: '#FAFBFF',
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  iconeCampo: {
    marginRight: 8,
  },
  inputTexto: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: cores.texto,
  },
  iconeBotao: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  inputErro: {
    borderColor: cores.erro,
  },
  erroTexto: {
    color: cores.erro,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 14,
    marginLeft: 4,
  },
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 52,
    shadowColor: cores.primariaEscura,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoDesabilitado: {
    backgroundColor: '#B7C6F9',
    shadowOpacity: 0,
  },
  conteudoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linhaLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  textoLogin: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  linkLogin: {
    fontSize: 14,
    color: cores.primaria,
    fontWeight: '700',
  },
});