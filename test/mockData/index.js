const fs = require('node:fs')

const usersId = [
    "536f0c47-c011-4c7c-9d2d-1247aeb1cb41",
    "c254b50d-dab2-4957-bc59-8177e77eab62",
    "50fccfb0-0760-4c95-aed2-a6c5ae3daa44",
    "6e82daad-9a59-4ebb-b34f-df0d49af5959",
    "5ecbab25-7943-488c-a5bc-536cc2fea487",
]

const users = {
    "536f0c47-c011-4c7c-9d2d-1247aeb1cb41": 0,
    "c254b50d-dab2-4957-bc59-8177e77eab62": 0,
    "50fccfb0-0760-4c95-aed2-a6c5ae3daa44": 0,
    "6e82daad-9a59-4ebb-b34f-df0d49af5959": 0,
    "5ecbab25-7943-488c-a5bc-536cc2fea487": 0
}

const getRandowUser = () => {
    return Math.floor(Math.random() * 5);
}

const parse = (index) => {

}

const data = Array.from({ length: 100 })
.map(() => {
    const payer = usersId[getRandowUser()]
    let payee = usersId[getRandowUser()]
    while(payee == payer){
        payee = usersId[getRandowUser()]
    }

    users[payer] -= 5
    users[payee] += 5

    return {
        payee,
        payer,
        value: 5
    }
})

// console.log(data)
console.table(users)

fs.writeFileSync('./transfers.json', JSON.stringify(data))