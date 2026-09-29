import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BookOpen,
  CalendarDays,
  CircleUserRound,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExcluirCriancaServico } from '../servicos/crianca/excluir';
import { Spinner } from './animacaocarregamento';

const cores = {
  superficie: '#FFFFFF',
  primaria: '#287C72',
  primariaEscura: '#20675F',
  texto: '#263633',
  textoSecundario: '#74827E',
  borda: '#E2E9E5',
  suave: '#EDF5F2',
  erro: '#C94C4C',
};

export interface CriancaProp {
  id: string;
  responsavel_id: string;
  nome: string;
  idade: number;
  numero_pagina: number;
  temas_favoritos: string[];
  temas_evitar: string[];
  personagens_favoritos: string[];
}

export default function CardCrianca({
  crianca,
}: {
  crianca: CriancaProp;
}) {
  const queryClient = useQueryClient();

  const { mutate: dispararExclusao, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync('user_token');

      if (!token) {
        throw new Error('Sua sessão expirou. Entre novamente na sua conta.');
      }

      return ExcluirCriancaServico.excluir(id, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['criancas'] });
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem ??
        error.message ??
        'Não foi possível excluir o perfil. Tente novamente.';

      Alert.alert('Não foi possível excluir', mensagem);
    },
  });

  const confirmarExclusao = () => {
    Alert.alert(
      'Remover perfil?',
      `O perfil de ${crianca.nome} será removido.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => dispararExclusao(crianca.id),
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <View style={styles.grupoIdentidade}>
          <View style={styles.avatar}>
            <CircleUserRound size={23} color={cores.primaria} strokeWidth={1.8} />
          </View>
          <View style={styles.identidade}>
            <Text style={styles.nome} numberOfLines={1}>
              {crianca.nome}
            </Text>
            <Text style={styles.descricao}>Perfil da criança</Text>
          </View>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoIcone}
            onPress={() =>
              Alert.alert(
                'Editar perfil',
                'A edição do perfil ainda não está disponível.',
              )
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Editar perfil de ${crianca.nome}`}
          >
            <Pencil size={17} color={cores.textoSecundario} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoIcone, styles.botaoExcluir]}
            onPress={confirmarExclusao}
            disabled={isPending}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Remover perfil de ${crianca.nome}`}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <Trash2 size={17} color={cores.erro} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.informacoes}>
        <View style={styles.infoPill}>
          <CalendarDays size={16} color={cores.primaria} />
          <Text style={styles.infoTexto}>
            {crianca.idade} {crianca.idade === 1 ? 'ano' : 'anos'}
          </Text>
        </View>

        <View style={styles.infoPill}>
          <BookOpen size={16} color={cores.primaria} />
          <Text style={styles.infoTexto}>
            {crianca.numero_pagina}{' '}
            {crianca.numero_pagina === 1 ? 'página' : 'páginas'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoHistoria}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Gerar história para ${crianca.nome}`}
      >
        <Sparkles size={17} color="#FFFFFF" />
        <Text style={styles.textoBotaoHistoria}>Criar uma história</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF1ED',
    shadowColor: '#263633',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  grupoIdentidade: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.suave,
    borderRadius: 15,
  },
  identidade: {
    flex: 1,
  },
  nome: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 3,
  },
  acoes: {
    flexDirection: 'row',
    gap: 7,
  },
  botaoIcone: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8F5',
    borderRadius: 12,
  },
  botaoExcluir: {
    backgroundColor: '#FFF3F1',
  },
  informacoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 15,
    marginBottom: 17,
  },
  infoPill: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: cores.suave,
    borderRadius: 11,
    paddingHorizontal: 11,
  },
  infoTexto: {
    color: cores.texto,
    fontSize: 12,
    fontWeight: '600',
  },
  botaoHistoria: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: cores.primaria,
    borderRadius: 13,
  },
  textoBotaoHistoria: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});