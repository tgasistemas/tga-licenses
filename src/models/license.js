module.exports = class License {
    //propriedades e funções da classe aqui
    constructor(quantidade, validade, ativo, bloqueado) {
        this.quantidade = quantidade;
        this.validade = validade;
        this.ativo = ativo;
        this.bloqueado = bloqueado;
    }
}