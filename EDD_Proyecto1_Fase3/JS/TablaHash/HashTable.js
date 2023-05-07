class HashTable {
    constructor(size) {
        this.data = new Array(size);
        this.loadFactor = 0;
    }

    hashFunction(key, search = false) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = hash + key.charCodeAt(i);
        }
        hash = hash % this.data.length;

        if (search) {
            if (this.data[hash] && this.data[hash].carnet === key) {
                return hash;
            }
        }

        if (this.data[hash]) {
            hash = this.hashColition(hash, search, key);
        }
        return hash;
    }

    hashColition(hash, search, key) {
        let newHash = hash;
        let quadratic = 1;
        while (this.data[newHash]) {
            newHash = newHash + Math.pow(quadratic, 2);

            if (search) {
                if (this.data[newHash] && this.data[newHash].carnet === key) {
                    return newHash;
                }
            }

            quadratic++;
        }
        return newHash;
    }

    rehashing() {
        let newHashTable = new HashTable(this.getNextPrimeNumber(this.data.length));
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i]) {
                newHashTable.set(this.data[i].carnet, this.data[i]);
            }
        }
        this.data = newHashTable.data;
    }

    set(key, value) {

        while(this.loadFactor / this.data.length > 0.75) {
            this.rehashing();
        }

        //console.log(this.loadFactor / this.data.length);

        let address = this.hashFunction(key, false);

        while (address > this.data.length) {
            this.rehashing();
            address = this.hashFunction(key, false);
        }

        this.data[address] = value;
        this.loadFactor++;
    }

    get(key) {
        let address = this.hashFunction(key, true);
        console.log(address);
        return this.data[address];
    }

    getNextPrimeNumber(number) {
        let isPrime = false;
        let nextPrime = number;
        while (!isPrime) {
            nextPrime++;
            isPrime = true;
            for (let i = 2; i < nextPrime; i++) {
                if (nextPrime % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        return nextPrime;
    }

}

export default HashTable