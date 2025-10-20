const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// 取得所有文章
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('取得文章錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得單篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }

    res.json(article);
  } catch (error) {
    console.error('取得文章錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 建立文章
router.post('/', authenticateToken, upload.single('coverImage'), [
  body('title').notEmpty().withMessage('標題不能為空'),
  body('content').notEmpty().withMessage('內容不能為空'),
  body('status').isIn(['DRAFT', 'PUBLISHED']).withMessage('狀態必須是 DRAFT 或 PUBLISHED')
], handleMulterError, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, status = 'DRAFT' } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        coverImage: req.file ? req.file.filename : null,
        status
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('建立文章錯誤:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: '文章標題已存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新文章
router.put('/:id', authenticateToken, upload.single('coverImage'), [
  body('title').optional().notEmpty().withMessage('標題不能為空'),
  body('content').optional().notEmpty().withMessage('內容不能為空'),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED']).withMessage('狀態必須是 DRAFT 或 PUBLISHED')
], handleMulterError, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }

    if (req.file) {
      updateData.coverImage = req.file.filename;
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(article);
  } catch (error) {
    console.error('更新文章錯誤:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除文章
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: '文章已刪除' });
  } catch (error) {
    console.error('刪除文章錯誤:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;



