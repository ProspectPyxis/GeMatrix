module.exports = {
    wait: async (ms) => {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    },

    numberToEmoji: (num, padSize) => {
        if (typeof num === "number") num = num.toString();
        if (padSize && padSize > num.length) num = num.padStart(padSize, '0');

        const numConversion = {
            "0": ":zero:",
            "1": ":one:",
            "2": ":two:",
            "3": ":three:",
            "4": ":four:",
            "5": ":five:",
            "6": ":six:",
            "7": ":seven:",
            "8": ":eight:",
            "9": ":nine:"
        }

        let str = '';

        for (let i = 0; i < num.length; i++) {
            if (numConversion[num[i]]) str += numConversion[num[i]];
            else str += num[i];
        }

        return str;
    },

    objectsHaveSameKeys: (...objects) => {
        const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
        const union = new Set(allKeys);
        return objects.every(object => union.size === Object.keys(object).length);
    },

    // Code copied from stackexchange
    // TODO: Refactor this to be able to handle unlimited arrays at once
    compareArrays: (a1, a2) => {
        // if the other array is a falsy value, return
        if (!a1 || !a2)
            return false;

        // compare lengths - can save a lot of time
        if (a1.length != a2.length)
            return false;

        for (var i = 0, l = a1.length; i < l; i++) {
            // Check if we have nested arrays
            if (a1[i] instanceof Array && a2[i] instanceof Array) {
                // recurse into the nested arrays
                if (module.exports.compareArrays(a1, a2))
                    return false;
            } else if (a1[i] != a2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    },

    union2DArrays: (...a) => {
        let arr = [];

        for (const i of a) {
            for (const j of i) {
                if (j.constructor !== Array) continue;
                if (!arr.some(e => module.exports.compareArrays(e, j))) arr.push(j);
            }
        }

        return arr;
    },

    getDigitCount: (x) => {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    },

    isSequential: (arr, len) => {
        if (arr.length > len) 
            return false
        if (arr.length < 2)
            return true

        let sequenceLen = 0

        for (let i = 1; i < arr.length; i++) {
            sequenceLen = arr[i] - 1 === arr[i - 1]
                ? sequenceLen + 1 
                : 0
            
            if (sequenceLen === len) return true
        }

        return false
    }
}
