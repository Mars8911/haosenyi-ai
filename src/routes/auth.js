const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// 登入
router.post('/login', [
  body('username').notEmpty().withMessage('使用者名稱不能為空'),
  body('password').notEmpty().withMessage('密碼不能為空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ error: '使用者名稱或密碼錯誤' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '使用者名稱或密碼錯誤' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 建立初始管理員帳號
router.post('/seed-admin', [
  body('username').notEmpty().withMessage('使用者名稱不能為空'),
  body('email').isEmail().withMessage('請輸入有效的電子郵件'),
  body('password').isLength({ min: 6 }).withMessage('密碼至少需要6個字元')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // 檢查是否已有管理員
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return res.status(400).json({ error: '管理員帳號已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    res.json({
      message: '管理員帳號建立成功',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('建立管理員錯誤:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: '使用者名稱或電子郵件已存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;



