import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MediaCMSInstance } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface InstanceCardProps {
  instance: MediaCMSInstance;
  onPress: () => void;
  onDelete: () => void;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({ instance, onPress, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainContent} onPress={onPress}>
        <View style={styles.iconContainer}>
          <Ionicons name="server" size={24} color="#FF0000" />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{instance.name}</Text>
          <Text style={styles.url} numberOfLines={1}>{instance.url}</Text>
          {instance.username && (
            <Text style={styles.username}>@{instance.username}</Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  url: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  username: {
    color: '#AAA',
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2A',
  },
});
