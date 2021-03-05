'use strict';

const fs = require('fs');
const ValidationContract = require('../validators/fluent-validator');
const License = require("../models/license");
var firebird = require('node-firebird');
const conexao = require('../connection/firebird');
//var Crypt = require("crypto-js/");
//var SHA256 = require("crypto-js/SHA256");
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "419336459035a6d4f8d1a6964e8a0d75";// Buffer.from('419336459035a6d4f8d1a6964e8a0d75', 'hex');
const iv = '6b84e425ee0875a3';// Buffer.from('6b84e425ee0875a3', 'hex');

exports.getLicense = async(req, res, next) => {
    try {

        function encrypt(text) {
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString(), encryptedData: encrypted.toString('hex') };
        }
        console.log((key).toString());
        console.log((iv).toString());
        function decrypt(text) {
            let iv1 = Buffer.from(iv);
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv1);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
           
        
        var hw = encrypt("teste");
        // console.log(hw);
        // console.log(decrypt(hw));

        // console.log('cnpj criptografado: '+req.body.cnpj);
        // var cnpjdecripted = decrypt(req.body.cnpj);

        // console.log('cnpj descriptografado:'+cnpjdecripted);

        console.log(req.body.login);
        console.log(req.body.senha);
        var licenses = [];
        var pool = firebird.pool(5, conexao.options);
        pool.get(function(err, db) {
            if (err) {return res.status(400).send({error:"Ocorreu um erro ao tentar fazer a conexao. Erro : " +err.toString()});}
            try {db.query(
                "SELECT QUANTIDADE, VALIDADE, ATIVO, BLOQVENDA FROM NODE_FCFO2( ?,? ) ",
                // "SELECT  F.VALORULTIMOLAN AS VALIDADE "+
                // "FROM FCFO F "+
                // "LEFT JOIN FCFOCOMPL FC ON F.CODCFO = FC.CODCFO "+
                // "WHERE   F.CGCCFO = ? AND "+
                // "        F.CAMPOALFA1 =  ? AND "+
                // "        F.CODCFO = ? ",
                [req.body.login, req.body.senha], function(err, result){ //req.body.cnpj
                    try {
                        if (err) {return res.status(400).send({error:"Ocorreu um erro ao tentar fazer a consulta. Erro : " +err.toString()});}    
                        if (result != undefined) {
                            console.log('Numero de Linhas: '+result.length);
                            for(var i=0; i<result.length; i++){
                                var lic = new License();
                                let buffers = [];
                                lic.validade = (result[i].VALIDADE);
                                lic.quantidade = (result[i].QUANTIDADE);
                                lic.ativo = conexao.convertBuffer(result[i].ATIVO);
                                lic.bloqueado = conexao.convertBuffer(result[i].BLOQVENDA);
                                
                                licenses.push(lic);
                            }
                            return res.send(JSON.stringify(licenses));
                        } else {
                            res.status(400).send({ error: "Não existem dados para ser retornados" });
                        }
                    } catch (e) {
                        console.log(e);
                        res.status(400).send({ error: "Falha ao buscar dados no banco" });
                    }
                });
                db.detach();
            } catch (e) {
                console.log(e.toString());
                res.status(400).send({ error: "Falha na execução de dados: "+e.toString() });
            }        
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: "Falha ao carregar os dados do servidor" });
    }
}


exports.getLicense2 = async() => {
    try {

        function encrypt(text) {
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString(), encryptedData: encrypted.toString('hex') };
        }
        console.log((key).toString());
        console.log((iv).toString());
        function decrypt(text) {
            let iv1 = Buffer.from(iv);
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv1);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
           
        
        var hw = encrypt("teste");
        // console.log(hw);
        // console.log(decrypt(hw));

        // console.log('cnpj criptografado: '+req.body.cnpj);
        // var cnpjdecripted = decrypt(req.body.cnpj);

        // console.log('cnpj descriptografado:'+cnpjdecripted);

        var licenses = [];
        var pool = firebird.pool(5, conexao.options);
        pool.get(function(err, db) {
            if (err) {console.log("Ocorreu um erro ao tentar fazer a conexao. Erro : " +err.toString())}
            try {db.query(
                "SELECT  F.VALORULTIMOLAN AS VALIDADE "+
                "FROM FCFO F "+
                "LEFT JOIN FCFOCOMPL FC ON F.CODCFO = FC.CODCFO "+
                "WHERE   F.CGCCFO = '11.789.905/0001-09' AND "+
                "        F.CAMPOALFA1 =  '117899' AND "+
                "        F.CODCFO = 'C001940' ",
               function(err, result){
                    try {
                        // if (err) {return res.status(400).send({error:"Ocorreu um erro ao tentar fazer a consulta. Erro : " +err.toString()});}    
                        if (result != undefined) {
                            console.log('Numero de Linhas: '+result.length);
                            for(var i=0; i<result.length; i++){
                                var lic = new License();
                                let buffers = [];
                                lic.validade = (result[i].VALIDADE);
                                lic.quantidade = (result[i].NUMLICENCAS);
                                
                                licenses.push(lic);
                            }
                            return res.send(JSON.stringify(licenses));
                        } else {
                            // res.status(400).send({ error: "Não existem dados para ser retornados" });
                        }
                    } catch (e) {
                        console.log(e);
                        // res.status(400).send({ error: "Falha ao buscar dados no banco" });
                    }
                });
                db.detach();
            } catch (e) {
                console.log(e);
                // res.status(400).send({ error: "Falha na execução de dados: "+e.toString() });
            }        
        });
    } catch (e) {
        console.log(e);
        // res.status(500).send({ error: "Falha ao carregar os dados do servidor" });
    }
}