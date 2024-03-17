const ctx1 = document.getElementById('myChart1');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');
const ctx4 = document.getElementById('myChart4');

const countOfPairs = 8;

const pairs = [
  ['1101', '1010'],
  ['1111', '0111'],
  ['1011', '1110'],
  ['0000', '1111'],
  ['0111', '1010'],
  ['1001', '0110'],
  ['0110', '1111'],
  ['1000', '0111'],
  ['1101', '1010'],
  ['1111', '0111'],
  ['1011', '1110'],
  ['0000', '1111'],
  ['0111', '1010'],
  ['1001', '0110'],
  ['0110', '1111'],
  ['1000', '0111'],
  ['1101', '1010'],
  ['1111', '0111'],
  ['1011', '1110'],
  ['0000', '1111'],
  ['0111', '1010'],
  ['1001', '0110'],
  ['0110', '1111'],
  ['1000', '0111'],
];

function getAccelerationFactor(count) {
  let pipelineCharts = new Pipeline(pairs.slice(0, count));
  while (pipelineCharts.pairsInfo.length !== 0) {
    pipelineCharts.runOneStep();
  }
  let logicTimePipeline = pipelineCharts.tact - 1;
  let logicTimeProgramm = pairs[0][0].length * count;

  console.log(logicTimeProgramm, logicTimePipeline, logicTimeProgramm / logicTimePipeline);

  return logicTimeProgramm / logicTimePipeline;
}

function getRankEfficiencyFactor(countOfProcessors, countOfElements) {
  let result = getAccelerationFactor(countOfElements);
  return result / countOfProcessors;
}

function createChart(ctx, data, title, xLabel, yLabel) {
  return new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: title,
          data: data,
          backgroundColor: ['blue'],
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: xLabel,
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: yLabel,
          },
        },
      },
    },
  });
}

function buildRankAccelerationFactor() {
  let results = [];
  let indicies = [];
  for (let i = 0; i < pairs.length; i++) {
    let result = getAccelerationFactor(i + 1);
    results.push(result);
    indicies.push(i + 1);
  }
  results = [...results, ...new Array(24).fill(1)];
  for (let i = 1; i <= 24; i++) {
    indicies.push(i);
  }

  let data = [];

  for (let i = 0; i < results.length; i++) {
    data.push({
      x: indicies[i],
      y: results[i],
    });
  }

  let chart = createChart(
    ctx1,
    data,
    'Rank acceleration factor',
    'Сount of calculated pairs',
    'Acceleration Factor',
  );
}

function buildGraphAccelerationFromProcessors() {
  let result = [];
  for (let i = 0; i < 8; i++) {
    result.push(getAccelerationFactor(i + 1));
  }
  let results = new Array(8).fill(1);
  results = [...results, ...result];
  let indices = [...new Array(8).fill(1), ...new Array(8).fill(4)];

  let data = [];

  for (let i = 0; i < results.length; i++) {
    data.push({
      x: indices[i],
      y: results[i],
    });
  }

  let chart = createChart(
    ctx2,
    data,
    'Acceleration factor from processors',
    'Count of processors',
    'Acceleration Factor',
  );
}

function buildGraphEfficiencyFromRank() {
  let result = [];
  for (let i = 0; i < 25; i++) {
    result.push(getRankEfficiencyFactor(4, i + 1));
  }
  result = [...result, ...new Array(24).fill(1)];
  let indices = [];
  for (let i = 0; i < 25; i++) {
    indices.push(i);
  }

  indices = [...indices, ...indices];

  let data = [];

  for (let i = 0; i < result.length; i++) {
    data.push({
      x: indices[i],
      y: result[i],
    });
  }

  let chart = createChart(
    ctx3,
    data,
    'Rank efficiency factor',
    'Count of calculated pairs',
    'Efficiency factor',
  );
}

function buildGraphEfficiencyFromProcessors() {
  let result = [];
  for (let i = 0; i < 8; i++) {
    result.push(getRankEfficiencyFactor(4, i + 1));
  }
  result = [...result, ...new Array(8).fill(1)];

  let indices = [...new Array(8).fill(4), ...new Array(8).fill(1)];

  let data = [];

  for (let i = 0; i < result.length; i++) {
    data.push({
      x: indices[i],
      y: result[i],
    });
  }

  let chart = createChart(
    ctx4,
    data,
    'Processors efficiency factor',
    'Count of processors',
    'Efficiency factor',
  );
}

buildRankAccelerationFactor();
buildGraphAccelerationFromProcessors();
buildGraphEfficiencyFromRank();
buildGraphEfficiencyFromProcessors();
