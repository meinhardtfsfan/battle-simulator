     1	// ==================== 模拟帝国 - 战斗引擎（后端保护版） ====================
     2	// 核心算法在此运行，前端无法访问
     3	
     4	const UNITS_DB = {"殉教者(波斯)": {"name": "殉教者", "faction": "persian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 9, "defense": 8, "min_damage": 3, "max_damage": 4, "hp": 18}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "弓箭兵(波斯)": {"name": "弓箭兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 6, "defense": 8, "min_damage": 2, "max_damage": 5, "hp": 18}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "长矛步兵(波斯)": {"name": "长矛步兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 11, "defense": 12, "min_damage": 4, "max_damage": 8, "hp": 30}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "象骑射手(波斯)": {"name": "象骑射手", "faction": "persian", "attributes": {"speed": 4, "max_troop_size": 124, "attack": 7, "defense": 12, "min_damage": 5, "max_damage": 10, "hp": 129}, "tags": {"role": "ranged", "size": 3, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "轻骑兵(波斯)": {"name": "轻骑兵", "faction": "persian", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 12, "defense": 12, "min_damage": 7, "max_damage": 7, "hp": 36}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "铁甲骑士(波斯)": {"name": "铁甲骑士", "faction": "persian", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 20, "defense": 17, "min_damage": 12, "max_damage": 17, "hp": 50}, "tags": {"role": "melee", "size":<response clipped><NOTE>Lines longer than **2000 characters** will be **truncated**.</NOTE>
     5	
     6	const SPECIAL_ABILITIES = {
     7	  "影子武士(波斯)": {dodge: 0.50},
     8	  "御林将军(中国)": {counter_immune: 1.00},
     9	  "美洲虎武士(阿兹特克)": {counter_immune: 1.00},
    10	  "荷鲁斯(埃及)": {fury: 1.50},
    11	  "铁甲骑士(波斯)": {charge: 0.30},
    12	  "斯巴达勇士(希腊)": {formation: true},
    13	  "皇家木乃伊(埃及)": {rebirth: true},
    14	  "女娲(中国)": {revive: 0.20},
    15	  "半人马(希腊)": {rampage: 0.40},
    16	  "审判者(阿兹特克)": {rampage: 0.40},
    17	  "连弩校尉(中国)": {triple_crossbow: 0.50},
    18	  "羽蛇神(阿兹特克)": {breath: 0.55},
    19	  "长弓兵(埃及)": {gale: 0.20}
    20	};
    21	
    22	const MUMMY_TYPES = new Set(["皇家木乃伊(埃及)", "木乃伊战士(埃及)"]);
    23	
    24	function stripSuffix(name) {
    25	  const idx = name.lastIndexOf('(');
    26	  return idx > 0 ? name.slice(0, idx) : name;
    27	}
    28	
    29	function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    30	
    31	function calcDamage(Num, L, Rmin, Rmax, A, D) {
    32	  const R = randint(Rmin, Rmax);
    33	  let dmg;
    34	  if (A > D) dmg = Num * (L + R * (1 + (A - D) * 0.1));
    35	  else if (A < D) dmg = Num * (L + R * (1 - (D - A) * 0.05));
    36	  else dmg = Num * (L + R);
    37	  return Math.max(0, Math.round(dmg));
    38	}
    39	
    40	// ==================== 3. 部队类 ====================
    41	class Squad {
    42	  constructor(player, unitName, count, logs) {
    43	    this.player = player;
    44	    this.unitName = unitName;
    45	    this.logs = logs;
    46	    const attr = UNITS_DB[unitName].attributes;
    47	    const tags = UNITS_DB[unitName].tags;
    48	
    49	    this.maxCount = count;
    50	    this.troopCap = attr.max_troop_size;
    51	    this.count = count;
    52	    this.hpEach = attr.hp;
    53	    this.totalHp = count * attr.hp;
    54	
    55	    this.attack = attr.attack;
    56	    this.defense = attr.defense;
    57	    this.minDmg = attr.min_damage;
    58	    this.maxDmg = attr.max_damage;
    59	    this.speed = attr.speed;
    60	
    61	    this.skills = tags.special_skills || [];
    62	    this.isRanged = tags.is_ranged || false;
    63	    this.special = SPECIAL_ABILITIES[unitName] || {};
    64	    this.firstAttack = true;
    65	    this.roll = 0;
    66	  }
    67	
    68	  fmt() { return this.player === '甲' ? '[[R:' + stripSuffix(this.unitName) + ']]' : '[[G:' + stripSuffix(this.unitName) + ']]'; }
    69	  fmtCount() { return this.fmt() + '(' + this.count + ')'; }
    70	
    71	  log(msg) { this.logs.push(msg); }
    72	  get alive() { return this.totalHp > 0; }
    73	
    74	  sync() {
    75	    if (this.totalHp <= 0) this.count = 0;
    76	    else this.count = Math.ceil(this.totalHp / this.hpEach);
    77	  }
    78	
    79	  takeDamage(dmg) {
    80	    this.totalHp -= dmg;
    81	    if (this.totalHp < 0) this.totalHp = 0;
    82	    this.sync();
    83	  }
    84	
    85	  strike(target, multiplier) {
    86	    let base = this.calcStrikeDamage(target);
    87	    let final = this.applyStrikeBonus(base);
    88	    if (multiplier !== 1.0) final = Math.max(0, Math.round(final * multiplier));
    89	    const [dmg, kills] = this.dealStrikeDamage(final, target);
    90	    return [dmg, kills];
    91	  }
    92	
    93	  calcStrikeDamage(target) {
    94	    let atk = this.attack;
    95	    if (this.special.formation) {
    96	      const bonus = randint(7, 10);
    97	      atk += bonus;
    98	      this.log('    ' + this.fmt() + ' 战阵触发！攻击 +' + bonus + ' -> ' + atk);
    99	    }
   100	    let dmg = calcDamage(this.count, this.minDmg, this.minDmg, this.maxDmg, atk, target.defense);
   101	    if (this.special.gale && target.isRanged) {
   102	      dmg = Math.round(dmg * (1 + this.special.gale));
   103	      this.log('    ' + this.fmt() + ' 怒风！对远程伤害 +' + (this.special.gale * 100) + '% -> ' + dmg);
   104	    }
   105	    return dmg;
   106	  }
   107	
   108	  applyStrikeBonus(base) {
   109	    let mult = 1.0;
   110	    if (this.special.charge && this.firstAttack) {
   111	      const fullHp = this.maxCount * this.hpEach;
   112	      if (this.totalHp >= fullHp) {
   113	        mult += this.special.charge;
   114	        this.log('    ' + this.fmt() + ' 冲锋！伤害 x' + mult.toFixed(1));
   115	      }
   116	      this.firstAttack = false;
   117	    }
   118	    return Math.max(0, Math.round(base * mult));
   119	  }
   120	
   121	  dealStrikeDamage(dmg, target) {
   122	    const oldCount = target.count;
   123	    target.takeDamage(dmg);
   124	    return [dmg, oldCount - target.count];
   125	  }
   126	
   127	  applyAfterStrike(kills, target) {
   128	    if (this.special.rebirth && kills > 0 && !MUMMY_TYPES.has(target.unitName)) {
   129	      const absorb = Math.ceil(kills / 2);
   130	      const newCount = Math.min(this.count + absorb, this.maxCount);
   131	      const gain = newCount - this.count;
   132	      if (gain > 0) {
   133	        this.totalHp += gain * this.hpEach;
   134	        this.sync();
   135	        this.log('    ' + this.fmt() + ' 转化复生！吸收 ' + gain + ' 人 -> ' + this.count + '人');
   136	      }
   137	    }
   138	  }
   139	
   140	  tryDodge() {
   141	    const rate = this.special.dodge || 0;
   142	    return rate > 0 && Math.random() < rate;
   143	  }
   144	
   145	  tryCounterImmune() { return (this.special.counter_immune || 0) > 0; }
   146	
   147	  tryRevive(preCount) {
   148	    if (!this.special.revive) return;
   149	    if (!this.alive || this.count <= 0) return;
   150	    if (this.count >= preCount) return;
   151	    const reviveAmount = Math.floor(this.maxCount * this.special.revive);
   152	    const threshold = this.maxCount - reviveAmount;
   153	    if (this.count >= threshold) return;
   154	    if (Math.random() >= 0.35) return;
   155	    const newCount = Math.min(this.count + reviveAmount, this.maxCount);
   156	    const gain = newCount - this.count;
   157	    if (gain > 0) {
   158	      this.totalHp += gain * this.hpEach;
   159	      this.sync();
   160	      this.log('    ' + this.fmt() + ' 复活！恢复 ' + gain + ' 人 -> ' + this.count + '人');
   161	    }
   162	  }
   163	
   164	  canCounter(attacker) {
   165	    if (!this.alive) return false;
   166	    if (!this.skills.includes('counter_attack')) return false;
   167	    if (attacker.isRanged || attacker.tryCounterImmune()) return false;
   168	    return true;
   169	  }
   170	
   171	  counterStrike(attacker) {
   172	    if (!this.canCounter(attacker)) return 0;
   173	    const base = calcDamage(this.count, this.minDmg, this.minDmg, this.maxDmg, this.attack, attacker.defense);
   174	    let mult = 0.5;
   175	    let tag = '反击';
   176	    if (this.special.fury) {
   177	      mult *= this.special.fury;
   178	      tag = '愤怒反击';
   179	    }
   180	    const dmg = Math.max(0, Math.round(base * mult));
   181	    attacker.takeDamage(dmg);
   182	    this.log('    ' + this.fmt() + ' ' + tag + '！造成 ' + dmg + ' 伤害');
   183	    return dmg;
   184	  }
   185	
   186	  handleCounter(target) {
   187	    if (!target.alive) return;
   188	    if (target.canCounter(this)) {
   189	      const preCount = this.count;
   190	      target.counterStrike(this);
   191	      this.log('    ' + this.fmt() + ' ' + preCount + ' -> ' + this.count);
   192	      if (!this.alive) this.log('    ' + this.fmt() + ' 被反击致死！');
   193	    } else if (this.isRanged) {
   194	      // 远程不显示任何反击相关内容
   195	    } else if (target.skills.includes('counter_attack') && this.tryCounterImmune()) {
   196	      this.log('    ' + this.fmt() + ' 免疫了反击！');
   197	    }
   198	  }
   199	
   200	  performStrikeSequence(target, multiplier, skipMultiplier) {
   201	    if (!this.alive) return false;
   202	
   203	    if (target.tryDodge()) {
   204	      if (this.special.charge && this.firstAttack) {
   205	        this.firstAttack = false;
   206	      }
   207	      this.log('  ' + this.fmtCount() + ' -> ' + target.fmtCount() + ' 被闪避！');
   208	      this.handleCounter(target);
   209	      return false;
   210	    }
   211	
   212	    const preCount = target.count;
   213	    const [dmg, kills] = this.strike(target, multiplier);
   214	    const causedDeath = target.count < preCount;
   215	
   216	    if (multiplier !== 1.0 && !skipMultiplier) {
   217	      this.log('  ' + this.fmtCount() + ' -> ' + target.fmt() + ' 造成 ' + dmg + ' 伤害 (x' + (multiplier*100).toFixed(0) + '%)');
   218	    } else {
   219	      this.log('  ' + this.fmtCount() + ' -> ' + target.fmt() + ' 造成 ' + dmg + ' 伤害');
   220	    }
   221	    this.log('    ' + target.fmt() + ' ' + preCount + ' -> ' + target.count);
   222	
   223	    this.applyAfterStrike(kills, target);
   224	    target.tryRevive(preCount);
   225	    this.handleCounter(target);
   226	    return causedDeath;
   227	  }
   228	
   229	  performMultiStrike(target, shots, mult, shotName) {
   230	    this.log('  ' + this.fmt() + ' 发动' + shotName + '！');
   231	    for (let i = 0; i < shots; i++) {
   232	      if (!this.alive || !target.alive) return shots - i;
   233	      const pct = (mult * 100).toFixed(0);
   234	      const label = shotName === '吐息' ? '次喷射' : '箭';
   235	      this.log('    第' + (i+1) + label + '（' + pct + '%伤害）:');
   236	      this.performStrikeSequence(target, mult, true);
   237	    }
   238	    return 0;
   239	  }
   240	
   241	  performRampage(target) {
   242	    let causedDeath = this.performStrikeSequence(target, 1.0);
   243	    while (causedDeath && this.special.rampage) {
   244	      if (Math.random() >= this.special.rampage) break;
   245	      if (!this.alive || !target.alive) break;
   246	      this.log('  ' + this.fmt() + ' 怒斩！');
   247	      causedDeath = this.performStrikeSequence(target, 1.0);
   248	    }
   249	    return causedDeath;
   250	  }
   251	}
   252	
   253	// ==================== 4. 战斗引擎 ====================
   254	function simulateOne(unitA, countA, unitB, countB, logs) {
   255	  const a = new Squad('甲', unitA, countA, logs);
   256	  const b = new Squad('乙', unitB, countB, logs);
   257	
   258	  logs.push('=== 战斗开始：' + a.fmt() + '(' + countA + ') vs ' + b.fmt() + '(' + countB + ') ===\n');
   259	
   260	  for (let rnd = 1; rnd <= 1000; rnd++) {
   261	    if (!a.alive || !b.alive) break;
   262	    logs.push('--- 回合 ' + rnd + ' ---');
   263	
   264	    let order;
   265	    if (a.speed > b.speed) {
   266	      order = [[a, b], [b, a]];
   267	      logs.push('  速度判定：' + a.fmt() + '(' + a.speed + ') > ' + b.fmt() + '(' + b.speed + ')，' + a.fmt() + '先动');
   268	    } else if (b.speed > a.speed) {
   269	      order = [[b, a], [a, b]];
   270	      logs.push('  速度判定：' + b.fmt() + '(' + b.speed + ') > ' + a.fmt() + '(' + a.speed + ')，' + b.fmt() + '先动');
   271	    } else {
   272	      const first = Math.random() < 0.5 ? a : b;
   273	      const second = first === a ? b : a;
   274	      order = [[first, second], [second, first]];
   275	      logs.push('  速度相同(' + a.speed + ')，随机先手：' + first.fmt() + '先动');
   276	    }
   277	
   278	    for (const [attacker, defender] of order) {
   279	      if (!attacker.alive || !defender.alive) continue;
   280	      logs.push('\n  ' + attacker.fmtCount() + ' 行动：');
   281	
   282	      if (attacker.special.triple_crossbow) {
   283	        attacker.performMultiStrike(defender, 3, attacker.special.triple_crossbow, '三连弩');
   284	      } else if (attacker.special.breath) {
   285	        attacker.performMultiStrike(defender, 3, attacker.special.breath, '吐息');
   286	      } else {
   287	        attacker.performRampage(defender);
   288	      }
   289	
   290	      if (!defender.alive) {
   291	        logs.push('\n  * ' + defender.fmt() + ' 全军覆没！');
   292	        break;
   293	      }
   294	      if (!attacker.alive) {
   295	        logs.push('\n  * ' + attacker.fmt() + ' 全军覆没！');
   296	        break;
   297	      }
   298	    }
   299	  }
   300
   301	  logs.push('');
   302	  if (a.alive && !b.alive) {
   303	    logs.push('=== 战斗结束：' + a.fmt() + ' 胜利 ===');
   304	    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
   305	    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
   306	    return { winner: 'A', winnerUnit: unitA, winnerCount: a.count, loserCount: b.count, aRem: a.count, bRem: b.count };
   307	  } else if (b.alive && !a.alive) {
   308	    logs.push('=== 战斗结束：' + b.fmt() + ' 胜利 ===');
   309	    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
   310	    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
   311	    return { winner: 'B', winnerUnit: unitB, winnerCount: b.count, loserCount: a.count, aRem: a.count, bRem: b.count };
   312	  } else {
   313	    logs.push('=== 战斗结束：平局 ===');
   314	    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
   315	    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
   316	    return { winner: 'draw', aRem: a.count, bRem: b.count };
   317	  }
   318	}
   319	
   320	function priorityKey(s) { return [-s.speed, -s.roll]; }
   321	
   322	function simulateRelay(unitA, countA, groupsA, unitB, countB, groupsB, logs) {
   323	  const FAST_MODE = groupsA > 10 && groupsB > 10;
   324	  const totalAStart = countA * groupsA;
   325	  const totalBStart = countB * groupsB;
   326	
   327	  function log(line) { if (!FAST_MODE) logs.push(line); }
   328	
   329	  const queueA = Array(groupsA).fill(countA);
   330	  const queueB = Array(groupsB).fill(countB);
   331	
   332	  let curA = new Squad('甲', unitA, queueA.shift(), logs);
   333	  if (FAST_MODE) curA.log = function() {};
   334	  let curB = new Squad('乙', unitB, queueB.shift(), logs);
   335	  if (FAST_MODE) curB.log = function() {};
   336	  let groupNumA = 1, groupNumB = 1;
   337	
   338	  logs.push('=== 接力模式：' + curA.fmt() + '(' + countA + ')x' + groupsA + ' vs ' + curB.fmt() + '(' + countB + ')x' + groupsB + ' ===\n');
   339	
   340	  function assignRoll(squad) {
   341	    const used = new Set();
   342	    if (curA.alive && curA !== squad && curA.speed === squad.speed) used.add(curA.roll.toFixed(8));
   343	    if (curB.alive && curB !== squad && curB.speed === squad.speed) used.add(curB.roll.toFixed(8));
   344	    let roll;
   345	    do { roll = Math.random(); } while (used.has(roll.toFixed(8)));
   346	    squad.roll = roll;
   347	  }
   348	
   349	  function getSpeedLineBottom(acted) {
   350	    let bs = Infinity, br = Infinity;
   351	    for (const s of acted) {
   352	      if (s.speed < bs || (s.speed === bs && s.roll < br)) {
   353	        bs = s.speed; br = s.roll;
   354	      }
   355	    }
   356	    return [bs, br];
   357	  }
   358	
   359	  function isBehindSpeedLine(squad, bs, br) {
   360	    if (bs === Infinity) return true;
   361	    if (squad.speed < bs) return true;
   362	    if (squad.speed === bs && squad.roll <= br) return true;
   363	    return false;
   364	  }
   365	
   366	  const MAX_ROUNDS = Math.max(5000, (groupsA + groupsB) * 50);
   367	
   368	  for (let rnd = 1; rnd <= MAX_ROUNDS; rnd++) {
   369	    if (curA.alive) assignRoll(curA);
   370	    if (curB.alive) assignRoll(curB);
   371	
   372	    if (!curA.alive && !queueA.length) {
   373	      log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
   374	      const remB = 1 + queueB.length;
   375	      log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
   376	      if (FAST_MODE) logFastResult();
   377	      return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: curA.alive ? curA.count : 0, bRem: curB.count, remGA: queueA.length, remGB: 1 + queueB.length };
   378	    }
   379	    if (!curB.alive && !queueB.length) {
   380	      log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
   381	      const remA = 1 + queueA.length;
   382	      log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
   383	      if (FAST_MODE) logFastResult();
   384	      return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: curB.alive ? curB.count : 0, remGA: 1 + queueA.length, remGB: queueB.length };
   385	    }
   386	
   387	    log('\n--- 回合 ' + rnd + ' ---');
   388	
   389	    const aliveA = curA.alive, aliveB = curB.alive;
   390	    if (aliveA && aliveB) {
   391	      if (curA.speed !== curB.speed) {
   392	        log('  速度判定：' + (curA.speed > curB.speed ? curA.fmt() : curB.fmt()) + '先动');
   393	      } else {
   394	        log('  速度相同(' + curA.speed + ')，随机先手：' + (curA.roll > curB.roll ? curA.fmt() : curB.fmt()) + '先动');
   395	      }
   396	    }
   397	
   398	    let acted = new Set();
   399	
   400	    function buildQueue(actedSet) {
   401	      const [bs, br] = getSpeedLineBottom(actedSet);
   402	      let q = [];
   403	      if (curA.alive && !actedSet.has(curA) && isBehindSpeedLine(curA, bs, br)) q.push(['甲', curA]);
   404	      if (curB.alive && !actedSet.has(curB) && isBehindSpeedLine(curB, bs, br)) q.push(['乙', curB]);
   405	      q.sort((a, b) => {
   406	        const ka = priorityKey(a[1]), kb = priorityKey(b[1]);
   407	        for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
   408	        return 0;
   409	      });
   410	      return q;
   411	    }
   412	
   413	    let queue = buildQueue(acted);
   414	
   415	    while (queue.length > 0) {
   416	      const [owner, attacker] = queue.shift();
   417	      acted.add(attacker);
   418	
   419	      const defender = owner === '甲' ? curB : curA;
   420	      if (!attacker.alive || !defender.alive) continue;
   421	
   422	      log('\n  ' + attacker.fmtCount() + ' 行动：');
   423	
   424	      let msRem = 0, msMult = 1.0, msLabel = '箭';
   425	
   426	      if (attacker.special.triple_crossbow) {
   427	        msRem = attacker.performMultiStrike(defender, 3, attacker.special.triple_crossbow, '三连弩');
   428	        msMult = attacker.special.triple_crossbow;
   429	      } else if (attacker.special.breath) {
   430	        msRem = attacker.performMultiStrike(defender, 3, attacker.special.breath, '吐息');
   431	        msMult = attacker.special.breath;
   432	        msLabel = '次喷射';
   433	      } else {
   434	        attacker.performRampage(defender);
   435	      }
   436	
   437	      if (!attacker.alive) {
   438	        const ga = owner === '甲' ? groupNumA : groupNumB;
   439	        log('\n  * ' + attacker.fmt() + ' 第' + ga + '组全军覆没！');
   440	        if (owner === '甲') {
   441	          if (queueA.length) {
   442	            curA = new Squad('甲', unitA, queueA.shift(), logs);
   443	            if (FAST_MODE) curA.log = function() {};
   444	            groupNumA++;
   445	            log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
   446	            assignRoll(curA);
   447	            queue = buildQueue(acted);
   448	          } else {
   449	            log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
   450	            const remB2 = 1 + queueB.length;
   451	            log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB2 + '/' + groupsB + '组)');
   452	            if (FAST_MODE) logFastResult();
   453	            return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: 0, bRem: curB.count, remGA: 0, remGB: remB2 };
   454	          }
   455	        } else {
   456	          if (queueB.length) {
   457	            curB = new Squad('乙', unitB, queueB.shift(), logs);
   458	            if (FAST_MODE) curB.log = function() {};
   459	            groupNumB++;
   460	            log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
   461	            assignRoll(curB);
   462	            queue = buildQueue(acted);
   463	          } else {
   464	            log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
   465	            const remA2 = 1 + queueA.length;
   466	            log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA2 + '/' + groupsA + '组)');
   467	            if (FAST_MODE) logFastResult();
   468	            return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: 0, remGA: remA2, remGB: 0 };
   469	          }
   470	        }
   471	      }
   472	
   473	      if (!defender.alive) {
   474	        const gd = defender.player === '甲' ? groupNumA : groupNumB;
   475	        log('\n  * ' + defender.fmt() + ' 第' + gd + '组全军覆没！');
   476	
   477	        while (true) {
   478	          if (defender.player === '甲') {
   479	            if (!queueA.length) {
   480	              log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
   481	              const remB = 1 + queueB.length;
   482	              log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
   483	              if (FAST_MODE) logFastResult();
   484	              return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: 0, bRem: curB.count, remGA: 0, remGB: remB };
   485	            }
   486	            curA = new Squad('甲', unitA, queueA.shift(), logs);
   487	            if (FAST_MODE) curA.log = function() {};
   488	            groupNumA++;
   489	            log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
   490	          } else {
   491	            if (!queueB.length) {
   492	              log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
   493	              const remA = 1 + queueA.length;
   494	              log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
   495	              if (FAST_MODE) logFastResult();
   496	              return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: 0, remGA: remA, remGB: 0 };
   497	            }
   498	            curB = new Squad('乙', unitB, queueB.shift(), logs);
   499	            if (FAST_MODE) curB.log = function() {};
   500	            groupNumB++;
   501	            log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
   502	          }
   503	
   504	          if (msRem <= 0 || !attacker.alive) break;
   505	
   506	          let shotNum = 4 - msRem;
   507	          while (msRem > 0 && attacker.alive) {
   508	            const currentTarget = defender.player === '甲' ? curA : curB;
   509	            if (!currentTarget.alive) break;
   510	            log('    第' + shotNum + msLabel + '（' + (msMult*100).toFixed(0) + '%伤害）:');
   511	            attacker.performStrikeSequence(currentTarget, msMult, true);
   512	            msRem--;
   513	            shotNum++;
   514	          }
   515	
   516	          const currentTarget = defender.player === '甲' ? curA : curB;
   517	          if (currentTarget.alive) break;
   518	          const gc = currentTarget.player === '甲' ? groupNumA : groupNumB;
   519	          log('\n  * ' + currentTarget.fmt() + ' 第' + gc + '组全军覆没！');
   520	        }
   521	
   522	        if (curA.alive) assignRoll(curA);
   523	        if (curB.alive) assignRoll(curB);
   524	        queue = buildQueue(acted);
   525	      }
   526	    }
   527	  }
   528	
   529	  log('\n=== 战斗结束：回合耗尽(' + MAX_ROUNDS + ')，平局 ===');
   530	  const remA3 = 1 + queueA.length;
   531	  const remB3 = 1 + queueB.length;
   532	  log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA3 + '/' + groupsA + '组)');
   533	  log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB3 + '/' + groupsB + '组)');
   534	  if (FAST_MODE) logFastResult();
   535	  return { winner: 'draw', aRem: curA.count, bRem: curB.count, remGA: remA3, remGB: remB3 };
   536	
   537	  function logFastResult() {
   538	    const aAlive = curA.alive ? 1 : 0;
   539	    const bAlive = curB.alive ? 1 : 0;
   540	    const remA = (curA.alive ? curA.count : 0) + queueA.reduce(function(s,c){return s+c;}, 0);
   541	    const remB = (curB.alive ? curB.count : 0) + queueB.reduce(function(s,c){return s+c;}, 0);
   542	    const remGA = aAlive + queueA.length;
   543	    const remGB = bAlive + queueB.length;
   544	    const aLoss = totalAStart - remA;
   545	    const bLoss = totalBStart - remB;
   546	    let ratioStr = '\n伤亡对比：' + aLoss + '/' + bLoss;
   547	    if (bLoss > 0) ratioStr += ' = ' + (aLoss / bLoss).toFixed(4);
   548	    const redName = '[[R:' + stripSuffix(unitA) + ']]';
   549	    const greenName = '[[G:' + stripSuffix(unitB) + ']]';
   550	    if (FAST_MODE) {
   551	      logs.push("\n（双方组数均超过10组，进入快速模式）");
   552	    }
   553	    logs.push("\n=== 快速模式统计 ===");
   554	    logs.push(redName + ": 初始 " + totalAStart + " 人(" + groupsA + "组) | 剩余 " + remA + " 人(" + remGA + "组)");
   555	    logs.push(greenName + ": 初始 " + totalBStart + " 人(" + groupsB + "组) | 剩余 " + remB + " 人(" + remGB + "组)" + ratioStr);
   556	  }
   557	}
   558	
   559	// ==================== API 路由 ====================
   560	export default function handler(req, res) {
   561	  // CORS
   562	  res.setHeader('Access-Control-Allow-Origin', '*');
   563	  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
   564	  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   565	
   566	  if (req.method === 'OPTIONS') {
   567	    return res.status(200).end();
   568	  }
   569	
   570	  if (req.method !== 'POST') {
   571	    return res.status(405).json({ error: 'Method not allowed' });
   572	  }
   573	
   574	  const { unitA, countA, groupsA, unitB, countB, groupsB, mode } = req.body;
   575	
   576	  // 验证参数
   577	  if (!unitA || !unitB || !UNITS_DB[unitA] || !UNITS_DB[unitB]) {
   578	    return res.status(400).json({ error: 'Invalid unit' });
   579	  }
   580	
   581	  const cA = Math.min(parseInt(countA) || 1, UNITS_DB[unitA].attributes.max_troop_size);
   582	  const cB = Math.min(parseInt(countB) || 1, UNITS_DB[unitB].attributes.max_troop_size);
   583	  const gA = Math.min(parseInt(groupsA) || 1, 10000);
   584	  const gB = Math.min(parseInt(groupsB) || 1, 10000);
   585	  const m = mode || 'single';
   586	
   587	  const logs = [];
   588	  let result;
   589	
   590	  try {
   591	    if (m === 'single') {
   592	      result = simulateOne(unitA, cA, unitB, cB, logs);
   593	    } else {
   594	      result = simulateRelay(unitA, cA, gA, unitB, cB, gB, logs);
   595	    }
   596	
   597	    res.status(200).json({
   598	      logs,
   599	      result: {
   600	        winner: result.winner,
   601	        winnerUnit: result.winnerUnit || null,
   602	        winnerCount: result.winnerCount || 0,
   603	        aRem: result.aRem,
   604	        bRem: result.bRem,
   605	        remGA: result.remGA || 1,
   606	        remGB: result.remGB || 1
   607	      }
   608	    });
   609	  } catch (err) {
   610	    res.status(500).json({ error: err.message });
   611	  }
   612	}
   613
