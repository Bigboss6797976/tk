const express = require('express');
const QRCode = require('qrcode');
const TronWeb = require('tronweb');

const app = express();
const PORT = process.env.PORT || 8080;

// ================== 配置区 ==================
const RECEIVER = "TFFiryCmVh6We5s5Miwppz8...";   // 你的收款地址
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8k...";   // TRON USDT 合约

// ================== 路由 ==================
app.get('/', async (req, res) => {
    try {
        const host = req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const pageUrl = `\( {protocol}:// \){host}`;

        // 生成二维码（包含你的收款地址）
        const qrBase64 = await QRCode.toDataURL(`tron:${RECEIVER}?amount=100&token=USDT`);

        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USDT 收款</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: linear-gradient(135deg, #0f0f2f, #1a1a3a);
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .card {
            background: white;
            color: #333;
            max-width: 380px;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            text-align: center;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #00d4aa;
            margin: 15px 0;
        }
        #qrcode {
            margin: 20px auto;
            padding: 15px;
            background: white;
            border-radius: 15px;
        }
        .address {
            font-size: 14px;
            word-break: break-all;
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            margin: 15px 0;
        }
        button {
            background: #00d4aa;
            color: white;
            border: none;
            padding: 14px 30px;
            border-radius: 50px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>💰 USDT 收款</h2>
        <div class="amount">任意金额</div>
        
        <div id="qrcode"></div>
        
        <div class="address">
            ${RECEIVER}
        </div>
        
        <button onclick="copyAddress()">复制地址</button>
        <p style="margin-top:15px; font-size:14px; color:#666;">TRC20 网络 • 实时到账</p>
    </div>

    <script>
        new QRCode(document.getElementById("qrcode"), {
            text: "tron:${RECEIVER}",
            width: 220,
            height: 220,
            colorDark : "#000000",
            colorLight : "#ffffff",
        });

        function copyAddress() {
            navigator.clipboard.writeText("${RECEIVER}");
            alert("地址已复制！");
        }
    </script>
</body>
</html>`;

        res.send(html);
    } catch (e) {
        res.status(500).send("服务器错误");
    }
});

// 状态检查
app.get('/status', (req, res) => {
    res.json({ status: "ok", models_available: 0 });
});

app.listen(PORT, () => {
    console.log(`✅ 服务已启动: http://localhost:${PORT}`);
});
