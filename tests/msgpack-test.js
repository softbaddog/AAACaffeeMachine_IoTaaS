var msgpack = require('msgpack5')();

var buf = Buffer.from("82 a6 6d 65 74 68 6f 64 aa 6b 65 65 70 2d 61 6c 69 76 65 a4 64 61 74 61 84 a7 76 65 72 73 69 6f 6e 01 a1 32 64 a9 74 69 6d 65 73 74 61 6d 70 bd 32 30 31 38 2d 31 32 2d 31 34 54 31 32 3a 35 38 3a 31 38 2e 30 30 30 2b 30 38 3a 30 30 a6 70 61 72 61 6d 73 85 a4 49 4d 53 49 af 34 36 30 30 36 35 35 31 30 30 34 31 31 32 32 a4 52 53 52 50 a4 2d 31 30 38 a3 45 43 4c a1 30 a3 53 4e 52 a3 31 37 30 a6 43 65 6c 6c 49 44 a9 31 31 31 32 30 35 36 35 39".replace(/\s/g, ''), 'hex');

console.log(msgpack.decode(buf));