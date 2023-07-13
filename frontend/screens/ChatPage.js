import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
import Filter from 'bad-words';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../BottomBar';
import { ChatContext } from '../ChatContext';
import { firestore, auth } from '../firebase';

const ChatPage = ({ navigation }) => {
  const { selectedModules, setSelectedModules, showAllModules, setShowAllModules } = useContext(ChatContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchText2, setSearchText2] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [tempSelectedModules, setTempSelectedModules] = useState([]);
  const flatListRef = useRef(null);
  const filter = new Filter();
  const currentChatMessages = currentChat?.messages || [];

  useEffect(() => {
    const unsubscribe = firestore.collection('chats').onSnapshot(snapshot => {
      const updatedChats = [];
      const options = [];

      snapshot.forEach(doc => {
        const { moduleCode, messages } = doc.data();
        updatedChats.push({
          id: doc.id,
          moduleCode,
          messages,
        });
        options.push(moduleCode);
      });

      setChats(updatedChats);
      setModuleOptions(options);
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
        chat.moduleCode && chat.moduleCode.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchText, chats]);

  useEffect(() => {
    if (searchText2 === '') {
      setModuleOptions(chats.map(chat => chat.moduleCode));
    } else {
      const filtered = chats.filter(chat =>
        chat.moduleCode && chat.moduleCode.toLowerCase().includes(searchText2.toLowerCase())
      );
      setModuleOptions(filtered.map(chat => chat.moduleCode));
    }
  }, [searchText2, chats]);

  useEffect(() => {
    if (showAllModules) {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) => selectedModules.includes(chat.moduleCode));
      setFilteredChats(filtered);
    }
  }, [selectedModules, showAllModules, chats]);

  const handleChatPress = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setCurrentChat(chat);
  };

  const handleSendMessage = async () => {
    if (!currentChat || messageText.trim() === '') {
      return;
    }
  
    const filteredMessage = filter.clean(messageText.trim());
  
    const newMessage = {
      username: username,
      message: filteredMessage,
    };
    setMessageText('');
  
    const updatedMessages = [...currentChat.messages, newMessage];
  
    await firestore.collection('chats').doc(currentChat.id).update({
      messages: updatedMessages,
    });
  
    setCurrentChat((prevChat) => ({
      ...prevChat,
      messages: updatedMessages,
    }));
  
    // Scroll to the last message
    if (currentChatMessages.length > 0) {
      flatListRef.current.scrollToEnd();
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.chatItem} onPress={() => handleChatPress(item.id)}>
      <Text style={styles.chatTitle}>{item.moduleCode}</Text>
    </TouchableOpacity>
  );

  const handleFilter = () => {
    setShowAllModules(selectedModules.length === 0);

    if (modalVisible) {
      setModalVisible(false);
    } else {
      setTempSelectedModules([...selectedModules]);
      setModalVisible(true);
    }
  };

  const applyFilter = () => {
    setSelectedModules(tempSelectedModules);
    setShowAllModules(tempSelectedModules.length === 0);

    if (tempSelectedModules.length === 0) {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) => tempSelectedModules.includes(chat.moduleCode));
      setFilteredChats(filtered);
    }

    setModalVisible(false);
  };

  const renderMessageItem = ({ item, index }) => {
    const isSentByCurrentUser = item.username === username;
    const containerStyle = isSentByCurrentUser
      ? styles.sentMessageContainer
      : styles.receivedMessageContainer;

    return (
      <View style={[styles.messageItemContainer, containerStyle]}>
        <View style={styles.messageItem}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
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
            <Text style={styles.pageTitleInner}>{currentChat.moduleCode}</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={currentChatMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => `${item.id}-${index}`} // Unique key for each message item
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => {
              if (currentChatMessages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
            onLayout={() => {
              if (currentChatMessages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
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
          <View style={styles.headerContent} />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Icon name="filter" size={25} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredChats.slice().reverse()}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id.toString()} // Use the id property as the key
          contentContainerStyle={styles.messageList}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Modules</Text>
              <View style={styles.searchContainer2}>
                <TextInput
                  style={styles.searchInput2}
                  placeholder="Search modules..."
                  value={searchText2}
                  onChangeText={setSearchText2}
                  autoCapitalize="none"
                />
              </View>
              <ScrollView style={styles.moduleList}>
                <View style={styles.moduleOptionsContainer}>
                  {moduleOptions.map((moduleCode) => (
                    <TouchableOpacity
                      key={moduleCode}
                      style={[
                        styles.moduleOption,
                        tempSelectedModules.includes(moduleCode) && styles.moduleOptionSelected,
                      ]}
                      onPress={() => {
                        const updatedModules = tempSelectedModules.includes(moduleCode)
                          ? tempSelectedModules.filter((c) => c !== moduleCode)
                          : [...tempSelectedModules, moduleCode];
                        setTempSelectedModules(updatedModules);
                      }}
                    >
                      <Text
                        style={[
                          styles.moduleOptionText,
                          tempSelectedModules.includes(moduleCode) && styles.moduleOptionTextSelected,
                        ]}
                      >
                        {moduleCode}
                      </Text>
                      {tempSelectedModules.includes(moduleCode) ? (
                        <AntDesign name="checkcircle" size={20} color="#009688" />
                      ) : (
                        <AntDesign name="checkcircleo" size={20} color="#9e9e9e" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  filterButton: {
    backgroundColor: '#009688',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
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
    height: '42%',
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
    marginBottom: 13,
  },
  moduleList: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 20,
  },
  moduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleOptionSelected: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  moduleOptionText: {
    marginLeft: 5,
    marginRight: 'auto',
  },
  moduleOptionTextSelected: {
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
    marginRight: 6,
    padding: 2,
    textAlignVertical: 'center',
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
    paddingHorizontal: 7,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: '9%',
  },
  searchInput2: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 10,
  },
});

export default ChatPage;
