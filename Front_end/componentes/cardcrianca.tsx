import { BookText, CalendarDays, CircleUserRound, Pencil, PersonStanding, Sparkles, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar, 
  Alert
} from 'react-native';




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
export interface CriancaProp{

  id                    :string,
  responsavel_id        :string, 
  nome                  :string,
  idade                 :number,
  numero_pagina         :number,        
  temas_favoritos       :string[],
  temas_evitar          :string[],
  personagens_favoritos :string[],

}
import * as SecureStore from 'expo-secure-store';
import {ExcluirCriancaServico} from "../servicos/crianca/excluir"
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CardCrianca({ crianca }: { crianca: CriancaProp }) {

   const queryClient = useQueryClient()

  const { mutate: dispararExclusao, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync('user_token');
      return ExcluirCriancaServico.excluir(id, token as string);
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['criancas'] });
     
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao tentar excluir a criança.';
   
    }
  });
const lidarComExclusao = (id: string) => {
    Alert.alert(
      'Excluir Criança',
      `Tem certeza que deseja remover ${crianca.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: () => dispararExclusao(id) 
        }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.infoAvatarGroup}>
          <View style={styles.avatarContainer}>
            {/* Lucide Icon: PersonStanding */}
            <CircleUserRound size={22} color={cores.primaria} strokeWidth={1.5}/>
            
          </View>
          <Text style={styles.nomeCriança}>{crianca.nome}</Text>
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity style={styles.iconeBotao} activeOpacity={0.6}>
            
            <Pencil size={18} color={cores.textoSecundario} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
          style={styles.iconeBotao} activeOpacity={0.6} onPress={() => lidarComExclusao(crianca.id)}>
           
            <Trash2 size={18} color={cores.erro} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardCorpo}>
        {/* Linha da Idade */}
        <View style={styles.infoLinha}>
          <View style={styles.infoIconeWrapper}>
            {/* Lucide Icon: CalendarDays */}
            <CalendarDays size={16} color={cores.textoSecundario} strokeWidth={2} />
          </View>
          <Text style={styles.infoTexto}>
            <Text style={styles.infoLabel}>Idade: </Text>{crianca.idade} anos
          </Text>
        </View>

        {/* Linha do Número de Páginas (Nova) */}
        <View style={styles.infoLinha}>
          <View style={styles.infoIconeWrapper}>
            {/* Lucide Icon: BookText */}
            <BookText size={16} color={cores.textoSecundario} strokeWidth={2} />
          </View>
          <Text style={styles.infoTexto}>
            <Text style={styles.infoLabel}>Nº de Páginas: </Text>{crianca.numero_pagina}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botaoAcaoCard} activeOpacity={0.8}>
        <Text style={styles.botaoAcaoTexto}>Gerar História</Text>
        {/* Lucide Icon: Sparkles */}
        <Sparkles size={16} color="#FFFFFF" style={{ marginLeft: 8 }} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalhoSuperior: {
    height: 60,
    backgroundColor: cores.cardFundo,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    shadowColor: '#3D4670',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  infoIconeWrapper: {
    width: 20, 
    alignItems: 'center',
    marginRight: 8,
  },
  tituloHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 90, // Espaço para não cobrir o último card com o footer
  },
  card: {
    backgroundColor: cores.cardFundo,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3D4670',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    paddingBottom: 12,
    marginBottom: 14,
  },
  infoAvatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAFBFF',
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nomeCriança: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
  },
  acoesContainer: {
    flexDirection: 'row',
  },
  iconeBotao: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  cardCorpo: {
    marginBottom: 16,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcone: {
    marginRight: 8,
    width: 18,
  },
  infoTexto: {
    fontSize: 14,
    color: cores.texto,
  },
  infoLabel: {
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  botaoAcaoCard: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.primariaEscura,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  botaoAcaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});