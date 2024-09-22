import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useCallback,useState } from 'react';
import { ActivityIndicator, Image, Modal,StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/ui/text';

interface ImageModalProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
  onImageUpdate: (newUri: string) => Promise<void>;
}

export function ImageModal({ isVisible, imageUri, onClose, onImageUpdate }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleUpload = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newUri = FileSystem.documentDirectory + asset.name;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newUri,
        });
        await onImageUpdate(newUri);
        onClose();
      }
    } catch (err) {
      console.error('Error picking cover image:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onImageUpdate, onClose]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {imageError ? (
            <Text style={styles.errorText}>图片加载失败</Text>
          ) : (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image} 
              onError={() => setImageError(true)}
            />
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>上传新图片</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    width: '80%',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#4B5563',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});