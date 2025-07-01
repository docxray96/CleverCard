import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  BookOpen
} from 'lucide-react-native';

export default function StudentsScreen() {
  const { students, classes, loadStudents, loadClasses, createStudent, isLoading } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    registration_number: '',
    class_id: '',
    parent_contact: '',
    gender: 'male' as 'male' | 'female',
  });

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const handleCreateStudent = async () => {
    if (!newStudent.full_name || !newStudent.registration_number || !newStudent.class_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createStudent(newStudent);
      setNewStudent({
        full_name: '',
        registration_number: '',
        class_id: '',
        parent_contact: '',
        gender: 'male',
      });
      setShowCreateForm(false);
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add student');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class_id === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  if (isLoading && students.length === 0) {
    return <LoadingSpinner text="Loading students..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color="#6B7280" size={20} />
            <Input
              placeholder="Search students..."
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

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.classFilters}
          contentContainerStyle={styles.classFiltersContent}
        >
          <TouchableOpacity
            style={[
              styles.classFilterItem,
              selectedClass === 'all' && styles.classFilterItemActive
            ]}
            onPress={() => setSelectedClass('all')}
          >
            <Text style={[
              styles.classFilterText,
              selectedClass === 'all' && styles.classFilterTextActive
            ]}>
              All Classes
            </Text>
          </TouchableOpacity>
          {classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={[
                styles.classFilterItem,
                selectedClass === cls.id && styles.classFilterItemActive
              ]}
              onPress={() => setSelectedClass(cls.id)}
            >
              <Text style={[
                styles.classFilterText,
                selectedClass === cls.id && styles.classFilterTextActive
              ]}>
                {cls.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {showCreateForm && (
        <Card style={styles.createForm}>
          <Text style={styles.formTitle}>Add New Student</Text>
          
          <Input
            label="Full Name"
            placeholder="Student's full name"
            value={newStudent.full_name}
            onChangeText={(text) => setNewStudent(prev => ({ ...prev, full_name: text }))}
          />
          
          <Input
            label="Registration Number"
            placeholder="e.g., STU001, 2024001"
            value={newStudent.registration_number}
            onChangeText={(text) => setNewStudent(prev => ({ ...prev, registration_number: text }))}
          />
          
          <View style={styles.selectField}>
            <Text style={styles.selectLabel}>Class</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.classOptions}>
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.classOption,
                      newStudent.class_id === cls.id && styles.classOptionActive
                    ]}
                    onPress={() => setNewStudent(prev => ({ ...prev, class_id: cls.id }))}
                  >
                    <Text style={[
                      styles.classOptionText,
                      newStudent.class_id === cls.id && styles.classOptionTextActive
                    ]}>
                      {cls.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <Input
            label="Parent Contact (Optional)"
            placeholder="Phone number or email"
            value={newStudent.parent_contact}
            onChangeText={(text) => setNewStudent(prev => ({ ...prev, parent_contact: text }))}
          />
          
          <View style={styles.formActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateForm(false)}
              style={styles.cancelButton}
            />
            <Button
              title="Add Student"
              onPress={handleCreateStudent}
              style={styles.createButton}
            />
          </View>
        </Card>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredStudents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Users color="#6B7280" size={48} />
            <Text style={styles.emptyTitle}>No Students Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedClass !== 'all' ? 
                'Try adjusting your search or filter' : 
                'Add your first student to get started'
              }
            </Text>
            {!searchQuery && selectedClass === 'all' && (
              <Button
                title="Add First Student"
                onPress={() => setShowCreateForm(true)}
                style={styles.emptyButton}
              />
            )}
          </Card>
        ) : (
          <View style={styles.studentsList}>
            {filteredStudents.map((student) => {
              const studentClass = getClassById(student.class_id);
              return (
                <TouchableOpacity key={student.id} activeOpacity={0.8}>
                  <Card style={styles.studentCard}>
                    <View style={styles.studentHeader}>
                      <View style={styles.studentAvatar}>
                        <User color="#2563EB" size={24} />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.full_name}</Text>
                        <Text style={styles.studentReg}>{student.registration_number}</Text>
                      </View>
                      <View style={styles.studentBadge}>
                        <Text style={styles.badgeText}>
                          {student.gender === 'male' ? 'M' : 'F'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.studentDetails}>
                      <View style={styles.detailItem}>
                        <BookOpen color="#6B7280" size={16} />
                        <Text style={styles.detailText}>
                          {studentClass?.name || 'Unknown Class'}
                        </Text>
                      </View>
                      {student.parent_contact && (
                        <View style={styles.detailItem}>
                          <Phone color="#6B7280" size={16} />
                          <Text style={styles.detailText}>{student.parent_contact}</Text>
                        </View>
                      )}
                      <View style={styles.detailItem}>
                        <Calendar color="#6B7280" size={16} />
                        <Text style={styles.detailText}>
                          Added {new Date(student.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.studentActions}>
                      <Button
                        title="View Reports"
                        variant="outline"
                        size="small"
                        onPress={() => {}}
                      />
                      <Button
                        title="Edit"
                        size="small"
                        onPress={() => {}}
                        style={styles.editButton}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  classFilters: {
    maxHeight: 50,
  },
  classFiltersContent: {
    paddingRight: 20,
  },
  classFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  classFilterItemActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  classFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  classFilterTextActive: {
    color: '#ffffff',
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
  selectField: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  classOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  classOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  classOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  classOptionTextActive: {
    color: '#ffffff',
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
  studentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  studentCard: {
    marginBottom: 16,
    padding: 20,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  studentReg: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  studentBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  studentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  studentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
});