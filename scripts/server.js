import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware, } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : '../.env';
dotenv.config({ path: path.join(__dirname, envPath) });

const {
  AEM_URL = 'https://author-p10652-e192853-cmstg.adobeaemcloud.com',
  AEM_FORM_BASE_PATH = '/content/forms/af',
  AEM_TOKEN,
  AEM_USER_NAME,
  AEM_PASSWORD,
  PORT = 3000,
} = process.env;
console.log(process.env);

const EDS_URL = process.env.EDS_URL || AEM_URL;
const app = express();

const authorization = AEM_TOKEN ? `Bearer ${AEM_TOKEN}` : `Basic ${Buffer.from(`${AEM_USER_NAME}:${AEM_PASSWORD}`).toString('base64')}`;

const defaultOpts = {
  changeOrigin: true,
  logLevel: 'debug',
}
const options = {
  ...defaultOpts,
  target: AEM_URL,
  headers: {
    Authorization: authorization,
  }
};

const eds_options = {
  ...defaultOpts,
  target: EDS_URL,
  pathRewrite: {
    [`^/eds`]: '',
  },
};
let proxyMiddleware, p1, p2, edsContent
if (AEM_URL) {
  proxyMiddleware = createProxyMiddleware(AEM_FORM_BASE_PATH, options);
  p1 = createProxyMiddleware('/adobe', options);
  p2 = createProxyMiddleware('/content/dam', options);
  app.use(AEM_FORM_BASE_PATH, proxyMiddleware);
  app.use('/adobe', p1);
  app.use('/content/dam', p2);
}

if (EDS_URL) {
  edsContent = createProxyMiddleware('/eds', eds_options);
  app.use('/eds', edsContent);
}

// app.get('/src/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../src', req.path.replace('/src', '')));
// });

app.get('/blocks/form/*', (req, res) => {
  const newpath = path.join(__dirname, '../' ,req.path);
  res.sendFile(newpath);
});

// app.get('/icons/*', (req, res) => {
//   const newpath = path.join(__dirname, '../src', req.path);
//   res.sendFile(newpath);
// });

app.get('/js/*', (req, res) => {
  console.log(req.path);
  res.sendFile(path.join(__dirname, '../public', req.path));
});

// Serve index.html for all other paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
  open(`http://localhost:${PORT}`);
});
