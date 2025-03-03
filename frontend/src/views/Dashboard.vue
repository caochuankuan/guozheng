<template>
  <div class="dashboard-container">
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
            <h2>学生管理系统</h2>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-button type="text" @click="handleLogout">退出</el-button>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="dashboard-card">
                <template #header>
                  <div class="card-header">
                    <span>学生总数</span>
                  </div>
                </template>
                <div class="card-content">
                  <h1>{{ studentCount }}</h1>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useStudentStore } from '../store/students';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();
const studentStore = useStudentStore();

const user = computed(() => authStore.user);
const studentCount = computed(() => studentStore.students.length);

onMounted(async () => {
  await studentStore.fetchStudents();
});

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
.dashboard-container {
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

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
}
</style>