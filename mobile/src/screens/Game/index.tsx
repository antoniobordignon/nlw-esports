
import React, { useEffect, useState, } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons'

import { Background } from '../../components/Background';
import logoImg from '../../assets/logo-nlw-esports.png';
import { Heading } from '../../components/Heading';

import { THEME } from '../../theme';
import { styles } from './styles';

import { GameParams } from '../../@types/navigation';

import { DouCard, DouCardProps } from '../../components/DouCard';
import { DouMatch } from '../../components/DouMatch';



export function Game() {
  const [duos, setDuos] = useState<DouCardProps[]>([]);
  const [discordDuoSelected, setDiscordSelected] = useState('')

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack(){
    navigation.goBack();
  }
  
  async function getDiscordUser(adsId: string){
    fetch(`http://192.168.2.102:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data => setDiscordSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.2.102:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data =>setDuos(data));
  },[]);

  return (
    <Background>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Entypo 
            name="chevron-thin-left"
            color={THEME.COLORS.CAPTION_300}
            size={20}
          />
        </TouchableOpacity>
        
        <Image 
        source={logoImg}
        style={styles.logo}
        />
        <View style={styles.right}/>
      </View>

      <Image
        source={{ uri: game.bannerUrl }}
        style={styles.cover}
        resizeMode="cover"
      />
      <Heading title={game.title} subtitle={'Conecte-se e comece a jogar!'}/>
      
      <FlatList 
      data={duos} 
      keyExtractor={item => item.id} 
      renderItem={({item}) => (
        <DouCard 
        data={item}
        onConnect={() => getDiscordUser(item.id)}
        />
      )}
      horizontal
      contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
      style={styles.containerList}
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={() => (
        <Text style={styles.emptyListText}>
          Não há anúncios publicados ainda.
        </Text>
      )}
      />
      <DouMatch visible={discordDuoSelected.length > 0} onClose={() => setDiscordSelected('')} discord={discordDuoSelected} />
    </SafeAreaView>
    </Background>
  );
}