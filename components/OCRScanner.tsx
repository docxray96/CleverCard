import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Camera, FlipHorizontal, X, Zap } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface OCRScannerProps {
  onScanComplete: (result: string) => void;
  onClose: () => void;
}

export function OCRScanner({ onScanComplete, onClose }: OCRScannerProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Card style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </Card>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Card style={styles.permissionCard}>
          <Camera color="#2563EB" size={48} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            CleverCard needs camera access to scan register pages and extract student data
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
        </Card>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      setIsScanning(true);
      
      if (Platform.OS === 'web') {
        // Web fallback - simulate OCR processing
        setTimeout(() => {
          const mockResult = `
            REGISTER SCAN RESULT:
            
            Student Name: John Doe
            Mathematics: 85
            English: 78
            Science: 92
            
            Student Name: Jane Smith
            Mathematics: 90
            English: 88
            Science: 85
            
            Student Name: Mike Johnson
            Mathematics: 75
            English: 82
            Science: 79
          `;
          onScanComplete(mockResult);
          setIsScanning(false);
        }, 2000);
      } else {
        // Native implementation would capture and process image
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        // In a real implementation, this would send the image to your OCR service
        // For now, we'll simulate the process
        setTimeout(() => {
          const mockResult = "Scanned register data would appear here";
          onScanComplete(mockResult);
          setIsScanning(false);
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to capture image. Please try again.');
      setIsScanning(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#ffffff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Register</Text>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <FlipHorizontal color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.frameCorner} />
            <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
            
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <Zap color="#F59E0B" size={32} />
                <Text style={styles.scanningText}>Processing...</Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Position the register page within the frame
            </Text>
            <Text style={styles.instructionSubtext}>
              Ensure good lighting and clear text visibility
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
              onPress={handleCapture}
              disabled={isScanning}
            >
              <View style={styles.captureButtonInner}>
                <Camera color="#ffffff" size={32} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  permissionCard: {
    alignItems: 'center',
    margin: 20,
    padding: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    minWidth: 160,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#F59E0B',
  },
  frameCornerTopRight: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  frameCornerBottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  frameCornerBottomRight: {
    top: undefined,
    left: undefined,
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 20,
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 8,
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});