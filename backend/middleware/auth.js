const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 获取token
  const token = req.header('x-auth-token');
  
  // 检查是否有token
  if (!token) {
    return res.status(401).json({ message: '没有提供token，授权失败' });
  }
  
  try {
    // 验证token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    
    // 将用户信息添加到请求
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'token无效' });
  }
};