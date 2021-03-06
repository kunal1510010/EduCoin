const  SHA256 = require('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); 
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            console.log(this.hash);
        }

        console.log('Block Mined: ' + this.hash);
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(Date().toLocaleLowerCase(), 'Genesis Block', '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock);
    // } 
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date().toLocaleLowerCase(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully Mined!!!!!');
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward),
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for (const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}


let educoin = new BlockChain();

// console.log('mining 1');
// educoin.addBlock(new Block(1, Date().toLocaleLowerCase(), {amount: 5}));
// console.log('mining 2');
// educoin.addBlock(new Block(2, Date().toLocaleLowerCase(), {amount: 10}));
// console.log('mining 3');
// educoin.addBlock(new Block(3, Date().toLocaleLowerCase(), {amount: 10}));

// console.log(JSON.stringify(educoin, null, 4));
// console.log('Is this chain valid?   ' + educoin.isChainValid());
 
educoin.createTransaction(new Transactions('address1','address2',100));
educoin.createTransaction(new Transactions('address2','address1',200));

console.log('Starting the miner');
educoin.minePendingTransactions('my-address');


console.log('my balance is',educoin.getBalanceOfAddress('my-address'));


console.log('Starting the miner');
educoin.minePendingTransactions('my-address');
console.log('my balance is',educoin.getBalanceOfAddress('my-address'));


console.log(JSON.stringify(educoin,null,4));