#!/usr/bin/env node

import fetch from 'node-fetch';
import crypto from 'crypto';

// Конфігурація
const config = {
    // Замініть на ваші дані
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || 'EAAoE0agTPecBPMctYn9yAJPJ6R1hQXJZCIlhx8LcOzRSW56vj2FeZCCj5NJHuxdJpuK4eNhfZAkcD86cH3eQfaBXXKdXzOZAAZBQuyozW7Gcl7iLTxHnVSzujiZBYVtxsTYjmphEcZBNH9XE1W0npGO2YZAgg1R1YaMGTrFrWwAgOsESZA3JhxO39nJZCl6GIYnmEx7gZDZD',
    pixelId: process.env.FACEBOOK_PIXEL_ID || '1321174279619179',
    
    // URL для тестування (замініть на ваш)
    apiUrl: process.env.API_URL || 'http://localhost:3000/api/collect',
    
    // Тестові дані
    testData: {
        event_name: 'TestEvent',
        event_id: `test_${Date.now()}`,
        user_data: {
            email: 'test@example.com',
            phone: '+380501234567',
            fbp: 'fbp_test_123',
            fbc: 'fbc_test_123'
        }
    }
};

// Функція для хешування
function hash(input) {
    return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

// Функція для тестування локального API
async function testLocalAPI() {
    console.log('🧪 Тестуємо локальний API...');
    
    try {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config.testData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Локальний API працює!');
            console.log('📊 Відповідь:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ Помилка локального API');
            console.log('📊 Помилка:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.log('❌ Помилка підключення до локального API');
        console.log('📊 Помилка:', error.message);
    }
}

// Функція для прямого тестування Facebook API
async function testDirectFacebook() {
    console.log('🧪 Тестуємо прямий запит до Facebook...');
    
    if (config.accessToken === 'YOUR_ACCESS_TOKEN_HERE') {
        console.log('❌ Введіть ваш Access Token в config.accessToken');
        return;
    }

    try {
        // Хешуємо дані
        const hashedEmail = hash(config.testData.user_data.email);
        const hashedPhone = hash(config.testData.user_data.phone);

        const payload = {
            event_name: config.testData.event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: config.testData.event_id,
            action_source: "website",
            user_data: {
                em: hashedEmail,
                ph: hashedPhone,
                fbp: config.testData.user_data.fbp,
                fbc: config.testData.user_data.fbc,
                client_user_agent: 'Test-Script/1.0',
                client_ip_address: "127.0.0.1"
            }
        };

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${config.pixelId}/events?access_token=${config.accessToken}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [payload] })
            }
        );

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Прямий запит до Facebook успішний!');
            console.log('📊 Відповідь:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ Помилка прямого запиту до Facebook');
            console.log('📊 Помилка:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.log('❌ Помилка підключення до Facebook');
        console.log('📊 Помилка:', error.message);
    }
}

// Функція для тестування Vercel API
async function testVercelAPI(vercelUrl) {
    console.log('🧪 Тестуємо Vercel API...');
    
    try {
        const response = await fetch(`${vercelUrl}/api/collect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config.testData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Vercel API працює!');
            console.log('📊 Відповідь:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ Помилка Vercel API');
            console.log('📊 Помилка:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.log('❌ Помилка підключення до Vercel API');
        console.log('📊 Помилка:', error.message);
    }
}

// Головна функція
async function main() {
    console.log('🚀 Тестування Facebook CAPI');
    console.log('========================');
    
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'local':
            await testLocalAPI();
            break;
        case 'facebook':
            await testDirectFacebook();
            break;
        case 'vercel':
            const vercelUrl = args[1];
            if (!vercelUrl) {
                console.log('❌ Введіть URL Vercel сайту: node test-api.js vercel https://your-site.vercel.app');
                return;
            }
            await testVercelAPI(vercelUrl);
            break;
        case 'all':
            console.log('\n1️⃣ Тестуємо локальний API...');
            await testLocalAPI();
            console.log('\n2️⃣ Тестуємо прямий Facebook API...');
            await testDirectFacebook();
            break;
        default:
            console.log('📖 Використання:');
            console.log('  node test-api.js local          - тест локального API');
            console.log('  node test-api.js facebook       - тест прямого Facebook API');
            console.log('  node test-api.js vercel <url>   - тест Vercel API');
            console.log('  node test-api.js all            - тест всіх варіантів');
            console.log('\n⚠️  Не забудьте налаштувати config.accessToken для тесту Facebook API');
    }
}

// Запуск
main().catch(console.error); 