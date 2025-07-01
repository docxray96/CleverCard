import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Camera, 
  Mic, 
  TrendingUp,
  Plus,
  Bell,
  Settings
} from 'lucide-react-native';

export default function HomeScreen() {
  const { user, classes, students, reports, loadClasses, loadStudents, loadReports, isLoading } = useAppStore();

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadReports();
  }, []);

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalReports = reports.length;

  const quickActions = [
    {
      icon: Camera,
      title: 'Scan Register',
      subtitle: 'OCR digitization',
      color: '#2563EB',
      onPress: () => router.push('/ocr-scanner'),
    },
    {
      icon: Mic,
      title: 'Voice Remarks',
      subtitle: 'Speech-to-text',
      color: '#059669',
      onPress: () => router.push('/voice-recorder'),
    },
    {
      icon: Plus,
      title: 'New Class',
      subtitle: 'Create class',
      color: '#EA580C',
      onPress: () => router.push('/create-class'),
    },
    {
      icon: FileText,
      title: 'Generate Report',
      subtitle: 'AI insights',
      color: '#7C3AED',
      onPress: () => router.push('/reports'),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{user?.full_name || 'Teacher'}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Bell color="#ffffff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Settings color="#ffffff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: '#2563EB' }]}>
                  <BookOpen color="#ffffff" size={20} />
                </View>
                <Text style={styles.statValue}>{totalClasses}</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
            </Card>
            
            <Card style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: '#059669' }]}>
                  <Users color="#ffffff" size={20} />
                </View>
                <Text style={styles.statValue}>{totalStudents}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: '#FEF3E2' }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: '#EA580C' }]}>
                  <FileText color="#ffffff" size={20} />
                </View>
                <Text style={styles.statValue}>{totalReports}</Text>
                <Text style={styles.statLabel}>Reports</Text>
              </View>
            </Card>
            
            <Card style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: '#7C3AED' }]}>
                  <TrendingUp color="#ffffff" size={20} />
                </View>
                <Text style={styles.statValue}>89%</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <Card style={styles.actionCard}>
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <action.icon color="#ffffff" size={28} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#EFF6FF' }]}>
                <FileText color="#2563EB" size={20} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Report generated for Class 5A</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityDivider} />
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#ECFDF5' }]}>
                <Users color="#059669" size={20} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>3 new students added to Class 4B</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            
            <View style={styles.activityDivider} />
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF3E2' }]}>
                <Camera color="#EA580C" size={20} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Register scanned for Mathematics</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: 160,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activityCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});