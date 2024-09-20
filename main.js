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

function inGroup(tribe) {
  return () => ({
    affiliation: tribe,
    move: (self, opponent) => opponent.affiliation === self.affiliation ? "cooperate" : "defect"
  });
}

function outGroup() {
  return {
    affiliation: "out-group",
    move: (self, opponent) => opponent.affiliation === self.affiliation ? "defect" : "cooperate"
  };
}

function titForTat() {
  return {
    affiliation: "tit-for-tat",
    move: (self, opponent, history) => history.length > 0 ? history[0] : "cooperate"
  };
}

const scenario = {
  rounds: 10000,
  botConfig: [
    { botFn: cooperateFn, instances: 10 },
    { botFn: defectFn, instances: 10 },
    { botFn: inGroup("A"), instances: 10 },
    { botFn: inGroup("B"), instances: 10 },
    { botFn: outGroup, instances: 10 },
    { botFn: titForTat, instances: 10 }
  ]
}

const result = playGame(scenario);

const byAffiliation = new Map();

result.forEach(bot => {
  if (!byAffiliation.has(bot.affiliation)) {
    byAffiliation.set(bot.affiliation, 0);
  }

  byAffiliation.set(bot.affiliation, byAffiliation.get(bot.affiliation) + bot.score);
});

console.log(JSON.stringify([...byAffiliation.entries()].sort((a, b) => b[1] - a[1])));
console.log("total score:", [...byAffiliation.values()].reduce((a, b) => a + b, 0));
