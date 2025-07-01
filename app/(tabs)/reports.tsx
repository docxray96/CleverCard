import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Award,
  Brain,
  Calendar,
  Users,
  Download,
  Share
} from 'lucide-react-native';

export default function ReportsScreen() {
  const { reports, students, classes, loadReports, loadStudents, loadClasses, isLoading } = useAppStore();
  const [selectedTerm, setSelectedTerm] = useState('current');

  useEffect(() => {
    loadReports();
    loadStudents();
    loadClasses();
  }, []);

  const getStudentById = (studentId: string) => {
    return students.find(student => student.id === studentId);
  };

  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  const filteredReports = reports.filter(report => {
    if (selectedTerm === 'current') return true;
    return report.term === selectedTerm;
  });

  const averageScore = reports.length > 0 
    ? reports.reduce((sum, report) => sum + report.total_score, 0) / reports.length 
    : 0;

  const topPerformers = reports
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, 3);

  if (isLoading && reports.length === 0) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Analytics Cards */}
        <View style={styles.analyticsSection}>
          <View style={styles.analyticsRow}>
            <Card style={[styles.analyticsCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={styles.analyticsContent}>
                <View style={[styles.analyticsIcon, { backgroundColor: '#2563EB' }]}>
                  <FileText color="#ffffff" size={20} />
                </View>
                <Text style={styles.analyticsValue}>{reports.length}</Text>
                <Text style={styles.analyticsLabel}>Total Reports</Text>
              </View>
            </Card>
            
            <Card style={[styles.analyticsCard, { backgroundColor: '#ECFDF5' }]}>
              <View style={styles.analyticsContent}>
                <View style={[styles.analyticsIcon, { backgroundColor: '#059669' }]}>
                  <TrendingUp color="#ffffff" size={20} />
                </View>
                <Text style={styles.analyticsValue}>{averageScore.toFixed(1)}%</Text>
                <Text style={styles.analyticsLabel}>Avg Score</Text>
              </View>
            </Card>
          </View>

          <View style={styles.analyticsRow}>
            <Card style={[styles.analyticsCard, { backgroundColor: '#FEF3E2' }]}>
              <View style={styles.analyticsContent}>
                <View style={[styles.analyticsIcon, { backgroundColor: '#EA580C' }]}>
                  <Award color="#ffffff" size={20} />
                </View>
                <Text style={styles.analyticsValue}>{topPerformers.length}</Text>
                <Text style={styles.analyticsLabel}>Top Performers</Text>
              </View>
            </Card>
            
            <Card style={[styles.analyticsCard, { backgroundColor: '#F3E8FF' }]}>
              <View style={styles.analyticsContent}>
                <View style={[styles.analyticsIcon, { backgroundColor: '#7C3AED' }]}>
                  <Brain color="#ffffff" size={20} />
                </View>
                <Text style={styles.analyticsValue}>
                  {reports.filter(r => r.ai_insights && r.ai_insights.length > 0).length}
                </Text>
                <Text style={styles.analyticsLabel}>AI Insights</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Term Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Term</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.termFilters}>
              {['current', 'Term 1 2024', 'Term 2 2024', 'Term 3 2024'].map((term) => (
                <TouchableOpacity
                  key={term}
                  style={[
                    styles.termFilter,
                    selectedTerm === term && styles.termFilterActive
                  ]}
                  onPress={() => setSelectedTerm(term)}
                >
                  <Text style={[
                    styles.termFilterText,
                    selectedTerm === term && styles.termFilterTextActive
                  ]}>
                    {term === 'current' ? 'All Terms' : term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <Card style={styles.topPerformersCard}>
              {topPerformers.map((report, index) => {
                const student = getStudentById(report.student_id);
                const studentClass = student ? getClassById(student.class_id) : null;
                
                return (
                  <View key={report.id}>
                    <View style={styles.performerItem}>
                      <View style={styles.performerRank}>
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                      </View>
                      <View style={styles.performerInfo}>
                        <Text style={styles.performerName}>
                          {student?.full_name || 'Unknown Student'}
                        </Text>
                        <Text style={styles.performerClass}>
                          {studentClass?.name || 'Unknown Class'} • {report.term}
                        </Text>
                      </View>
                      <View style={styles.performerScore}>
                        <Text style={styles.scoreValue}>{report.total_score}%</Text>
                        <Text style={styles.scoreGrade}>{report.grade}</Text>
                      </View>
                    </View>
                    {index < topPerformers.length - 1 && <View style={styles.performerDivider} />}
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Reports List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Reports</Text>
          
          {filteredReports.length === 0 ? (
            <Card style={styles.emptyCard}>
              <FileText color="#6B7280" size={48} />
              <Text style={styles.emptyTitle}>No Reports Yet</Text>
              <Text style={styles.emptySubtitle}>
                Generate your first report from student data
              </Text>
              <Button
                title="Create First Report"
                onPress={() => {}}
                style={styles.emptyButton}
              />
            </Card>
          ) : (
            <View style={styles.reportsList}>
              {filteredReports.map((report) => {
                const student = getStudentById(report.student_id);
                const studentClass = student ? getClassById(student.class_id) : null;
                
                return (
                  <TouchableOpacity key={report.id} activeOpacity={0.8}>
                    <Card style={styles.reportCard}>
                      <View style={styles.reportHeader}>
                        <View style={styles.reportIcon}>
                          <FileText color="#2563EB" size={24} />
                        </View>
                        <View style={styles.reportInfo}>
                          <Text style={styles.reportStudent}>
                            {student?.full_name || 'Unknown Student'}
                          </Text>
                          <Text style={styles.reportDetails}>
                            {studentClass?.name || 'Unknown Class'} • {report.term}
                          </Text>
                        </View>
                        <View style={styles.reportScore}>
                          <Text style={styles.reportScoreValue}>{report.total_score}%</Text>
                          <Text style={styles.reportGrade}>{report.grade}</Text>
                        </View>
                      </View>
                      
                      {report.ai_insights && report.ai_insights.length > 0 && (
                        <View style={styles.insightsPreview}>
                          <Brain color="#7C3AED" size={16} />
                          <Text style={styles.insightsText}>
                            {report.ai_insights.length} AI insights available
                          </Text>
                        </View>
                      )}
                      
                      <View style={styles.reportMeta}>
                        <View style={styles.metaItem}>
                          <Calendar color="#6B7280" size={16} />
                          <Text style={styles.metaText}>
                            {new Date(report.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Users color="#6B7280" size={16} />
                          <Text style={styles.metaText}>
                            {Object.keys(report.scores).length} subjects
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.reportActions}>
                        <Button
                          title="View Details"
                          variant="outline"
                          size="small"
                          onPress={() => {}}
                          style={styles.actionButton}
                        />
                        <TouchableOpacity style={styles.iconButton}>
                          <Download color="#6B7280" size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                          <Share color="#6B7280" size={18} />
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
  scrollView: {
    flex: 1,
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  analyticsCard: {
    flex: 1,
    padding: 16,
  },
  analyticsContent: {
    alignItems: 'center',
  },
  analyticsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  termFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  termFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  termFilterActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  termFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  termFilterTextActive: {
    color: '#ffffff',
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
  topPerformersCard: {
    padding: 0,
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  performerClass: {
    fontSize: 14,
    color: '#6B7280',
  },
  performerScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  scoreGrade: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  performerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
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
  reportsList: {
    gap: 16,
  },
  reportCard: {
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportStudent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportScore: {
    alignItems: 'center',
  },
  reportScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  reportGrade: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  insightsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  insightsText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});