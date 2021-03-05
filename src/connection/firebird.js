'use strict';
require('dotenv/config');
console.log('user '+process.env.USER);
console.log('pass '+process.env.PASS);
exports.options = {
    host: process.env.HOST,
    port: process.env.PORTFB,
    database: "E:\\Base Clientes\\Supreloja\\TGA.FDB",//process.env.DATABASE, //"C:/TGA/Dados/TGA.FDB", C:\\TGA\\Dados\\CONTROLE\\NODE.FDB
    user: process.env.USER,
    password: process.env.PASS,
    lowercase_keys: false, // set to true to lowercase keys
    role: null,            // default
    pageSize: 4096         // default when creating database
};
 exports.convertBuffer = (buf) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
 }

