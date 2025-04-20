import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api';

export default function AdminMenuManagementScreen() {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch menu items');
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!name || !category || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      if (editingItemId) {
        await api.put(`/admin/menu/${editingItemId}`, { name, category, price: parseFloat(price) });
        Alert.alert('Success', 'Menu item updated');
      } else {
        await api.post('/admin/menu', { name, category, price: parseFloat(price) });
        Alert.alert('Success', 'Menu item added');
      }
      setName('');
      setCategory('');
      setPrice('');
      setEditingItemId(null);
      fetchMenuItems();
    } catch (err) {
      Alert.alert('Error', 'Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setEditingItemId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/menu/${id}`);
      Alert.alert('Success', 'Menu item deleted');
      fetchMenuItems();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete menu item');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name} - ${item.price.toFixed(2)}</Text>
      <View style={styles.buttons}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button title="Delete" color="red" onPress={() => handleDelete(item._id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Menu Management</Text>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />
      <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title={editingItemId ? "Update Item" : "Add Item"} onPress={handleAddOrUpdate} />
      <FlatList
        data={menuItems}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
