const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/student_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

// 创建默认管理员账号
const createAdmin = async () => {
  try {
    // 检查是否已存在管理员账号
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('管理员账号已存在，无需创建');
      return;
    }
    
    // 创建新管理员账号
    const admin = new User({
      username: 'admin',
      password: 'admin123',  // 密码会通过中间件自动加密
      role: 'admin'
    });
    
    await admin.save();
    console.log('管理员账号创建成功');
    console.log('用户名: admin');
    console.log('密码: admin123');
    
  } catch (error) {
    console.error('创建管理员账号失败:', error);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
  }
};

// 执行初始化
createAdmin();