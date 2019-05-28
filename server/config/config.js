process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

let urlDB;

if (process.env.NODE_ENV == 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	urlDB = process.env.MONGO_URI;	
}

process.env.URL_DB = urlDB;

process.env.CLIENT_ID = process.env.CLIENT_ID || '773320020493-3srt0etie4j9fohtjt64rq2u1veo862f.apps.googleusercontent.com';