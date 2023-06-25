import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';
import logo from '../assets/logo_transparent_notext.jpeg';
import logoText from '../assets/logo_transparent_onlytext.jpeg';
import BottomBar from '../BottomBar';
import Icon from 'react-native-vector-icons/Ionicons';

const HomePage = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = firestore.collection('news');
        const snapshot = await newsRef.get();
        const newsData = snapshot.docs.map(doc => ({ id: doc.id, message_text: doc.data().message_text }));
        setNews(newsData);
      } catch (error) {
        console.log('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

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

  const renderNewsItem = ({ item }) => (
    <View style={styles.newsItem}>
      <View style={styles.newsInfoContainer}>
        <Text style={styles.newsTitle}>{item.message_text}</Text>
      </View>
    </View>
  );

  const handleSearch = () => {
    if (searchText === '') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item =>
        item.message_text.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredNews(filtered);
    }
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.newsContainer}>
        <FlatList data={filteredNews} renderItem={renderNewsItem} keyExtractor={item => item.id} />
      </View>
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -5,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingLeft: 6,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
    paddingRight: 6,
  },
  newsContainer: {
    flex: 1,
    margin: 10,
  },
  newsItem: {
    marginBottom: 16,
    alignItems: 'center',
  },
  newsInfoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 40,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomePage;
