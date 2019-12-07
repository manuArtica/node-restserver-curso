/**
 * =======================
 * Puerto
 * =======================
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * =======================
 * Vencimiento del token
 * =======================
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * =======================
 * SEED de autenticacion
 * =======================
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * =======================
 * Google client ID
 * =======================
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '536806906606-fm95a05192qbjvgin493fvqp7rb4i997.apps.googleusercontent.com';