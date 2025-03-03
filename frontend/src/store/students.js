import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [],
    currentStudent: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchStudents() {
      this.loading = true;
      this.error = null;
      
      try {
        const authStore = useAuthStore();
        const response = await axios.get('http://localhost:5000/api/students', {
          headers: {
            'x-auth-token': authStore.token
          }
        });
        
        this.students = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || '获取学生列表失败';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchStudent(id) {
        this.loading = true;
        this.error = null;
        
        try {
          const authStore = useAuthStore();
          const response = await axios.get(`http://localhost:5000/api/students/${id}`, {
            headers: {
              'x-auth-token': authStore.token
            }
          });
          
          this.currentStudent = response.data;
        } catch (error) {
          this.error = error.response?.data?.message || '获取学生详情失败';
        } finally {
          this.loading = false;
        }
      },
      
      async createStudent(studentData) {
        this.loading = true;
        this.error = null;
        
        try {
          const authStore = useAuthStore();
          const response = await axios.post('http://localhost:5000/api/students', studentData, {
            headers: {
              'x-auth-token': authStore.token
            }
          });
          
          this.students.push(response.data);
          return response.data;
        } catch (error) {
          this.error = error.response?.data?.message || '创建学生失败';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      
      async updateStudent(id, studentData) {
        this.loading = true;
        this.error = null;
        
        try {
          const authStore = useAuthStore();
          const response = await axios.put(`http://localhost:5000/api/students/${id}`, studentData, {
            headers: {
              'x-auth-token': authStore.token
            }
          });
          
          // 更新本地数据
          const index = this.students.findIndex(student => student._id === id);
          if (index !== -1) {
            this.students[index] = response.data;
          }
          
          if (this.currentStudent && this.currentStudent._id === id) {
            this.currentStudent = response.data;
          }
          
          return response.data;
        } catch (error) {
          this.error = error.response?.data?.message || '更新学生失败';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      
      async deleteStudent(id) {
        this.loading = true;
        this.error = null;
        
        try {
          const authStore = useAuthStore();
          await axios.delete(`http://localhost:5000/api/students/${id}`, {
            headers: {
              'x-auth-token': authStore.token
            }
          });
          
          // 从本地数据中移除
          this.students = this.students.filter(student => student._id !== id);
          
          if (this.currentStudent && this.currentStudent._id === id) {
            this.currentStudent = null;
          }
          
          return true;
        } catch (error) {
          this.error = error.response?.data?.message || '删除学生失败';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      
      async addGrade(studentId, gradeData) {
        this.loading = true;
        this.error = null;
        
        try {
          const authStore = useAuthStore();
          const response = await axios.post(`http://localhost:5000/api/students/${studentId}/grades`, gradeData, {
            headers: {
              'x-auth-token': authStore.token
            }
          });
          
          // 更新本地数据
          if (this.currentStudent && this.currentStudent._id === studentId) {
            this.currentStudent = response.data;
          }
          
          const index = this.students.findIndex(student => student._id === studentId);
          if (index !== -1) {
            this.students[index] = response.data;
          }
          
          return response.data;
        } catch (error) {
          this.error = error.response?.data?.message || '添加成绩失败';
          throw error;
        } finally {
          this.loading = false;
        }
      }
    }
  });