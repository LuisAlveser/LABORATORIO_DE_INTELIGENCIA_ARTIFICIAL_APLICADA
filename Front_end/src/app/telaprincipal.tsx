import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  LockKeyhole,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import CardCrianca from '../../componentes/cardcrianca';
import { FormCrianca } from '../../componentes/formcrianca';
import { listarCriancaServico } from '../../servicos/crianca/listar';

const cores = {
  fundo: '#F7F8F5',
  superficie: '#FFFFFF',
  primaria: '#287C72',
  primariaEscura: '#20675F',
  texto: '#263633',
  textoSecundario: '#74827E',
  borda: '#E2E9E5',
  suave: '#EDF5F2',
};

const larguraDrawer = Math.min(Dimensions.get('window').width * 0.84, 360);

type DrawerAtivo = 'historias' | 'configuracoes' | null;

export default function TelaPrincipal() {
  const router = useRouter();
  const [cadastroCrianca, setCadastroCrianca] = React.useState(false);
  const [drawer, setDrawer] = React.useState<DrawerAtivo>(null);
  const animacaoDrawer = React.useRef(new Animated.Value(0)).current;

  const {
    data: criancas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['criancas'],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) throw new Error('Token não encontrado');
      const dados = listarCriancaServico.listar(token);
      return dados
    },
  });

  const abrirDrawer = (tipo: Exclude<DrawerAtivo, null>) => {
    animacaoDrawer.setValue(0);
    setDrawer(tipo);
    Animated.timing(animacaoDrawer, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const fecharDrawer = () => {
    Animated.timing(animacaoDrawer, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setDrawer(null));
  };

  const sairDaConta = () => {
    Alert.alert('Sair da conta?', 'Você poderá entrar novamente quando quiser.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('user_token');
          router.replace('/login');
        },
      },
    ]);
  };

  const translateX = animacaoDrawer.interpolate({
    inputRange: [0, 1],
    outputRange: [drawer === 'historias' ? -larguraDrawer : larguraDrawer, 0],
  });

  const conteudoCabecalho = (
    <View>
      <View style={styles.topo}>
        <View style={styles.marca}>
          <Text style={styles.marcaTitulo}>Histórias em família</Text>
          <Text style={styles.marcaSubtitulo}>Um cantinho para imaginar juntos</Text>
        </View>

        <View style={styles.acoesTopo}>
          <TouchableOpacity
            style={styles.botaoTopo}
            onPress={() => abrirDrawer('historias')}
            accessibilityRole="button"
            accessibilityLabel="Abrir histórias salvas"
          >
            <BookOpen size={21} color={cores.primaria} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoTopo}
            onPress={() => abrirDrawer('configuracoes')}
            accessibilityRole="button"
            accessibilityLabel="Abrir configurações"
          >
            <Settings size={21} color={cores.primaria} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.boasVindas}>
        <Text style={styles.titulo}>Sua família, suas histórias</Text>
        <Text style={styles.subtitulo}>
          Cadastre uma criança para começar a criar momentos especiais.
        </Text>
      </View>

      {!cadastroCrianca && (
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => setCadastroCrianca(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Plus size={19} color="#FFFFFF" />
          <Text style={styles.textoBotaoAdicionar}>Adicionar criança</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.tituloSecao}>Sua família</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {cadastroCrianca ? (
        <View style={styles.formularioContainer}>
          <TouchableOpacity
            style={styles.voltarFormulario}
            onPress={() => setCadastroCrianca(false)}
            accessibilityRole="button"
          >
            <Text style={styles.linkVoltar}>Voltar para a família</Text>
          </TouchableOpacity>
          <FormCrianca
            cadastroCrianca={cadastroCrianca}
            setCadastroCrianca={setCadastroCrianca}
          />
        </View>
      ) : (
        <FlatList
          data={criancas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={conteudoCabecalho}
          renderItem={({ item }) => <CardCrianca crianca={item} />}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          onRefresh={refetch}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.estadoVazio}>
              {isLoading ? (
                <>
                  <ActivityIndicator color={cores.primaria} />
                  <Text style={styles.textoEstado}>Carregando sua família...</Text>
                </>
              ) : isError ? (
                <>
                  <Text style={styles.textoEstado}>
                    Não foi possível carregar os dados.
                  </Text>
                  <TouchableOpacity onPress={() => refetch()}>
                    <Text style={styles.linkEstado}>Tentar novamente</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.iconeVazio}>
                    <UserRound size={25} color={cores.primaria} />
                  </View>
                  <Text style={styles.tituloVazio}>Tudo começa com um nome</Text>
                  <Text style={styles.textoEstado}>
                    Adicione uma criança para criar histórias feitas para ela.
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}

      <Modal
        visible={drawer !== null}
        transparent
        animationType="none"
        onRequestClose={fecharDrawer}
        statusBarTranslucent
      >
        <View style={styles.modalFundo}>
          <Pressable
            style={styles.sombraDrawer}
            onPress={fecharDrawer}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
          />

          <Animated.View
            style={[
              styles.drawer,
              drawer === 'historias' ? styles.drawerEsquerdo : styles.drawerDireito,
              { transform: [{ translateX }] },
            ]}
          >
            <View style={styles.drawerCabecalho}>
              <View>
                <Text style={styles.drawerTitulo}>
                  {drawer === 'historias' ? 'Histórias salvas' : 'Sua conta'}
                </Text>
                <Text style={styles.drawerSubtitulo}>
                  {drawer === 'historias'
                    ? 'Seus momentos favoritos'
                    : 'Configurações e preferências'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.botaoFechar}
                onPress={fecharDrawer}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <X size={21} color={cores.textoSecundario} />
              </TouchableOpacity>
            </View>

            {drawer === 'historias' ? (
              <View style={styles.historiasVazias}>
                <View style={styles.iconeVazio}>
                  <BookOpen size={26} color={cores.primaria} />
                </View>
                <Text style={styles.tituloVazio}>Suas histórias ficam aqui</Text>
                <Text style={styles.textoEstado}>
                  Quando salvar uma história, você poderá encontrá-la neste espaço.
                </Text>
              </View>
            ) : (
              <View style={styles.opcoes}>
                <View style={styles.perfil}>
                  <View style={styles.avatar}>
                    <UserRound size={24} color={cores.primaria} />
                  </View>
                  <View>
                    <Text style={styles.perfilTitulo}>Sua conta</Text>
                    <Text style={styles.perfilSubtitulo}>
                      Preferências da família
                    </Text>
                  </View>
                </View>

                <DrawerOpcao
                  icone={UserRound}
                  titulo="Dados da conta"
                  detalhe="Gerencie suas informações"
                  aoPressionar={() =>
                    Alert.alert('Dados da conta', 'Esta opção estará disponível em breve.')
                  }
                />
                <DrawerOpcao
                  icone={LockKeyhole}
                  titulo="Privacidade e segurança"
                  detalhe="Cuide da sua conta"
                  aoPressionar={() =>
                    Alert.alert(
                      'Privacidade e segurança',
                      'Esta opção estará disponível em breve.',
                    )
                  }
                />
                <DrawerOpcao
                  icone={CircleHelp}
                  titulo="Ajuda"
                  detalhe="Tire suas dúvidas"
                  aoPressionar={() =>
                    Alert.alert('Ajuda', 'Esta opção estará disponível em breve.')
                  }
                />

                <TouchableOpacity
                  style={styles.botaoSair}
                  onPress={sairDaConta}
                  accessibilityRole="button"
                >
                  <LogOut size={19} color="#B64D4D" />
                  <Text style={styles.textoSair}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type DrawerOpcaoProps = {
  icone: typeof UserRound;
  titulo: string;
  detalhe: string;
  aoPressionar: () => void;
};

function DrawerOpcao({
  icone: Icone,
  titulo,
  detalhe,
  aoPressionar,
}: DrawerOpcaoProps) {
  return (
    <TouchableOpacity
      style={styles.opcao}
      onPress={aoPressionar}
      accessibilityRole="button"
    >
      <View style={styles.iconeOpcao}>
        <Icone size={19} color={cores.primaria} />
      </View>
      <View style={styles.textoOpcao}>
        <Text style={styles.opcaoTitulo}>{titulo}</Text>
        <Text style={styles.opcaoDetalhe}>{detalhe}</Text>
      </View>
      <ChevronRight size={18} color={cores.textoSecundario} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  marca: {
    flex: 1,
  },
  marcaTitulo: {
    color: cores.texto,
    fontSize: 17,
    fontWeight: '700',
  },
  marcaSubtitulo: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 3,
  },
  acoesTopo: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoTopo: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  boasVindas: {
    marginBottom: 20,
  },
  titulo: {
    color: cores.texto,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  botaoAdicionar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: cores.primaria,
    borderRadius: 15,
    marginBottom: 28,
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  tituloSecao: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  separador: {
    height: 12,
  },
  estadoVazio: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  iconeVazio: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.suave,
    borderRadius: 20,
    marginBottom: 14,
  },
  tituloVazio: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  textoEstado: {
    color: cores.textoSecundario,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  linkEstado: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  formularioContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  voltarFormulario: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 8,
  },
  linkVoltar: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
  },
  modalFundo: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 36, 33, 0.38)',
  },
  sombraDrawer: {
    ...StyleSheet.absoluteFill,
  },
  drawer: {
    width: larguraDrawer,
    height: '100%',
    backgroundColor: cores.fundo,
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 48 : 58,
    paddingBottom: 28,
  },
  drawerEsquerdo: {
    alignSelf: 'flex-start',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  drawerDireito: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  drawerCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  drawerTitulo: {
    color: cores.texto,
    fontSize: 21,
    fontWeight: '700',
  },
  drawerSubtitulo: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginTop: 4,
  },
  botaoFechar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 14,
  },
  historiasVazias: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  opcoes: {
    paddingTop: 20,
  },
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.superficie,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.suave,
    borderRadius: 16,
  },
  perfilTitulo: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  perfilSubtitulo: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 3,
  },
  opcao: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  iconeOpcao: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.suave,
    borderRadius: 13,
    marginRight: 12,
  },
  textoOpcao: {
    flex: 1,
  },
  opcaoTitulo: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '600',
  },
  opcaoDetalhe: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 3,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3F1',
    borderRadius: 14,
  },
  textoSair: {
    color: '#B64D4D',
    fontSize: 14,
    fontWeight: '700',
  },
});