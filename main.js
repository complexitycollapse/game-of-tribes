const payoffMatrix = [
  [[1, 1], [-1, 2]],
  [[2, -1], [0, 0]]
];

function randInt(limit) {
  return Math.floor(Math.random() * limit);
}

function distinctRandoms(limit) {
  const firstIndex = randInt(limit);
  let secondIndex = randInt(limit);
  while (firstIndex === secondIndex) { secondIndex = randInt(limit)};

  return [firstIndex, secondIndex];
}

function runRound(bots, histories) {
  const [firstIndex, secondIndex] = distinctRandoms(bots.length);

  const first = bots[firstIndex];
  const second = bots[secondIndex];

  const historyOfSecond = histories[firstIndex][secondIndex];
  const historyOfFirst = histories[secondIndex][firstIndex];

  const firstMove = first.move(first, second, historyOfSecond);
  const secondMove = second.move(second, first, historyOfFirst);

  if (firstMove !== "cooperate" && firstMove !== "defect") {
    throw Error(`Bot with affiliation ${first.affiliation} played ${firstMove}`);
  }

  if (secondMove !== "cooperate" && secondMove !== "defect") {
    throw Error(`Bot with affiliation ${second.affiliation} played ${secondMove}`);
  }

  const firstAsInt = firstMove === "cooperate" ? 0 : 1;
  const secondAsInt = secondMove === "cooperate" ? 0 : 1;

  first.score += payoffMatrix[firstAsInt][secondAsInt][0];
  second.score += payoffMatrix[firstAsInt][secondAsInt][1];

  historyOfSecond.unshift(secondMove);
  historyOfFirst.unshift(firstMove);
}

function runRounds(bots, rounds, histories) {
  for (let i = 0; i < rounds; ++i) {
    runRound(bots, histories);
  }
}

function createBots(botConfig) {
  const bots = [];

  botConfig.forEach(({botFn, instances}) => {
    for (let i = 0; i < instances; ++i) {
      const bot = botFn(i);
      bot.score = 0;
      bots.push(bot);
    }
  });

  return bots;
}

function initHistories(count) {
  const histories = new Array(count);
  
  for (let i = 0; i < count; ++ i) {
    histories[i] = new Array(count);
    for (let j = 0; j < count; ++ j) {
      histories[i][j] = [];
    }
  }

  return histories;
}

function playGame(scenario) {
  const bots = createBots(scenario.botConfig);
  const histories = initHistories(bots.length);
  runRounds(bots, scenario.rounds, histories);
  return bots.sort((a, b) => b.score - a.score);
}

function cooperateFn() {
  return {
    affiliation: "cooperate",
    move: () => "cooperate"
  };
}

function defectFn() {
  return {
    affiliation: "defect",
    move: () => "defect"
  };
}

function war(tribe) {
  return () => ({
    affiliation: tribe,
    move: (self, opponent) => opponent.affiliation === self.affiliation ? "cooperate" : "defect"
  });
}

function betrayal(tribe) {
  return () => ({
    affiliation: tribe,
    move: (self, opponent) => opponent.affiliation === self.affiliation ? "defect" : "cooperate"
  });
}

function traitor(tribe, colaboration) {
  return () => ({
    affiliation: tribe,
    move: (self, opponent) => opponent.affiliation === colaboration ? "cooperate" : "defect"
  });
}

function titForTat() {
  return {
    affiliation: "tit-for-tat",
    move: (self, opponent, history) => history.length > 0 ? history[0] : "cooperate"
  };
}

const scenario = {
  rounds: 100000,
  botConfig: [
    { botFn: cooperateFn, instances: 10 },
    { botFn: defectFn, instances: 10 },
    { botFn: war("A"), instances: 10 },
    { botFn: war("B"), instances: 10 },
    { botFn: betrayal("betrayal"), instances: 10 },
    { botFn: titForTat, instances: 10 },
    { botFn: betrayal("A"), instances: 1},
    { botFn: traitor("A", "tit-for-tat"), instances: 3 }
  ]
};

const result = playGame(scenario);

const scoreByAffiliation = new Map();
const countByAffiliation = new Map();

result.forEach(bot => {
  if (!scoreByAffiliation.has(bot.affiliation)) {
    scoreByAffiliation.set(bot.affiliation, 0);
    countByAffiliation.set(bot.affiliation, 0);
  }

  scoreByAffiliation.set(bot.affiliation, scoreByAffiliation.get(bot.affiliation) + bot.score);
  countByAffiliation.set(bot.affiliation, countByAffiliation.get(bot.affiliation) + 1);
});

const averageScores = [...scoreByAffiliation.entries()]
.map(([tribe, score]) => [tribe, score / countByAffiliation.get(tribe)])
.sort((a, b) => b[1] - a[1]);

console.log(JSON.stringify(averageScores));
console.log("total score:", averageScores.reduce((a, b) => a + b[1], 0));
