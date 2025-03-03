<template>
  <div class="student-form-container">
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
            <h2>{{ isEdit ? '编辑学生' : '添加学生' }}</h2>
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
          
          <el-card>
            <el-form
              :model="studentForm"
              :rules="rules"
              ref="formRef"
              label-width="100px"
              :disabled="submitting"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="学号" prop="studentId">
                    <el-input v-model="studentForm.studentId" placeholder="请输入学号"></el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="studentForm.name" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="studentForm.age" :min="1" :max="100" style="width: 100%"></el-input-number>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="性别" prop="gender">
                    <el-select v-model="studentForm.gender" placeholder="请选择性别" style="width: 100%">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                      <el-option label="其他" value="其他"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="班级" prop="class">
                    <el-input v-model="studentForm.class" placeholder="请输入班级"></el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="专业" prop="major">
                    <el-input v-model="studentForm.major" placeholder="请输入专业"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-divider>联系信息</el-divider>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="电话" prop="contactInfo.phone">
                    <el-input v-model="studentForm.contactInfo.phone" placeholder="请输入电话号码"></el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="contactInfo.email">
                    <el-input v-model="studentForm.contactInfo.email" placeholder="请输入邮箱"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="地址" prop="contactInfo.address">
                <el-input v-model="studentForm.contactInfo.address" placeholder="请输入地址"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
                <el-button @click="$router.push('/students')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
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
const error = computed(() => studentStore.error);

const formRef = ref(null);
const submitting = ref(false);
const isEdit = computed(() => route.name === 'EditStudent');

// 初始化表单数据
const studentForm = reactive({
  studentId: '',
  name: '',
  age: 18,
  gender: '',
  class: '',
  major: '',
  contactInfo: {
    phone: '',
    email: '',
    address: ''
  }
});

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '年龄必须在 1 到 100 之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  class: [
    { required: true, message: '请输入班级', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  'contactInfo.phone': [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  'contactInfo.email': [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
};

// 如果是编辑模式，获取学生信息
onMounted(async () => {
  if (isEdit.value) {
    const studentId = route.params.id;
    if (studentId) {
      await studentStore.fetchStudent(studentId);
      
      if (studentStore.currentStudent) {
        // 填充表单数据
        const student = studentStore.currentStudent;
        Object.keys(studentForm).forEach(key => {
          if (key === 'contactInfo') {
            studentForm.contactInfo = {
              phone: student.contactInfo?.phone || '',
              email: student.contactInfo?.email || '',
              address: student.contactInfo?.address || ''
            };
          } else {
            studentForm[key] = student[key];
          }
        });
      }
    }
  }
});

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      
      try {
        if (isEdit.value) {
          await studentStore.updateStudent(route.params.id, studentForm);
          ElMessage.success('学生信息更新成功');
        } else {
          await studentStore.createStudent(studentForm);
          ElMessage.success('学生添加成功');
        }
        
        router.push('/students');
      } catch (error) {
        ElMessage.error(error.message || (isEdit.value ? '更新失败' : '添加失败'));
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
.student-form-container {
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
</style>