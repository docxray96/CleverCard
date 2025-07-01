import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mic, Square, Play, Pause, X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface VoiceRecorderProps {
  onRecordingComplete: (transcription: string) => void;
  onClose: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onClose }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  
  const pulseAnimation = useSharedValue(1);
  const timerRef = useRef<NodeJS.Timeout>();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  React.useEffect(() => {
    if (isRecording) {
      pulseAnimation.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
      
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      timerRef.current = timer;
    } else {
      pulseAnimation.value = withTiming(1);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please grant microphone permission to record audio.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setDuration(0);
    } catch (err) {
      Alert.alert('Failed to start recording', 'Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const pauseRecording = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const processRecording = async () => {
    if (!recordingUri) return;

    try {
      setIsProcessing(true);
      
      // Simulate speech-to-text processing
      // In a real implementation, this would send the audio to a service like OpenAI Whisper
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscription = `
        Student Performance Remarks:
        
        John Doe has shown excellent progress in mathematics this term. His problem-solving skills have improved significantly, and he demonstrates strong analytical thinking. However, he could benefit from more practice in written communication for his English assignments.
        
        Jane Smith continues to excel across all subjects. Her leadership qualities are evident during group activities, and she consistently helps her peers. I recommend challenging her with more advanced reading materials.
        
        Mike Johnson has made remarkable improvement in science. His curiosity and eagerness to learn are commendable. He should focus on organizing his work better and managing his time during exams.
      `;
      
      onRecordingComplete(mockTranscription);
      setIsProcessing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to process recording');
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.recorderCard}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Voice Recorder</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.visualizer}>
            <Animated.View style={[styles.microphoneContainer, animatedStyle]}>
              <View style={[styles.microphoneButton, isRecording && styles.microphoneButtonActive]}>
                <Mic color={isRecording ? "#ffffff" : "#2563EB"} size={48} />
              </View>
            </Animated.View>
            
            <Text style={styles.instruction}>
              {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
            </Text>
            
            <Text style={styles.timer}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.controls}>
            {!isRecording && !recordingUri && (
              <Button
                title="Start Recording"
                onPress={startRecording}
                style={styles.recordButton}
              />
            )}

            {isRecording && (
              <Button
                title="Stop Recording"
                onPress={stopRecording}
                variant="secondary"
                style={styles.stopButton}
              />
            )}

            {recordingUri && !isRecording && (
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={isPlaying ? pauseRecording : playRecording}
                >
                  {isPlaying ? (
                    <Pause color="#2563EB" size={24} />
                  ) : (
                    <Play color="#2563EB" size={24} />
                  )}
                </TouchableOpacity>

                <Button
                  title="Process Recording"
                  onPress={processRecording}
                  loading={isProcessing}
                  style={styles.processButton}
                />

                <Button
                  title="Restart"
                  onPress={() => {
                    setRecordingUri(null);
                    setDuration(0);
                    if (sound) {
                      sound.unloadAsync();
                      setSound(null);
                    }
                  }}
                  variant="outline"
                  style={styles.restartButton}
                />
              </View>
            )}
          </View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>Recording Tips:</Text>
            <Text style={styles.tipsText}>• Speak clearly and at a moderate pace</Text>
            <Text style={styles.tipsText}>• Find a quiet environment</Text>
            <Text style={styles.tipsText}>• Hold the device close to your mouth</Text>
            <Text style={styles.tipsText}>• Include student names for better organization</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recorderCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  content: {
    alignItems: 'center',
  },
  visualizer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  microphoneContainer: {
    marginBottom: 16,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    borderWidth: 3,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  microphoneButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  instruction: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  controls: {
    width: '100%',
    marginBottom: 24,
  },
  recordButton: {
    width: '100%',
  },
  stopButton: {
    width: '100%',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processButton: {
    flex: 1,
  },
  restartButton: {
    minWidth: 80,
  },
  tips: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});