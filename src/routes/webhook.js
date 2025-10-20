const express = require('express');

const router = express.Router();

// n8n webhook
router.post('/n8n', (req, res) => {
  console.log('收到 n8n webhook:', req.body);
  res.json({ received: true });
});

// LINE webhook
router.post('/line', (req, res) => {
  console.log('收到 LINE webhook:', req.body);
  res.json({ received: true });
});

module.exports = router;



