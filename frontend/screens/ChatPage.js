import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { firestore, auth } from '../firebase';

const ChatPage = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');

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

  const handleChatPress = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setCurrentChat(chat);
  };

  const handleSendMessage = () => {
    if (messageText.trim() === '') {
      return;
    }

    const newMessage = {
      username,
      message: messageText.trim(),
    };
    setMessageText('');

    firestore.collection('chats').doc(currentChat.id).update({
      messages: [...currentChat.messages, newMessage],
    });
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
    const usernameStyle = index === 0 ? styles.username : styles.hiddenUsername;
  
    return (
      <View style={[styles.messageItemContainer, containerStyle]}>
        <View style={[styles.messageItem, itemStyle]}>
          <Text style={usernameStyle}>{index === 0 ? item.username : ''}</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  if (currentChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentChat(null)}>
            <Icon name="arrow-back-outline" size={24} style={styles.backButtonIcon} />
          </TouchableOpacity>
          <Text style={styles.pageTitleInner}>{currentChat.title}</Text>
        </View>
        <FlatList
          data={currentChat.messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
        />
        <SafeAreaView style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            autoCorrect={false}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.createChatButton} onPress={handleCreateChat}>
          <Icon name="add-outline" size={24} style={styles.createChatButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Chats</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonIcon: {
    color: '#333',
  },
  createChatButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  createChatButtonIcon: {
    color: '#007BFF',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  pageTitleInner: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  messageItemContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
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
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hiddenUsername: {
    display: 'none',
  },
  messageText: {
    fontWeight: 'normal',
  },
  messageInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatPage;
