/*
Лабораторная работа №1 по дисциплине МРЗВИС
Выполнена студентами группы 121702 БГУИР Летко Александр, Пилат Максим
Вариант 3: Алгоритм вычисления произведения пары 4-разрядных чисел умножением со старших разрядов со сдвигом множимого вправо
*/
const zero = '0000';

const createPairsBtn = document.getElementById('createPairsBtn');
createPairsBtn.addEventListener('click', create);

const countInput = document.getElementById('count');

const doIterBtn = document.getElementById('doIterBtn');
doIterBtn.addEventListener('click', doIteration);

const confirmBtn = document.getElementById('confirm');
confirmBtn.addEventListener('click', confirm);

const tactSpanEl = document.getElementById('tact');

let pipeline = null;

function create() {
  pipeline = null;
  const countValue = countInput.value;
  const containerElement = document.getElementById('container');
  containerElement.innerHTML = '';
  for (let i = 1; i <= countValue; i++) {
    const pairElement = createBlockOfPairInputs(i);
    containerElement.appendChild(pairElement);
  }
  document.getElementById('stages-wrapper').appendChild(createStage(1, null, null, null));
  document.getElementById('stages-wrapper').appendChild(createStage(2, null, null, null));
  document.getElementById('stages-wrapper').appendChild(createStage(3, null, null, null));
  document.getElementById('stages-wrapper').appendChild(createStage(4, null, null, null));

  confirmBtn.disabled = false;
}

function createBlockOfPairInputs(pairIndex) {
  const divElement = document.createElement('div');
  divElement.setAttribute('id', `pair-${pairIndex}`);
  divElement.style.marginBottom = '10px';
  for (let i = 0; i < 2; i++) {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('id', `pair-${pairIndex}_input-${i + 1}`);
    inputElement.setAttribute('placeHolder', `Введите значение ${i + 1}-го элемента`);

    const spanWrapperRef = document.createElement('span');
    spanWrapperRef.appendChild(inputElement);

    divElement.appendChild(spanWrapperRef);
  }
  const pairIndexEl = document.createElement('span');
  pairIndexEl.innerHTML = `Номер пары: ${pairIndex}`;

  divElement.appendChild(pairIndexEl);

  return divElement;
}

function getInputValue(pairIndex, inputNumber) {
  return document.getElementById(`pair-${pairIndex}_input-${inputNumber}`);
}

function createStage(stage, pairNumber, partialSum, partialMultiplication) {
  const stageWrapperElement = document.createElement('div');

  const stageInfoElement = document.createElement('div');
  stageInfoElement.innerHTML = `Этап: ${stage}`;
  stageInfoElement.style.marginBottom = '5px';

  const pairNumberElement = document.createElement('div');
  pairNumberElement.innerHTML = pairNumber ? `Номер пары: ${pairNumber}` : 'Номер пары: -';
  pairNumberElement.style.marginBottom = '5px';

  const dataElement = document.createElement('div');

  dataElement.style.width = '60%';
  dataElement.style.display = 'flex';
  dataElement.style.justifyContent = 'space-between';
  dataElement.style.marginBottom = '10px';

  const partialSumElement = document.createElement('span');
  partialSumElement.innerHTML = partialSum
    ? `Частичная сумма: ${partialSum}`
    : 'Частичная сумма: -';

  const partialMultiplicationElement = document.createElement('span');
  partialMultiplicationElement.innerHTML = partialMultiplication
    ? `Частичное произведение: ${partialMultiplication}`
    : 'Частичное произведение: -';

  dataElement.appendChild(partialSumElement);
  dataElement.appendChild(partialMultiplicationElement);

  stageWrapperElement.appendChild(stageInfoElement);
  stageWrapperElement.appendChild(pairNumberElement);
  stageWrapperElement.appendChild(dataElement);

  return stageWrapperElement;
}

function createExeption(message) {
  const errorsBlockEl = document.getElementById('errors');
  errorsBlockEl.innerHTML = message;
}

function confirm() {
  let pairs = [];
  for (let i = 1; i <= countInput.value; i++) {
    const errorsBlockEl = document.getElementById('errors');
    errorsBlockEl.innerHTML = '';
    if (!getInputValue(i, 1).value.length || !getInputValue(i, 2).value) {
      throw new createExeption('Поля не могут быть пустыми!');
    } else if (
      !Number.parseInt(getInputValue(i, 1).value) ||
      !Number.parseInt(getInputValue(i, 2).value)
    ) {
      if (
        Number.parseInt(getInputValue(i, 1).value) === 0 ||
        Number.parseInt(getInputValue(i, 2).value) === 0
      ) {
      } else {
        throw new createExeption('В полях должны быть только числовые значения!');
      }
    } else if (getInputValue(i, 1).value.length > 4 || getInputValue(i, 2).value.length > 4) {
      throw new createExeption('Длина чисел не должна превышать 4 бита!');
    }
    pairs.push([getInputValue(i, 1).value, getInputValue(i, 2).value]);

    for (let el = 1; el <= 2; el++) {
      const labelElement = document.createElement('span');
      labelElement.innerHTML = `${parseInt(getInputValue(i, el).value, 2)}`;
      const parent = getInputValue(i, el).parentElement;
      parent.prepend(labelElement);
    }

    getInputValue(i, 1).disabled = true;
    getInputValue(i, 2).disabled = true;
    confirmBtn.disabled = true;
  }

  pipeline = new Pipeline(pairs);
}

function createResult(result) {
  const elRef = document.createElement('div');
  elRef.innerHTML = `${result.partialSum}. Номер пары: ${
    result.number
  }, представление в 10-ой системе: ${parseInt(result.partialSum, 2)}, такт: ${result.tact}`;
  return elRef;
}

function doIteration() {
  document.getElementById('stages-wrapper').innerHTML = '';
  pipeline.runOneStep();
  for (let stage in pipeline.stagesInfo) {
    let stageElement = pipeline.stagesInfo[stage];
    document
      .getElementById('stages-wrapper')
      .appendChild(
        createStage(
          stageElement.stage,
          stageElement.pair ? stageElement.pair.number : stageElement.pair,
          stageElement.pair ? stageElement.pair.partialSum : stageElement.pair,
          stageElement.pair ? stageElement.pair.partialMultiplication : stageElement.pair,
        ),
      );
  }

  const resultRef = document.getElementById('result-wrapper');
  resultRef.innerHTML = '';

  for (let result of pipeline.finishedPairs) {
    resultRef.appendChild(createResult(result));
  }

  tactSpanEl.innerHTML = pipeline.tact;
}

class Pipeline {
  lastElementIndex = -1;
  tact = 0;

  pairsInfo = [];

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
    let priority = 0,
      index = 1;
    for (let pair of pairs) {
      this.pairsInfo.push(new Pair(pair[0], pair[1], priority, index));
      priority--;
      index++;
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
    let firstEl = copyOfPairsInfo.shift();
    if (firstEl && firstEl.stage === this.maxStages) {
      let originalFirstElement = this.pairsInfo.shift();
      originalFirstElement.tact = this.tact + 1;
      this.finishedPairs.unshift(originalFirstElement);
      this.stagesInfo[`stage${originalFirstElement.priority - 1}`].status = 'free';
      this.stagesInfo[`stage${originalFirstElement.priority - 1}`].pair = null;
    }
    copyOfPairsInfo = [...this.pairsInfo];
    let indexItem = 0;
    while (copyOfPairsInfo[indexItem] && copyOfPairsInfo[indexItem].priority > 0) {
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
    this.tact++;
  }
}

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

class Pair {
  constructor(firstNum, secondNum, priority, number) {
    this.priority = priority;
    this.firstNum = firstNum;
    this.secondNum = secondNum;
    this.stage = 0;
    this.currentBit = secondNum[0];
    this.indexOfCurrentBit = 0;
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
    this.upCurrentBit();
  }

  upCurrentBit() {
    this.indexOfCurrentBit += 1;
    this.currentBit = this.secondNum[this.indexOfCurrentBit];
  }

  getPartialMultiplication(index) {
    let shiftedNum = '';
    if (this.currentBit === '1') {
      shiftedNum = this.shiftRight(this.firstNum, index + 1);
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
