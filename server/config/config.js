process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV == 'dev'){
	urlDB = 'mongodb://localhost:27018/cafe';
} else {
	urlDB = 'mongodb+srv://pschrut:fwfRSjS0tcBlCUHa@cluster0-g4cpb.mongodb.net/cafe';	
}

process.env.URL_DB = urlDB;