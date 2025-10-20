const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// 取得所有作品
router.get('/', async (req, res) => {
  try {
    const { type, featured, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (featured === 'true') where.isFeatured = true;
    
    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.work.count({ where })
    ]);

    res.json({
      works,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('取得作品錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得單個作品
router.get('/:id', async (req, res) => {
  try {
    const work = await prisma.work.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!work) {
      return res.status(404).json({ error: '作品不存在' });
    }

    res.json(work);
  } catch (error) {
    console.error('取得作品錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 建立作品
router.post('/', authenticateToken, upload.single('imageUrl'), [
  body('title').notEmpty().withMessage('標題不能為空'),
  body('company').notEmpty().withMessage('公司名稱不能為空'),
  body('type').isIn(['WEBSITE', 'ECOMMERCE', 'APP', 'OTHER']).withMessage('類型必須是 WEBSITE、ECOMMERCE、APP 或 OTHER'),
  body('linkUrl').optional().isURL().withMessage('請輸入有效的網址'),
  body('isFeatured').optional().isBoolean().withMessage('精選必須是布林值'),
  body('displayOrder').optional().isInt().withMessage('顯示順序必須是整數')
], handleMulterError, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, type, linkUrl, isFeatured = false, displayOrder = 0 } = req.body;

    const work = await prisma.work.create({
      data: {
        title,
        company,
        type,
        linkUrl,
        imageUrl: req.file ? req.file.filename : null,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        displayOrder: parseInt(displayOrder)
      }
    });

    res.status(201).json(work);
  } catch (error) {
    console.error('建立作品錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新作品
router.put('/:id', authenticateToken, upload.single('imageUrl'), [
  body('title').optional().notEmpty().withMessage('標題不能為空'),
  body('company').optional().notEmpty().withMessage('公司名稱不能為空'),
  body('type').optional().isIn(['WEBSITE', 'ECOMMERCE', 'APP', 'OTHER']).withMessage('類型必須是 WEBSITE、ECOMMERCE、APP 或 OTHER'),
  body('linkUrl').optional().isURL().withMessage('請輸入有效的網址'),
  body('isFeatured').optional().isBoolean().withMessage('精選必須是布林值'),
  body('displayOrder').optional().isInt().withMessage('顯示順序必須是整數')
], handleMulterError, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }

    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }

    const work = await prisma.work.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(work);
  } catch (error) {
    console.error('更新作品錯誤:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '作品不存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除作品
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.work.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: '作品已刪除' });
  } catch (error) {
    console.error('刪除作品錯誤:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '作品不存在' });
    }
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;



