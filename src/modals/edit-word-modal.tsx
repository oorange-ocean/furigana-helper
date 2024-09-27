import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Text } from '@/ui/text';

interface EditWordModalProps {
  isVisible: boolean;
  currentWord: { surface: string; reading: string };
  onClose: () => void;
  onSave: (newWord: { surface: string; reading: string }) => void;
}

export function EditWordModal({ isVisible, currentWord, onClose, onSave }: EditWordModalProps) {
  const [newSurface, setNewSurface] = useState(currentWord.surface);
  const [newReading, setNewReading] = useState(currentWord.reading);

  const handleSave = () => {
    onSave({ surface: newSurface, reading: newReading });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>修改单词</Text>
          <TextInput
            style={styles.input}
            value={newSurface}
            onChangeText={setNewSurface}
            placeholder="输入新的单词"
          />
          <TextInput
            style={styles.input}
            value={newReading}
            onChangeText={setNewReading}
            placeholder="输入新的假名"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
  },
});