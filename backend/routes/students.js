const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// 获取所有学生
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取单个学生
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: '找不到该学生' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建学生
router.post('/', auth, async (req, res) => {
  const student = new Student(req.body);
  
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新学生
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: '找不到该学生' });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除学生
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: '找不到该学生' });
    res.json({ message: '学生已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 添加成绩
router.post('/:id/grades', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: '找不到该学生' });
    
    student.grades.push(req.body);
    await student.save();
    
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;