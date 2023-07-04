import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../BottomBar';
import { firestore, auth } from '../firebase';

const ChatPage = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = firestore.collection('chats').onSnapshot(snapshot => {
      const updatedChats = snapshot.docs.map(doc => {
        const { title, messages } = doc.data();
        return {
          id: doc.id,
          title,
          messages,
        };
      });
      setChats(updatedChats);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection('users').doc(auth.currentUser.uid).onSnapshot(snapshot => {
      const userData = snapshot.data();
      setUsername(userData.username);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchText, chats]);

  const handleChatPress = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setCurrentChat(chat);
  };

  const handleSendMessage = async () => {
    if (!currentChat || messageText.trim() === '') {
      return;
    }

    const newMessage = {
      username: username,
      message: messageText.trim(),
    };
    setMessageText('');

    const updatedMessages = [...currentChat.messages, newMessage];

    await firestore.collection('chats').doc(currentChat.id).update({
      messages: updatedMessages,
    });

    setCurrentChat(prevChat => ({
      ...prevChat,
      messages: updatedMessages,
    }));

    // Scroll to the last message
    flatListRef.current.scrollToEnd();
  };

  const handleCreateChat = () => {
    Alert.prompt(
      'Create New Chat',
      'Enter the chat name:',
      (chatName) => {
        if (chatName.trim() !== '') {
          firestore.collection('chats').add({
            title: chatName.trim(),
            messages: [],
          });
        }
      }
    );
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.id)}>
      <Text style={styles.chatTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item, index }) => {
    const isSentByCurrentUser = item.username === username;
    const containerStyle = isSentByCurrentUser
      ? styles.sentMessageContainer
      : styles.receivedMessageContainer;
    const itemStyle = isSentByCurrentUser
      ? styles.sentMessageItem
      : styles.receivedMessageItem;

    return (
      <View style={[styles.messageItemContainer, containerStyle]}>
        <View style={styles.messageItem}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  if (currentChat) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.innerHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentChat(null)}>
              <Icon name="arrow-back-outline" size={24} style={styles.backButtonIcon} />
            </TouchableOpacity>
            <Text style={styles.pageTitleInner}>{currentChat.title}</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={currentChat.messages}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
          <View style={styles.messageInputContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={messageText}
                onChangeText={(text) => setMessageText(text)}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                autoCorrect={false}
                onSubmitEditing={handleSendMessage}
                multiline={true}
                returnKeyType="default"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <BottomBar navigation={navigation} />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Chats</Text>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.createChatButtonContainer} onPress={handleCreateChat}>
              <Icon name="create-outline" size={24} style={styles.createChatButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize='none'
          />
        </View>
        <FlatList
          data={filteredChats.slice().reverse()}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />
        <BottomBar navigation={navigation} />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    padding: 16,
  },
  innerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    padding: 8,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonIcon: {
    color: '#333',
  },
  createChatButton: {
    marginLeft: 'auto', 
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  pageTitleInner: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
  },
  messageList: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 16, 
  },
  messageItemContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
  },
  sentMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageItem: {
    padding: 8,
    backgroundColor: '#DCF8C6',
    marginVertical: 2,
    borderRadius: 16,
    maxWidth: '80%',
  },
  receivedMessageItem: {
    alignSelf: 'flex-start',
  },
  sentMessageItem: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  username: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageInputContainer: {
    borderTopWidth: 1,
    padding: 3,
    borderTopColor: '#ccc',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  messageInput: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    textAlignVertical: 'auto',
  },
  sendButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ChatPage;
