import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { auth, firestore } from '../firebase';
import axios from 'axios';
import logo from '../assets/logo_transparent_notext.jpeg';
import logoText from '../assets/logo_transparent_onlytext.jpeg';
import BottomBar from '../BottomBar';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomePage = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllChats, setShowAllChats] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [channelOptions, setChannelOptions] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelOptionsFetched, setChannelOptionsFetched] = useState(false);
  const [tempSelectedChannels, setTempSelectedChannels] = useState([]);
  const [addChannelPop, setAddChannelPop] = useState(false);
  const [channelUsername, setChannelUsername] = useState('');
  const [isUpdateNewsComplete, setIsUpdateNewsComplete] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchChannels();
  }, []);

  const fetchNews = async () => {
    console.log('fetching news');
    try {
      const newsRef = firestore.collection('news').orderBy('timestamp', 'desc');
      const snapshot = await newsRef.get();
      const newsData = snapshot.docs.map(doc => ({ id: doc.id, message_text: doc.data().message_text, channel_name: doc.data().channel_name, timestamp: doc.data().timestamp.toDate() }));
      setNews(newsData);
      setFilteredNews(newsData);
    } catch (error) {
      console.log('Error fetching news:', error);
    }
  };
  
  const fetchChannels = async () => {
    try {
      const channelRef = firestore.collection('channels');
      const snapshot = await channelRef.get();
      const channelData = snapshot.docs.map(doc => doc.data().channel_name);
      setChannelOptions(channelData);
      setChannelOptionsFetched(true);
    } catch (error) {
      console.log('Error fetching channels:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
    setRefreshing(false);
  };

  useEffect(() => {
    if (channelOptionsFetched) {
      // Set initial selected channels to all available channels
      const allChannels = [...channelOptions];
      setSelectedChannels(allChannels);
      setTempSelectedChannels(allChannels);
    }
  }, [channelOptionsFetched]);
  

  useEffect(() => {
    if (searchText === '') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item =>
        item.message_text.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchText, news]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelRef = firestore.collection('channels');
        const snapshot = await channelRef.get();
        const channelData = snapshot.docs.map(doc => doc.data().channel_name);
        setChannelOptions(channelData);
      } catch (error) {
        console.log('Error fetching channels:', error);
      }
    };
  
    fetchChannels();
  }, []);
  
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log('User successfully logged out!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log('Logout error:', error);
      });
  };

  const renderNewsItem = ({ item }) => {
    const messageText = item.message_text;
    const channelName = item.channel_name;
    const highlightedText = getHighlightedText(messageText, searchText);
    const timestamp = item.timestamp.toLocaleString();
  
    return (
      <View key={`${item.id}-${item.timestamp.getTime()}`} style={styles.newsItem}>
        <View style={styles.newsHeader}> 
          <Text style={styles.newsChannel}>{channelName}</Text>
        </View>
        <View style={styles.newsInfoContainer}>
          <Text style={styles.newsMessage}>{highlightedText}</Text>
          <Text style={styles.newsTimestamp}>{timestamp}</Text>
        </View>
      </View>
    );
  };
  
  
  const getHighlightedText = (text, search) => {
    if (!search || !text.toLowerCase().includes(search.toLowerCase())) {
      return <Text>{text}</Text>;
    }
  
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <Text>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <Text key={i} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };
  
  const handleFilter = () => {
    setShowAllChats(selectedChannels.length === 0);

    if (modalVisible) {
      // Closing the modal, no need to update the selected channels
      setModalVisible(false);
    } else {
      // Opening the modal, update the tempSelectedChannels to the current selected channels
      setTempSelectedChannels(selectedChannels);
      setModalVisible(true);
    }
  };
  
  const applyFilter = () => {
    setSelectedChannels(tempSelectedChannels);
    setShowAllChats(tempSelectedChannels.length === 0);
    if (tempSelectedChannels.length === 0) {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => tempSelectedChannels.includes(item.channel_name));
      setFilteredNews(filtered);
    }
    setModalVisible(false);
  };

  const handleSubmitUsername = () => {
    setIsLoading(true);

    axios
      .post(`https://uni-backend.onrender.com/channels/${channelUsername}`)
      .then((response) => {
        // Handle the response as needed
        console.log(response.data);
        const statusCode = response.status;
        setChannelUsername('');
        setAddChannelPop(false);

        switch (statusCode) {
          case 200:
            Alert.alert('Success', 'Channel username submitted successfully.');
            break;
          default:
            setSubmitMessage('Something went wrong. Please try again.');
            break;
        }
      })
      .catch((error) => {
        // Handle error if request fails
        // console.log(error.response);
        if (error.response && error.response.status === 500) {
          Alert.alert('Error', 'Channel username already exists or is invalid.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.appLogoContainer}>
          <Image source={logo} style={styles.logo} />
          <Image source={logoText} style={styles.logoText} />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
          autoCapitalize='none'
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setAddChannelPop(true)}>
          <Icon name="add" size={25} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Icon name="filter" size={25} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.newsList}
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={item => `${item.id}-${item.channel_name}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={addChannelPop} 
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddChannelPop(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitleSubmit}>Add New Channel</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setAddChannelPop(false)}>
                  <Icon name="close" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
              {isLoading ? (
              <ActivityIndicator size="large" color="#009688" /> 
              ) : (
                <>
              <TextInput
                style={styles.input}
                placeholder="Enter Channel Username"
                value={channelUsername}
                autoCapitalize="none"
                onChangeText={(text) => {
                  const trimmedText = text.trim();
                  const regex = /^[a-zA-Z0-9_]*$/;

                  if (regex.test(trimmedText)) {
                    setChannelUsername(trimmedText);
                  }
                }}
              />
              <TouchableOpacity style={styles.applyButton} onPress={handleSubmitUsername}>
                <Text style={styles.applyButtonText}>Submit</Text>
              </TouchableOpacity>
            </>
            )}
            </View>
          </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Channels</Text>
            <View style={styles.channelList}>
              {channelOptions.map(channel => (
                <TouchableOpacity
                  key={channel}
                  style={[
                    styles.channelOption,
                    tempSelectedChannels.includes(channel) && styles.channelOptionSelected,
                  ]}
                  onPress={() => {
                    const updatedChannels = tempSelectedChannels.includes(channel)
                      ? tempSelectedChannels.filter(c => c !== channel)
                      : [...tempSelectedChannels, channel];
                    setTempSelectedChannels(updatedChannels);
                  }}
                >
                  <Text
                    style={[
                      styles.channelOptionText,
                      tempSelectedChannels.includes(channel) && styles.channelOptionTextSelected,
                    ]}
                  >
                    {channel}
                  </Text>
                  {tempSelectedChannels.includes(channel) ? (
                    <AntDesign name="checkcircle" size={20} color="#009688" />
                  ) : (
                    <AntDesign name="checkcircleo" size={20} color="#9e9e9e" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appLogoContainer: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  logoText: {
    width: 100,
    height: 50,
  },
  logoutButton: {
    marginRight: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#009688',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  newsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  newsItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  newsInfoContainer: {
    marginBottom: 2,
  },
  newsMessage: {
    fontSize: 14,
    color: '#555555',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  newsChannel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444444',
  },
  newsTimestamp: {
    fontSize: 12,
    color: '#999999',
    alignSelf: 'flex-end',
  },
  highlightedText: {
    backgroundColor: '#ffff00',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#999999',
    paddingHorizontal: 15,
    width: '70%'
  },
  closeButton: {
    backgroundColor: '#009688',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitleSubmit: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  channelList: {
    width: '100%',
    marginBottom: 20,
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  channelOptionSelected: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  channelOptionText: {
    marginLeft: 5,
    marginRight: 'auto',
  },
  channelOptionTextSelected: {
    fontWeight: 'bold',
    color: '#009688',
  },
  applyButton: {
    backgroundColor: '#009688',
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  applyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default HomePage;
