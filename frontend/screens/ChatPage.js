import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../BottomBar';
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

  const handleSendMessage = async () => {
    if (!currentChat || messageText.trim() === '') {
      return;
    }
  
    const newMessage = {
      username: username, // Add the username to the new message
      message: messageText.trim(),
    };
    setMessageText('');
  
    const updatedMessages = [...currentChat.messages, newMessage]; // Update the messages array
  
    await firestore.collection('chats').doc(currentChat.id).update({
      messages: updatedMessages,
    });
  
    setCurrentChat(prevChat => ({
      ...prevChat,
      messages: updatedMessages,
    }));
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
        {!isSentByCurrentUser && index === 0 && (
          <Text style={styles.chatName}>{currentChat.title}</Text>
        )}
        <View style={[styles.messageItem, itemStyle]}>
          <Text style={usernameStyle}>{item.username}</Text>
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
            autoCapitalize="none" 
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </SafeAreaView>
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
        <FlatList
          data={chats.slice().reverse()} // Reverse the order of the chat items
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
    marginRight: -16,
  },
  createChatButton: {
    marginLeft: 'auto', 
  },
  pageTitle: {
    fontSize: 24,
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
    paddingBottom: 16, // Add some bottom padding to prevent the last chat item from being hidden behind the bottom bar
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
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  username: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  hiddenUsername: {
    height: 0,
    width: 0,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  messageInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default ChatPage;