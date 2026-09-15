import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Calendar, X, ArrowRight } from 'lucide-react-native';
import { CriancaFormInput, CriancaFormOutput, criarCriancaSchema } from '../schema/zod';
import { CadastrarCriancaServico } from '../servicos/crianca/cadastrar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from './animacaocarregamento';
import * as SecureStore from 'expo-secure-store';

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




type CadastroCriancaFormData = z.infer<typeof criarCriancaSchema>;

export interface JanelaProp {
  cadastroCrianca: boolean;
  setCadastroCrianca: React.Dispatch<React.SetStateAction<boolean>>;
}
type CriancaFormInputs = {
  nome: string;
  idade: string;
  numero_pagina: string;
};

export function FormCrianca({ cadastroCrianca, setCadastroCrianca }: JanelaProp) {
   const queryClient = useQueryClient();
  if (!cadastroCrianca) return null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CriancaFormInput>({
    resolver: zodResolver(criarCriancaSchema) as any,
    defaultValues: {
      nome: '',
     idade: '' ,         
      numero_pagina: 5  ,
    }
  });
const { mutate, isPending } = useMutation({

    mutationFn: async (dados:CriancaFormOutput) => {
    const token = await SecureStore.getItemAsync('user_token')
     return  CadastrarCriancaServico.cadastrar(dados,token as string)
    },
     
    onSuccess: async () => {
       queryClient.invalidateQueries({ queryKey: ['criancas'] });
      setCadastroCrianca(false)
       reset(); 
 
    
      
    
    },
    onError: (error: any) => {
      console.log('Detalhes do Erro 400:', error.response?.data);
      const mensagem = error.response?.data?.mensagem || 'Erro ao conectar ao servidor.';
      Alert.alert('Erro no cadastro', mensagem);
    },
  }); 
  
  const onSubmit = async (data: any) => {
    mutate(data    as CriancaFormOutput)
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      
    
      <View style={styles.containerFechar}>
        <TouchableOpacity 
          style={styles.botaoFechar} 
          onPress={() => setCadastroCrianca(false)}
          activeOpacity={0.6}
        >
          <X size={24} color={cores.textoSecundario} />
        </TouchableOpacity>
      </View>

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Nova Criança</Text>
        <Text style={styles.subtitulo}>
          Preencha os dados abaixo para cadastrar o perfil e começar a criar histórias personalizadas.
        </Text>
      </View>

      <View style={styles.card}>
        
       
        <Text style={styles.label}>Nome da Criança</Text>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={[styles.inputContainer, errors.nome && styles.inputErro]}>
              <User size={20} color={cores.textoSecundario} style={styles.iconeCampo} />
              <TextInput
                style={styles.inputTexto}
                placeholder="Ex: Pedro Henrique"
                placeholderTextColor={cores.textoSecundario}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            </View>
          )}
        />
        {errors.nome && <Text style={styles.erroTexto}>{errors.nome.message}</Text>}

        {/* Campo: Idade */}
        <Text style={styles.label}>Idade</Text>
        <Controller
          control={control}
          name="idade"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={[styles.inputContainer, errors.idade && styles.inputErro]}>
              <Calendar size={20} color={cores.textoSecundario} style={styles.iconeCampo} />
              <TextInput
                style={styles.inputTexto}
                placeholder="Ex: 6"
                placeholderTextColor={cores.textoSecundario}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text)}
                
                maxLength={2}
              />
            </View>
          )}
        />
        {errors.idade && <Text style={styles.erroTexto}>{errors.idade.message}</Text>}

      
        <TouchableOpacity
          style={[styles.botao,  isPending && styles.botaoDesabilitado]}
          onPress={handleSubmit(onSubmit)}
          disabled={ isPending}
          activeOpacity={0.8}
        >
          { isPending ? (
            <View style={styles.conteudoBotao}>
                            <Spinner />
                          </View>
          ) : (
            <View style={styles.conteudoBotao}>
              <Text style={styles.botaoTexto}>Cadastrar Criança</Text>
              <ArrowRight size={18} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: cores.fundo,
  },
  containerFechar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 8,
  },
  botaoFechar: {
    padding: 8,
    backgroundColor: cores.cardFundo,
    borderRadius: 50,
    shadowColor: '#3D4670',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
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
  inputErro: {
    borderColor: cores.erro,
  },
  erroTexto: {
    color: cores.erro,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 14,
    marginLeft: 4,
    fontWeight: '500',
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
});