<template>
  <div class="student-list-container">
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
            <h2>学生管理</h2>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-button type="text" @click="handleLogout">退出</el-button>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <div class="toolbar">
            <el-button type="primary" @click="$router.push('/students/add')">添加学生</el-button>
            <el-input
              v-model="searchQuery"
              placeholder="搜索学生"
              style="width: 300px; margin-left: 16px;"
              clearable
            >
              <template #prefix>
                <el-icon><el-icon-search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <el-table
            v-loading="loading"
            :data="filteredStudents"
            border
            style="width: 100%"
          >
            <el-table-column prop="studentId" label="学号" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column prop="gender" label="性别" width="80" />
            <el-table-column prop="class" label="班级" width="120" />
            <el-table-column prop="major" label="专业" width="150" />
            <el-table-column prop="contactInfo.phone" label="联系电话" width="150" />
            
            <el-table-column label="操作" width="250">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  @click="$router.push(`/students/${row._id}`)"
                >
                  查看
                </el-button>
                <el-button
                  size="small"
                  type="warning"
                  @click="$router.push(`/students/edit/${row._id}`)"
                >
                  编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="pagination-container">
            <el-pagination
              v-if="filteredStudents.length > 0"
              layout="total, sizes, prev, pager, next"
              :total="filteredStudents.length"
              :page-size="pageSize"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useStudentStore } from '../store/students';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();
const studentStore = useStudentStore();

const user = computed(() => authStore.user);
const loading = computed(() => studentStore.loading);
const students = computed(() => studentStore.students);
const error = computed(() => studentStore.error);

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 过滤学生列表
const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return students.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return students.value.filter(student => 
    student.name.toLowerCase().includes(query) || 
    student.studentId.toLowerCase().includes(query) ||
    student.class.toLowerCase().includes(query) ||
    student.major.toLowerCase().includes(query)
  );
});

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
};

// 删除学生
const handleDelete = (student) => {
  ElMessageBox.confirm(
    `确定要删除学生 ${student.name} 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await studentStore.deleteStudent(student._id);
        ElMessage.success('删除成功');
      } catch (error) {
        ElMessage.error(error.message || '删除失败');
      }
    })
    .catch(() => {
      // 用户取消删除
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

// 组件挂载时获取学生列表
onMounted(async () => {
  await studentStore.fetchStudents();
});
</script>

<style scoped>
.student-list-container {
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

.toolbar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>