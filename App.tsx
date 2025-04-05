import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';


const safePadding = '5%';
const BASE_URI = 'http://192.168.1.18:5000'

function App(): React.JSX.Element {


  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${BASE_URI}/api/v1/todos/all`);
      console.log("response from local server:", response)
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (text.trim()) {
      try {
        await axios.post(`${BASE_URI}/api/v1/todos/create`, { text });
        setText('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleComplete = async (id: any, completed: any) => {
    try {
      await axios.patch(`${BASE_URI}/api/v1/todos/update/${id}`, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URI}/api/v1/todos/delete/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = () => {
    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    } else if (filter === 'pending') {
      return todos.filter((todo) => !todo.completed);
    } else {
      return todos;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={[styles.text, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => toggleComplete(item._id, item.completed)}>
        <Text style={styles.button}>
          {item.completed ? '' : 'Complete'}
        </Text>
      </TouchableOpacity>
      
        <TouchableOpacity onPress={() => deleteTodo(item._id)}>
          <Text style={styles.button}>Delete</Text>
        </TouchableOpacity>
      
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter todo"
        placeholderTextColor={'#FFF'}
        value={text}
        onChangeText={setText}
      />

      <View style={styles.filterButtons}>
        <Button title="Add" onPress={addTodo} />
      </View>

      <FlatList
        data={filteredTodos()}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: safePadding,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#FFF'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    flex: 1,
    color: '#FFF'
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  button: {
    padding: 5,
    marginHorizontal: 5,
    color: 'green',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default App;
