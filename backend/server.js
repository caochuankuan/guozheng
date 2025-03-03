const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/students');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/student_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

// 路由
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.send('学生管理系统API运行中');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
});