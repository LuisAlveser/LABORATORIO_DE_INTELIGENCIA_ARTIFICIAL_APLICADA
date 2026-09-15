import React, { useEffect, useState } from 'react';
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
import { LogOut, UserPlus ,Bookmark, LucideIcon} from 'lucide-react-native';

import NavegacaoMenu from '../../componentes/menutelaprincipal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { listarCriancaServico } from '../../servicos/crianca/listar';
import CardCrianca, { CriancaProp } from '../../componentes/cardcrianca';
import { router } from 'expo-router';

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

import { FormCrianca } from '../../componentes/formcrianca';


export default function TelaPrincipal() {
  
  const [cadastroCrianca,setCadastroCrianca]=useState<boolean>(false)
    const { data: crianca = [], isLoading, error, isError } = useQuery({
    queryKey: ['criancas'],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync('user_token');
      
      if (!token) throw new Error('Token não encontrado');
      return listarCriancaServico.listar(token);
    },
  });


  return (
        <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={cores.cardFundo} />
    
    <View style={styles.cabecalhoSuperior}>
      <Text style={styles.tituloHeader}>Crianças Cadastradas</Text>
    </View>
 {cadastroCrianca ? (
        <FormCrianca 
          cadastroCrianca={cadastroCrianca} 
          setCadastroCrianca={setCadastroCrianca} 
        />
      ) : (
        /* Caso contrário, exibe o cabeçalho e a listagem normal */
        <>
       

          <FlatList
            data={crianca}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.scrollContent}
            renderItem={({ item }) => (
              <CardCrianca crianca={item} />
            )}
            ListEmptyComponent={() => (
              <View style={styles.containerVazio}>
                <Text style={styles.textoVazio}>
                  {isLoading ? 'Carregando...' : 'Nenhuma criança cadastrada.'}
                </Text>
              </View>
            )}
          />
        </>
      )}
  

    <NavegacaoMenu onLogOut={async function (): Promise<void> {
               try {
         
          await SecureStore.deleteItemAsync('user_token');
          
          
          router.replace('/login');
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível deslogar completamente.');
        }
          } } 
          
          onBookmark={function (): void {
              throw new Error('Function not implemented.');
          } } 
          onUserPlus={function (): void {
             setCadastroCrianca(true)
          } } 
          LogOutIcon={LogOut} BookmarkIcon={Bookmark} UserPlusIcon={UserPlus} />
  </SafeAreaView>
  )
     

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
  tituloHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
  },
   botaoAcaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
 
  containerVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  textoVazio: {
    color: cores.textoSecundario,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 90, 
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
  
});