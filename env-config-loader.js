const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config(); // Carrega as variáveis do arquivo .env

// Verifica se as variáveis foram carregadas corretamente
if (!process.env.NG_API_KEY) {
  console.error('Erro: Variáveis de ambiente não encontradas.');
  process.exit(1); // Sai se não encontrar variáveis
}

// Cria o arquivo de configuração para o Angular
const envConfigFile = './src/environments/env-config.ts';
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
  }
};
`;

// Garante que o arquivo de configuração será criado
fs.writeFileSync(envConfigFile, configContent);
console.log('Configuração de variáveis de ambiente criada com sucesso!');