const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 開始種子資料...');

    // 檢查是否已有管理員
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      console.log('✅ 管理員帳號已存在，跳過建立');
    } else {
      // 建立預設管理員
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const admin = await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@haosenyi.com',
          password: hashedPassword
        }
      });
      
      console.log('✅ 預設管理員帳號建立成功:');
      console.log('   使用者名稱: admin');
      console.log('   密碼: admin123');
    }

    // 建立範例文章
    const existingArticles = await prisma.article.count();
    if (existingArticles === 0) {
      await prisma.article.createMany({
        data: [
          {
            title: '歡迎來到 HaoSenYi AI',
            slug: 'welcome-to-haosenyi-ai',
            content: '這是第一篇範例文章，介紹我們的 AI 服務。',
            status: 'PUBLISHED'
          },
          {
            title: 'AI 技術的未來發展',
            slug: 'ai-technology-future',
            content: '探討人工智慧技術在未來的發展趨勢和應用。',
            status: 'DRAFT'
          }
        ]
      });
      console.log('✅ 範例文章建立成功');
    }

    // 建立範例作品
    const existingWorks = await prisma.work.count();
    if (existingWorks === 0) {
      await prisma.work.createMany({
        data: [
          {
            title: '電商平台開發',
            company: 'ABC 公司',
            type: 'ECOMMERCE',
            linkUrl: 'https://example.com',
            isFeatured: true,
            displayOrder: 1
          },
          {
            title: '企業官網設計',
            company: 'XYZ 企業',
            type: 'WEBSITE',
            linkUrl: 'https://example2.com',
            isFeatured: false,
            displayOrder: 2
          },
          {
            title: '手機 APP 開發',
            company: 'DEF 科技',
            type: 'APP',
            linkUrl: 'https://example3.com',
            isFeatured: true,
            displayOrder: 3
          }
        ]
      });
      console.log('✅ 範例作品建立成功');
    }

    console.log('🎉 種子資料完成！');
    
  } catch (error) {
    console.error('❌ 種子資料錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();


