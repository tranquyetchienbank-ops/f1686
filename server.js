const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ========== CẤUX HÌNH STATIC FILES ==========
app.use(express.static(path.join(__dirname, 'public')));

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== LOGGING ==========
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString('vi-VN')}] ${req.method} ${req.path}`);
  next();
});

// ========== ROUTE CHÍNH ==========
app.get('/', (req, res) => {
  try {
    // Lấy từ .env, nếu không có thì dùng default
    const webLink = process.env.WEB_LINK || 'https://f1686s.com/home/mine';
    const tapmonkeyFile = process.env.TAPMONKEY_FILE || 'tapmonkey/f1686s_naptien.js';
    
    const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Cloud Web - TapMonkey</title>
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        html, body { 
          width: 100%; 
          height: 100%; 
          overflow: hidden;
        }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f0f0;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 20px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header h1 {
          font-size: 24px;
          margin: 0;
          font-weight: 600;
        }
        
        .container {
          display: flex;
          height: calc(100% - 70px);
          gap: 5px;
          padding: 5px;
          background: #f0f0f0;
        }
        
        .section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
          min-width: 0;
        }
        
        .section-title {
          background: #2c3e50;
          color: white;
          padding: 12px 16px;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
          border-bottom: 2px solid #667eea;
        }
        
        .section-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #999;
          font-size: 14px;
        }
        
        .status {
          position: fixed;
          bottom: 15px;
          right: 15px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 12px;
          z-index: 999;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status::before {
          content: '●';
          font-size: 10px;
          animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            gap: 5px;
          }
          
          .header h1 {
            font-size: 18px;
          }
          
          .section-title {
            font-size: 12px;
            padding: 10px 12px;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 10px;
            height: 60px;
          }
          
          .container {
            height: calc(100% - 60px);
          }
          
          .header h1 {
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>☁️ Cloud Web Server</h1>
      </div>
      
      <div class="container">
        <!-- Phần trang web chính -->
        <div class="section">
          <div class="section-title">📱 Trang Web Chính</div>
          <div class="section-content">
            <iframe 
              id="webFrame" 
              src="${webLink}"
              title="Trang web chính"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            ></iframe>
            <div class="loading" id="webLoading">Đang tải...</div>
          </div>
        </div>
        
        <!-- Phần TapMonkey -->
        <div class="section">
          <div class="section-title">⚙️ TapMonkey Script</div>
          <div class="section-content">
            <iframe 
              id="tapmonkeyFrame" 
              src="${tapmonkeyFile}"
              title="TapMonkey Script"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
            <div class="loading" id="tapLoading">Đang tải...</div>
          </div>
        </div>
      </div>
      
      <div class="status">✅ Server đang chạy</div>
      
      <script>
        console.log('========== CLOUD WEB SERVER ==========');
        console.log('✅ Server started successfully');
        console.log('📱 Web Link:', '${webLink}');
        console.log('⚙️ TapMonkey:', '${tapmonkeyFile}');
        console.log('⏰ Time:', new Date().toLocaleString('vi-VN'));
        console.log('======================================');
        
        // Hide loading khi iframe load xong
        document.getElementById('webFrame').onload = function() {
          const loading = document.getElementById('webLoading');
          if (loading) loading.style.display = 'none';
        };
        
        document.getElementById('tapmonkeyFrame').onload = function() {
          const loading = document.getElementById('tapLoading');
          if (loading) loading.style.display = 'none';
        };
      </script>
    </body>
    </html>
    `;
    
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('❌ Error in route /:', error);
    res.status(500).send('❌ Server Error: ' + error.message);
  }
});

// ========== ROUTE SERVE TAPMONKEY ==========
app.get('/tapmonkey/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Security: chỉ allow tên file safe
    if (!/^[\w\-\.]+$/.test(filename)) {
      return res.status(400).send('Invalid filename');
    }
    
    const filePath = path.join(__dirname, 'public', 'tapmonkey', filename);
    
    // Check nếu file tồn tại
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return res.status(404).send(`❌ File not found: ${filename}`);
    }
    
    console.log(`✅ Serving: ${filename}`);
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath);
  } catch (error) {
    console.error('❌ Error serving tapmonkey:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// ========== API STATUS ==========
app.get('/api/status', (req, res) => {
  try {
    res.json({
      status: 'running',
      server: 'Cloud Web Server on Render',
      uptime: process.uptime(),
      timestamp: new Date().toLocaleString('vi-VN'),
      environment: process.env.NODE_ENV || 'production'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== API CONFIG ==========
app.get('/api/config', (req, res) => {
  try {
    res.json({
      webLink: process.env.WEB_LINK || 'Not set',
      tapmonkeyFile: process.env.TAPMONKEY_FILE || 'Not set',
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ========== KHỞI ĐỘNG SERVER ==========
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ☁️  CLOUD WEB SERVER - RENDER         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server started successfully`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Web Link: ${process.env.WEB_LINK || 'https://f1686s.com/home/mine'}`);
  console.log(`📦 TapMonkey: ${process.env.TAPMONKEY_FILE || 'tapmonkey/f1686s_naptien.js'}`);
  console.log(`⏰ Time: ${new Date().toLocaleString('vi-VN')}`);
  console.log('');
  console.log('Press Ctrl+C to stop server');
  console.log('');
});

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGTERM', () => {
  console.log('\n⚠️ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});
