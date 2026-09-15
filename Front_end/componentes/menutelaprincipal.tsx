import { LogOut, UserPlus ,Bookmark, LucideIcon} from 'lucide-react-native';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';


const cores = {
  cardFundo: '#FFFFFF',
  primaria: '#6C8EF5',
  textoSecundario: '#8A8FA3',
  borda: '#E4E7F2',
};
export interface NavegadorProps {
  
  onLogOut: () => void;
  onBookmark: () => void;
  onUserPlus: () => void;

  
  LogOutIcon: LucideIcon;
  BookmarkIcon: LucideIcon;
  UserPlusIcon: LucideIcon;

  currentScreen?: 'children' | 'stories' | 'add';
}

export default function NavegacaoMenu({
        LogOutIcon,
        BookmarkIcon,
        UserPlusIcon, 
        onLogOut,
        onBookmark,
        onUserPlus,

       currentScreen = 'children' }:NavegadorProps) {
  return (
   
    <View style={styles.footerContainer}>
   
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={onBookmark}
        activeOpacity={0.7}
      >
        <BookmarkIcon
         
          size={22} 
          color={currentScreen === 'stories' ? cores.primaria : cores.textoSecundario} 
        />
        <Text style={[styles.tabText, currentScreen === 'stories' && styles.activeText]}>
          Histórias
        </Text>
      </TouchableOpacity>

    
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={onUserPlus}
        activeOpacity={0.7}
      >
        <UserPlusIcon 
          size={22} 
          color={currentScreen === 'add' ? cores.primaria : cores.textoSecundario} 
        />
        <Text style={[styles.tabText, currentScreen === 'add' && styles.activeText]}>
          Nova Criança
        </Text>
      </TouchableOpacity>

     
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={onLogOut}
        activeOpacity={0.7}
      >
        <LogOutIcon size={22} color={cores.textoSecundario} />
        <Text style={styles.tabText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: cores.cardFundo,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#3D4670',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginTop: 4,
  },
  activeText: {
    color: cores.primaria,
    fontWeight: '700',
  },
});