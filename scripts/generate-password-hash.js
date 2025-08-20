#!/usr/bin/env node

/**
 * パスワードハッシュ生成スクリプト
 * 使用方法: node scripts/generate-password-hash.js [password]
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('エラー: パスワードを指定してください');
    console.log('使用方法: node scripts/generate-password-hash.js [password]');
    process.exit(1);
}

const saltRounds = 12;

try {
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('生成されたパスワードハッシュ:');
    console.log(hash);
    console.log('\n.env.local ファイルに以下を追加してください:');
    console.log(`AUTH_PASSWORD_HASH="${hash.replace(/\$/g, '\\$')}"`);
    console.log('\n注意: bcryptハッシュの$記号は\\でエスケープされています。');
} catch (error) {
    console.error('パスワードハッシュの生成中にエラーが発生しました:', error);
    process.exit(1);
}
