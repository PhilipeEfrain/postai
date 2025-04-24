const dotenv = require('dotenv');
const fs = require('fs');

// Carrega variáveis do .env (funciona localmente, Vercel usa process.env automaticamente)
dotenv.config();

// Lista de variáveis obrigatórias
const requiredEnvVars = [
  'NG_API_KEY',
  'NG_AUTH_DOMAIN',
  'NG_PROJECT_ID',
  'NG_STORAGE_BUCKET',
  'NG_MESSAGING_SENDER_ID',
  'NG_APP_ID',
  'NG_MEASUREMENT_ID',
  'NG_VAPID_KEY'
];

// Verifica se todas as variáveis estão presentes
const missingVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`Erro: Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Gera o conteúdo do arquivo de configuração
const configContent = `
export const environment = {
  production: false,
  firebase: {
    apiKey: "${process.env.NG_API_KEY}",
    authDomain: "${process.env.NG_AUTH_DOMAIN}",
    projectId: "${process.env.NG_PROJECT_ID}",
    storageBucket: "${process.env.NG_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.NG_MESSAGING_SENDER_ID}",
    appId: "${process.env.NG_APP_ID}",
    measurementId: "${process.env.NG_MEASUREMENT_ID}",
    vapidKey: "${process.env.NG_VAPID_KEY}"
  }
};
`;

// Caminho onde o arquivo será gerado
const envConfigFile = './src/environments/env-config.ts';

try {
  fs.writeFileSync(envConfigFile, configContent.trim());
  console.log('✅ Arquivo de configuração de ambiente criado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao criar o arquivo de configuração:', err);
  process.exit(1);
}
