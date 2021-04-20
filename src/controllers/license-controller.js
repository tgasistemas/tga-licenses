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
const key =  "3361221120183463";//"419336459035a6d4f8d1a6964e8a0d75";// Buffer.from('419336459035a6d4f8d1a6964e8a0d75', 'hex');
// const iv = '6b84e425ee0875a3';// Buffer.from('6b84e425ee0875a3', 'hex');
const iv = Buffer.alloc(16, 0); 

// private ALGORITHM:crypto.CipherGCMTypes = 'aes-256-gcm';


exports.getToken = async(req, res, next) => {
    try {

        function encrypt(text) {
            let cipher = crypto.createCipheriv(crypto.CipherCCMTypes = 'aes-128-ecb', Buffer.from(key), null); //aes-256-cbc
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString(), encryptedData: encrypted.toString('hex') };
        }
        // console.log((key).toString());
        // console.log((iv).toString());
        function decrypt(text) {
            // let iv1 = Buffer.from(iv);
            let encryptedText = Buffer.from(text['encryptedData'], 'hex');
            let decipher = crypto.createDecipheriv(crypto.CipherCCMTypes = 'aes-128-ecb', Buffer.from(key), null);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
           
        //Obtem o id od usuario da requisicao e captura 4 digitos
        var user = req.query.userid.substring(0,4);
        // console.log('string user: '+user);

        //Calcula a data de hoje mais 30 dias de liberação no formato (ddmmyyyy)
        const dNow = new Date();
        var dia = 25;
        dNow.setDate(dNow.getDate() + dia);
        var datavalidade = dNow.toISOString().substring(0,10);
        var datavalidade = datavalidade.substr(8,2)+datavalidade.substr(5,2)+datavalidade.substr(0,4);
        // console.log('data: '+datavalidade);
        var infoToCrypt = datavalidade+' '+user;
        // console.log('Criptografar: '+infoToCrypt);

        //Procedimento para criptografar
        var criptografia = encrypt(infoToCrypt);
        // console.log('Token: '+criptografia['encryptedData']);

        return res.send(JSON.stringify({token: criptografia['encryptedData']}));


        // var hw = encrypt("15042021 LFXX");
        // console.log(hw);
        // console.log(decrypt(hw));

        // console.log('cnpj criptografado: '+req.body.cnpj);
        // var cnpjdecripted = decrypt(req.body.cnpj);

        // console.log('cnpj descriptografado:'+cnpjdecripted);

        // console.log(req.body.login);
        // console.log(req.body.senha);

    } catch (e) {
        console.log(e);
        res.status(500).send({ error: "Falha ao carregar os dados" });
    }
}

exports.getValidade = async(req, res, next) => {
    try {
        // function encrypt(text) {
        //     let cipher = crypto.createCipheriv(crypto.CipherCCMTypes = 'aes-128-ecb', Buffer.from(key), null); //aes-256-cbc
        //     let encrypted = cipher.update(text);
        //     encrypted = Buffer.concat([encrypted, cipher.final()]);
        //     return { iv: iv.toString(), encryptedData: encrypted.toString('hex') };
        // }
        // console.log((key).toString());
        // console.log((iv).toString());
        function decrypt(text) {
            // let iv1 = Buffer.from(iv);
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv(crypto.CipherCCMTypes = 'aes-128-ecb', Buffer.from(key), null);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }

        //Obtem a chave do usuario na requisicao
        var chave = req.query.chave;
        console.log(chave);
           
        //Obtem o id od usuario da requisicao e captura 4 digitos
        // var user = req.query.userid.substring(0,4);
        // console.log('string user: '+user);

        //Calcula a data de hoje mais 30 dias de liberação no formato (ddmmyyyy)
        // const dNow = new Date();
        // var dia = 25;
        // dNow.setDate(dNow.getDate() + dia);
        // var datavalidade = dNow.toISOString().substring(0,10);
        // var datavalidade = datavalidade.substr(8,2)+datavalidade.substr(5,2)+datavalidade.substr(0,4);
        // console.log('data: '+datavalidade);
        // var infoToCrypt = datavalidade+' '+user;
        // console.log('Criptografar: '+infoToCrypt);

        //Procedimento para descriptografar
        var descriptografia = decrypt(chave);
        var data = descriptografia.substring(0,8)
        console.log('Data: '+data);

        data = data.substr(0,2)+'/'+data.substr(2,2)+'/'+data.substr(4,4);
        console.log('Data formatada: '+data);

        return res.send(JSON.stringify({validade: data}));
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: "Falha ao carregar os dados" });
    }
}

exports.getLicense = async(req, res, next) => {
    try {

        // function encrypt(text) {
        //     let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        //     let encrypted = cipher.update(text);
        //     encrypted = Buffer.concat([encrypted, cipher.final()]);
        //     return { iv: iv.toString(), encryptedData: encrypted.toString('hex') };
        // }
        // console.log((key).toString());
        // console.log((iv).toString());
        // function decrypt(text) {
        //     let iv1 = Buffer.from(iv);
        //     let encryptedText = Buffer.from(text, 'hex');
        //     let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv1);
        //     let decrypted = decipher.update(encryptedText);
        //     decrypted = Buffer.concat([decrypted, decipher.final()]);
        //     return decrypted.toString();
        // }
           
        
        // var hw = encrypt("teste");
        // console.log(hw);
        // console.log(decrypt(hw));

        // console.log('cnpj criptografado: '+req.body.cnpj);
        // var cnpjdecripted = decrypt(req.body.cnpj);

        // console.log('cnpj descriptografado:'+cnpjdecripted);

        // console.log(req.body.login);
        // console.log(req.body.senha);

        var licenses = [];
        // var pool = firebird.pool(5, conexao.options);
        // pool.get(function(err, db) {
        firebird.attach(conexao.options,function(err, db) {
            if (err) {return res.status(400).send({error:"Ocorreu um erro ao tentar fazer a conexao. Erro : " +err.toString()});}
            try {db.query(
                "SELECT QUANTIDADE, ATIVO, BLOQVENDA FROM NODE_FCFO( ?,?,? ) ",
                // "SELECT  F.VALORULTIMOLAN AS VALIDADE "+
                // "FROM FCFO F "+
                // "LEFT JOIN FCFOCOMPL FC ON F.CODCFO = FC.CODCFO "+
                // "WHERE   F.CODCFO = ? AND "+
                // "        F.CAMPOALFA1 =  ? ",
                [req.body.login, req.body.senha, req.body.codcgc], function(err, result){ //req.body.cnpj
                    try {
                        if (err) {return res.status(400).send({error:"Ocorreu um erro ao tentar fazer a consulta. Erro : " +err.toString()});}    
                        if (result[0].ATIVO != null) {
                            // console.log('Numero de Linhas: '+result.length);
                            
                            for(var i=0; i<result.length; i++){
                                var lic = new License();
                                if(result[i].QUANTIDADE == 0 || result[i].QUANTIDADE == null)
                                    lic.error = 'Nenhuma licença do TGA Mobile disponível. Por favor, entre em contato com a TGA Sistemas através do telefone (65) 3339-0800!';
                                else if(conexao.convertBuffer(result[i].ATIVO) != 'T' || conexao.convertBuffer(result[i].BLOQVENDA) == 'T')
                                    lic.error = 'Não foi possivel liberar a licença. Por favor, entre em contato com a TGA Sistemas através do telefone (65) 3339-0800!';
                                
                                if(lic.error == null){
                                    let buffers = [];
                                    //lic.validade = (result[i].VALIDADE);
                                    lic.quantidade = (result[i].QUANTIDADE);
                                    lic.ativo = conexao.convertBuffer(result[i].ATIVO);
                                    lic.bloqueado = conexao.convertBuffer(result[i].BLOQVENDA);
                                }
                                licenses.push(lic);
                            }

                            db.detach();
                            return res.send(JSON.stringify(licenses));
                        } else {
                            db.detach();
                            var lic = new License();
                            lic.error = 'Cliente não encontrado';
                            licenses.push(lic);
                            res.status(400).send(JSON.stringify(licenses));
                        }
                    } catch (e) {
                        db.detach();
                        console.log(e);
                        res.status(400).send({ error: "Falha ao buscar dados no banco" });
                    }
                });
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