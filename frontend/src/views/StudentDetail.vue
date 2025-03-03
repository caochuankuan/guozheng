<template>
  <div class="student-detail-container">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><el-icon-menu /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <el-menu-item index="/students">
            <el-icon><el-icon-user /></el-icon>
            <span>学生管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header>
          <div class="header-container">
            <h2>学生详情</h2>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-button type="text" @click="handleLogout">退出</el-button>
            </div>
          </div>
        </el-header>
        
        <el-main v-loading="loading">
          <div class="back-link">
            <el-button type="text" @click="$router.push('/students')">
              <el-icon><el-icon-back /></el-icon> 返回学生列表
            </el-button>
          </div>
          
          <el-row :gutter="20" v-if="student">
            <el-col :span="16">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>基本信息</span>
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="$router.push(`/students/edit/${student._id}`)"
                    >
                      编辑
                    </el-button>
                  </div>
                </template>
                
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="学号">{{ student.studentId }}</el-descriptions-item>
                  <el-descriptions-item label="姓名">{{ student.name }}</el-descriptions-item>
                  <el-descriptions-item label="年龄">{{ student.age }}</el-descriptions-item>
                  <el-descriptions-item label="性别">{{ student.gender }}</el-descriptions-item>
                  <el-descriptions-item label="班级">{{ student.class }}</el-descriptions-item>
                  <el-descriptions-item label="专业">{{ student.major }}</el-descriptions-item>
                  <el-descriptions-item label="电话">{{ student.contactInfo?.phone || '未填写' }}</el-descriptions-item>
                  <el-descriptions-item label="邮箱">{{ student.contactInfo?.email || '未填写' }}</el-descriptions-item>
                  <el-descriptions-item label="地址" :span="2">{{ student.contactInfo?.address || '未填写' }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>
          
          <el-row :gutter="20" v-if="student" style="margin-top: 20px;">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>成绩信息</span>
                    <el-button type="primary" size="small" @click="dialogVisible = true">添加成绩</el-button>
                  </div>
                </template>
                
                <el-table :data="student.grades" border style="width: 100%">
                  <el-table-column prop="course" label="课程" />
                  <el-table-column prop="score" label="分数" />
                  <el-table-column prop="semester" label="学期" />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
          
          <el-empty v-if="!student && !loading" description="未找到学生信息" />
        </el-main>
      </el-container>
    </el-container>
    
    <!-- 添加成绩对话框 -->
    <el-dialog v-model="dialogVisible" title="添加成绩" width="30%">
      <el-form :model="gradeForm" :rules="rules" ref="gradeFormRef" label-width="80px">
        <el-form-item label="课程" prop="course">
          <el-input v-model="gradeForm.course" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="gradeForm.score" :min="0" :max="100" :precision="1"></el-input-number>
        </el-form-item>
        
        <el-form-item label="学期" prop="semester">
          <el-input v-model="gradeForm.semester" placeholder="例如：2023-2024学年第一学期"></el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddGrade" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useStudentStore } from '../store/students';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const studentStore = useStudentStore();

const user = computed(() => authStore.user);
const loading = computed(() => studentStore.loading);
const student = computed(() => studentStore.currentStudent);
const error = computed(() => studentStore.error);

const dialogVisible = ref(false);
const submitting = ref(false);
const gradeFormRef = ref(null);
const gradeForm = ref({
  course: '',
  score: 0,
  semester: ''
});

const rules = {
  course: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  semester: [{ required: true, message: '请输入学期', trigger: 'blur' }]
};

// 获取学生信息
onMounted(async () => {
  const studentId = route.params.id;
  if (studentId) {
    await studentStore.fetchStudent(studentId);
  }
});

// 添加成绩
const handleAddGrade = async () => {
  if (!gradeFormRef.value) return;
  
  await gradeFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      
      try {
        await studentStore.addGrade(student.value._id, gradeForm.value);
        ElMessage.success('成绩添加成功');
        dialogVisible.value = false;
        
        // 重置表单
        gradeForm.value = {
          course: '',
          score: 0,
          semester: ''
        };
      } catch (error) {
        ElMessage.error(error.message || '添加成绩失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.logout();
    router.push('/login');
  }).catch(() => {});
};
</script>

<style scoped>
.student-detail-container {
  height: 100vh;
}

.sidebar-menu {
  height: 100%;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-link {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>