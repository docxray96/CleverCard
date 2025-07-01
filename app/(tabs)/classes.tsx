import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Calendar,
  Search,
  Filter
} from 'lucide-react-native';

export default function ClassesScreen() {
  const { classes, loadClasses, createClass, isLoading } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    academic_year: '2024',
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreateClass = async () => {
    if (!newClass.name || !newClass.subject) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createClass({
        name: newClass.name,
        subject: newClass.subject,
        academic_year: newClass.academic_year,
        school_id: 'default', // Will be updated when schools are implemented
      });
      
      setNewClass({ name: '', subject: '', academic_year: '2024' });
      setShowCreateForm(false);
      Alert.alert('Success', 'Class created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create class');
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && classes.length === 0) {
    return <LoadingSpinner text="Loading classes..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            containerStyle={styles.searchInputWrapper}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <Card style={styles.createForm}>
          <Text style={styles.formTitle}>Create New Class</Text>
          
          <Input
            label="Class Name"
            placeholder="e.g., Class 5A, Grade 10 Mathematics"
            value={newClass.name}
            onChangeText={(text) => setNewClass(prev => ({ ...prev, name: text }))}
          />
          
          <Input
            label="Subject"
            placeholder="e.g., Mathematics, English, Science"
            value={newClass.subject}
            onChangeText={(text) => setNewClass(prev => ({ ...prev, subject: text }))}
          />
          
          <Input
            label="Academic Year"
            placeholder="2024"
            value={newClass.academic_year}
            onChangeText={(text) => setNewClass(prev => ({ ...prev, academic_year: text }))}
          />
          
          <View style={styles.formActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateForm(false)}
              style={styles.cancelButton}
            />
            <Button
              title="Create Class"
              onPress={handleCreateClass}
              style={styles.createButton}
            />
          </View>
        </Card>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredClasses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <BookOpen color="#6B7280" size={48} />
            <Text style={styles.emptyTitle}>No Classes Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first class to start managing students and reports
            </Text>
            <Button
              title="Create First Class"
              onPress={() => setShowCreateForm(true)}
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <View style={styles.classesGrid}>
            {filteredClasses.map((cls) => (
              <TouchableOpacity key={cls.id} activeOpacity={0.8}>
                <Card style={styles.classCard}>
                  <View style={styles.classHeader}>
                    <View style={styles.classIcon}>
                      <BookOpen color="#2563EB" size={24} />
                    </View>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <Text style={styles.classSubject}>{cls.subject}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.classStats}>
                    <View style={styles.statItem}>
                      <Users color="#6B7280" size={16} />
                      <Text style={styles.statText}>{cls.student_count || 0} students</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Calendar color="#6B7280" size={16} />
                      <Text style={styles.statText}>{cls.academic_year}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.classActions}>
                    <Button
                      title="View Students"
                      variant="outline"
                      size="small"
                      onPress={() => {}}
                    />
                    <Button
                      title="Reports"
                      size="small"
                      onPress={() => {}}
                      style={styles.reportsButton}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInputWrapper: {
    flex: 1,
    marginBottom: 0,
    marginLeft: 12,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  createForm: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
  classesGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  classCard: {
    marginBottom: 16,
    padding: 20,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  classStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  classActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reportsButton: {
    flex: 1,
  },
});