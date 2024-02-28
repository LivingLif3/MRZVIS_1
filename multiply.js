let firstBinNum = '1010';
let secondBinNum = '1101';
let zero = '0000';

function binarySum(a, b) {
  let result = '';
  let carry = 0;

  // Дополнение строк a и b до одинаковой длины добавлением нулей в начало
  while (a.length < b.length) {
    a = '0' + a;
  }
  while (b.length < a.length) {
    b = '0' + b;
  }

  // Сложение двоичных чисел
  for (let i = a.length - 1; i >= 0; i--) {
    const bitA = parseInt(a[i]);
    const bitB = parseInt(b[i]);

    const sum = bitA + bitB + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }

  if (carry) {
    result = '1' + result;
  }

  return result;
}

let shiftRight = function (number, index) {
  let formedZeroes = '';
  for (let i = 0; i < index; i++) {
    formedZeroes += '0';
  }
  return formedZeroes + number;
};

let multiply = function (firstNum, secondNum) {
  let startSum = '00000000';
  for (let index = 0; index < secondNum.length; index++) {
    let partialMultiplication = getPartialMultiplication(secondNum[index], index);
    startSum = binarySum(startSum, partialMultiplication);
  }
  return startSum;
};

let getPartialMultiplication = function (currentByte, index) {
  let shiftedNum = '';
  if (currentByte === '1') {
    shiftedNum = shiftRight(firstBinNum, index + 1);
  } else {
    shiftedNum = shiftRight(zero, index + 1);
  }
  while (shiftedNum.length !== 8) {
    shiftedNum += '0';
  }
  return shiftedNum;
};

// console.log(binarySum(firstBinNum, secondBinNum));
console.log(multiply(firstBinNum, secondBinNum));

class Pipeline {
  lastElementIndex = -1;
  tact = 0;

  pairsInfo = {};

  finishedPairs = [];

  stagesInfo = {
    stage1: {
      stage: 1,
      status: 'free',
      pair: null,
    },
    stage2: {
      stage: 2,
      status: 'free',
      pair: null,
    },
    stage3: {
      stage: 3,
      status: 'free',
      pair: null,
    },
    stage4: {
      stage: 4,
      status: 'free',
      pair: null,
    },
  };

  maxStages = 4;

  constructor(pairs) {
    this.pairs = pairs;
    let priority = 0;
    for (let pair of pairs) {
      this.pairsInfo.push(new Pair(pair[0], pair[1], priority));
      priority++;
      //   this.pairsInfo.push({
      //     firstNum: pair[0],
      //     secondNum: pair[1],
      //     currentBit: pair[0][0],
      //     partialSum: '00000000',
      //     partialMultiplication: '00000000',
      //     stage: 0,
      //   });
    }
  }

  incrementPriorities() {
    for (let item of this.pairsInfo) {
      item.priority += 1;
    }
  }

  runOneStep() {
    this.incrementPriorities();
    let copyOfPairsInfo = [...this.pairsInfo];
    if (copyOfPairsInfo.shift().stage === this.maxStages) {
      this.finishedPairs.push(this.pairsInfo.shift());
      this.stagesInfo[`stage${priority}`].status = 'free';
      this.stagesInfo[`stage${priority}`].pair = null;
    }
    copyOfPairsInfo = [...this.pairsInfo];
    let indexItem = 0;
    while (copyOfPairsInfo[indexItem].priority > 0) {
      if (this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority}`]) {
        this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority}`].status = 'closed';
        this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority}`].pair =
          copyOfPairsInfo[indexItem];

        if (this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority - 1}`]) {
          this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority - 1}`].status = 'free';
          this.stagesInfo[`stage${copyOfPairsInfo[indexItem].priority - 1}`].pair = null;
        }

        this.pairsInfo[indexItem].doOneTact();

        indexItem++;
      }
    }
  }
}

class Pair {
  constructor(firstNum, secondNum, priority, number) {
    this.priority = priority;
    this.firstNum = firstNum;
    this.secondNum = secondNum;
    this.stage = 0;
    this.currentBit = secondNum[0];
    this.partialSum = '00000000';
    this.partialMultiplication = '00000000';
    this.number = number;
  }

  doOneTact() {
    if (this.stage === 4) {
      return;
    }
    this.partialMultiplication = this.getPartialMultiplication(this.stage);
    this.partialSum = binarySum(this.partialSum, this.partialMultiplication);
    this.stage++;
  }

  getPartialMultiplication(index) {
    let shiftedNum = '';
    if (this.currentByte === '1') {
      shiftedNum = this.shiftRight(firstBinNum, index + 1);
    } else {
      shiftedNum = this.shiftRight(zero, index + 1);
    }
    while (shiftedNum.length !== 8) {
      shiftedNum += '0';
    }
    return shiftedNum;
  }

  shiftRight(number, index) {
    let formedZeroes = '';
    for (let i = 0; i < index; i++) {
      formedZeroes += '0';
    }
    return formedZeroes + number;
  }
}
