<?php
declare(strict_types=1);

http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
echo '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Senada Private Preview</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f5f2ec;color:#242232;font:15px Arial,sans-serif}.card{max-width:430px;padding:32px;border:1px solid #e8e2f0;border-radius:20px;background:#fff;text-align:center}.mark{margin:auto;width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#5c43ed;color:#fff;font-weight:bold}h1{font-size:23px;margin:20px 0 8px}p{font-size:13px;line-height:1.6;color:#777382}</style></head><body><main class="card"><div class="mark">S</div><h1>Senada Private Preview</h1><p>Gunakan link project preview yang diberikan oleh Senada Creatlabs. Setiap project memiliki password akses tersendiri.</p></main></body></html>';
