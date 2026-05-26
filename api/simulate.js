// ==================== 模拟帝国 - 战斗引擎（后端保护版） ====================
// 核心算法在此运行，前端无法访问

const UNITS_DB = {"殉教者(波斯)": {"name": "殉教者", "faction": "persian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 9, "defense": 8, "min_damage": 3, "max_damage": 4, "hp": 18}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "弓箭兵(波斯)": {"name": "弓箭兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 6, "defense": 8, "min_damage": 2, "max_damage": 5, "hp": 18}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "长矛步兵(波斯)": {"name": "长矛步兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 11, "defense": 12, "min_damage": 4, "max_damage": 8, "hp": 30}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "象骑射手(波斯)": {"name": "象骑射手", "faction": "persian", "attributes": {"speed": 4, "max_troop_size": 124, "attack": 7, "defense": 12, "min_damage": 5, "max_damage": 10, "hp": 129}, "tags": {"role": "ranged", "size": 3, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "轻骑兵(波斯)": {"name": "轻骑兵", "faction": "persian", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 12, "defense": 12, "min_damage": 7, "max_damage": 7, "hp": 36}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "铁甲骑士(波斯)": {"name": "铁甲骑士", "faction": "persian", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 20, "defense": 17, "min_damage": 12, "max_damage": 17, "hp": 50}, "tags": {"role": "melee", "size": 2, "special_skills": ["charge"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "影子武士(波斯)": {"name": "影子武士", "faction": "persian", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 15, "defense": 13, "min_damage": 8, "max_damage": 12, "hp": 42}, "tags": {"role": "melee", "size": 1, "special_skills": ["dodge"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "连弩校尉(中国)": {"name": "连弩校尉", "faction": "chinese", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 8, "defense": 8, "min_damage": 3, "max_damage": 6, "hp": 22}, "tags": {"role": "ranged", "size": 1, "special_skills": ["triple_crossbow"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "御林将军(中国)": {"name": "御林将军", "faction": "chinese", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 18, "defense": 16, "min_damage": 10, "max_damage": 14, "hp": 48}, "tags": {"role": "melee", "size": 1, "special_skills": ["counter_immune"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "女娲(中国)": {"name": "女娲", "faction": "chinese", "attributes": {"speed": 4, "max_troop_size": 99, "attack": 6, "defense": 6, "min_damage": 2, "max_damage": 4, "hp": 25}, "tags": {"role": "healer", "size": 1, "special_skills": ["revive"], "attack_pattern": "heal", "is_melee": false, "is_ranged": false, "is_healer": true, "can_counter": false}}, "美洲虎武士(阿兹特克)": {"name": "美洲虎武士", "faction": "aztec", "attributes": {"speed": 7, "max_troop_size": 149, "attack": 16, "defense": 14, "min_damage": 9, "max_damage": 13, "hp": 45}, "tags": {"role": "melee", "size": 1, "special_skills": ["counter_immune"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "羽蛇神(阿兹特克)": {"name": "羽蛇神", "faction": "aztec", "attributes": {"speed": 6, "max_troop_size": 99, "attack": 10, "defense": 10, "min_damage": 5, "max_damage": 9, "hp": 80}, "tags": {"role": "ranged", "size": 2, "special_skills": ["breath"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "审判者(阿兹特克)": {"name": "审判者", "faction": "aztec", "attributes": {"speed": 7, "max_troop_size": 124, "attack": 14, "defense": 12, "min_damage": 7, "max_damage": 11, "hp": 38}, "tags": {"role": "melee", "size": 1, "special_skills": ["rampage"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "荷鲁斯(埃及)": {"name": "荷鲁斯", "faction": "egyptian", "attributes": {"speed": 8, "max_troop_size": 124, "attack": 17, "defense": 14, "min_damage": 10, "max_damage": 15, "hp": 46}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack", "fury"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "皇家木乃伊(埃及)": {"name": "皇家木乃伊", "faction": "egyptian", "attributes": {"speed": 3, "max_troop_size": 99, "attack": 8, "defense": 10, "min_damage": 4, "max_damage": 7, "hp": 35}, "tags": {"role": "melee", "size": 1, "special_skills": ["rebirth"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "长弓兵(埃及)": {"name": "长弓兵", "faction": "egyptian", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 7, "defense": 8, "min_damage": 3, "max_damage": 7, "hp": 20}, "tags": {"role": "ranged", "size": 1, "special_skills": ["gale"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "斯巴达勇士(希腊)": {"name": "斯巴达勇士", "faction": "greek", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 14, "defense": 16, "min_damage": 8, "max_damage": 12, "hp": 44}, "tags": {"role": "melee", "size": 1, "special_skills": ["formation"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "半人马(希腊)": {"name": "半人马", "faction": "greek", "attributes": {"speed": 9, "max_troop_size": 124, "attack": 13, "defense": 11, "min_damage": 7, "max_damage": 10, "hp": 40}, "tags": {"role": "melee", "size": 2, "special_skills": ["rampage"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}};

const SPECIAL_ABILITIES = {
  "影子武士(波斯)": {dodge: 0.50},
  "御林将军(中国)": {counter_immune: 1.00},
  "美洲虎武士(阿兹特克)": {counter_immune: 1.00},
  "荷鲁斯(埃及)": {fury: 1.50},
  "铁甲骑士(波斯)": {charge: 0.30},
  "斯巴达勇士(希腊)": {formation: true},
  "皇家木乃伊(埃及)": {rebirth: true},
  "女娲(中国)": {revive: 0.20},
  "半人马(希腊)": {rampage: 0.40},
  "审判者(阿兹特克)": {rampage: 0.40},
  "连弩校尉(中国)": {triple_crossbow: 0.50},
  "羽蛇神(阿兹特克)": {breath: 0.55},
  "长弓兵(埃及)": {gale: 0.20}
};

const MUMMY_TYPES = new Set(["皇家木乃伊(埃及)", "木乃伊战士(埃及)"]);

function stripSuffix(name) {
  const idx = name.lastIndexOf('(');
  return idx > 0 ? name.slice(0, idx) : name;
}

function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function calcDamage(Num, L, Rmin, Rmax, A, D) {
  const R = randint(Rmin, Rmax);
  let dmg;
  if (A > D) dmg = Num * (L + R * (1 + (A - D) * 0.1));
  else if (A < D) dmg = Num * (L + R * (1 - (D - A) * 0.05));
  else dmg = Num * (L + R);
  return Math.max(0, Math.round(dmg));
}

// ==================== 3. 部队类 ====================
class Squad {
  constructor(player, unitName, count, logs) {
    this.player = player;
    this.unitName = unitName;
    this.logs = logs;
    const attr = UNITS_DB[unitName].attributes;
    const tags = UNITS_DB[unitName].tags;

    this.maxCount = count;
    this.troopCap = attr.max_troop_size;
    this.count = count;
    this.hpEach = attr.hp;
    this.totalHp = count * attr.hp;

    this.attack = attr.attack;
    this.defense = attr.defense;
    this.minDmg = attr.min_damage;
    this.maxDmg = attr.max_damage;
    this.speed = attr.speed;

    this.skills = tags.special_skills || [];
    this.isRanged = tags.is_ranged || false;
    this.special = SPECIAL_ABILITIES[unitName] || {};
    this.firstAttack = true;
    this.roll = 0;
  }

  fmt() { return this.player === '甲' ? '[[R:' + stripSuffix(this.unitName) + ']]' : '[[G:' + stripSuffix(this.unitName) + ']]'; }
  fmtCount() { return this.fmt() + '(' + this.count + ')'; }

  log(msg) { this.logs.push(msg); }
  get alive() { return this.totalHp > 0; }

  sync() {
    if (this.totalHp <= 0) this.count = 0;
    else this.count = Math.ceil(this.totalHp / this.hpEach);
  }

  takeDamage(dmg) {
    this.totalHp -= dmg;
    if (this.totalHp < 0) this.totalHp = 0;
    this.sync();
  }

  strike(target, multiplier) {
    let base = this.calcStrikeDamage(target);
    let final = this.applyStrikeBonus(base);
    if (multiplier !== 1.0) final = Math.max(0, Math.round(final * multiplier));
    const [dmg, kills] = this.dealStrikeDamage(final, target);
    return [dmg, kills];
  }

  calcStrikeDamage(target) {
    let atk = this.attack;
    if (this.special.formation) {
      const bonus = randint(7, 10);
      atk += bonus;
      this.log('    ' + this.fmt() + ' 战阵触发！攻击 +' + bonus + ' -> ' + atk);
    }
    let dmg = calcDamage(this.count, this.minDmg, this.minDmg, this.maxDmg, atk, target.defense);
    if (this.special.gale && target.isRanged) {
      dmg = Math.round(dmg * (1 + this.special.gale));
      this.log('    ' + this.fmt() + ' 怒风！对远程伤害 +' + (this.special.gale * 100) + '% -> ' + dmg);
    }
    return dmg;
  }

  applyStrikeBonus(base) {
    let mult = 1.0;
    if (this.special.charge && this.firstAttack) {
      const fullHp = this.maxCount * this.hpEach;
      if (this.totalHp >= fullHp) {
        mult += this.special.charge;
        this.log('    ' + this.fmt() + ' 冲锋！伤害 x' + mult.toFixed(1));
      }
      this.firstAttack = false;
    }
    return Math.max(0, Math.round(base * mult));
  }

  dealStrikeDamage(dmg, target) {
    const oldCount = target.count;
    target.takeDamage(dmg);
    return [dmg, oldCount - target.count];
  }

  applyAfterStrike(kills, target) {
    if (this.special.rebirth && kills > 0 && !MUMMY_TYPES.has(target.unitName)) {
      const absorb = Math.ceil(kills / 2);
      const newCount = Math.min(this.count + absorb, this.maxCount);
      const gain = newCount - this.count;
      if (gain > 0) {
        this.totalHp += gain * this.hpEach;
        this.sync();
        this.log('    ' + this.fmt() + ' 转化复生！吸收 ' + gain + ' 人 -> ' + this.count + '人');
      }
    }
  }

  tryDodge() {
    const rate = this.special.dodge || 0;
    return rate > 0 && Math.random() < rate;
  }

  tryCounterImmune() { return (this.special.counter_immune || 0) > 0; }

  tryRevive(preCount) {
    if (!this.special.revive) return;
    if (!this.alive || this.count <= 0) return;
    if (this.count >= preCount) return;
    const reviveAmount = Math.floor(this.maxCount * this.special.revive);
    const threshold = this.maxCount - reviveAmount;
    if (this.count >= threshold) return;
    if (Math.random() >= 0.35) return;
    const newCount = Math.min(this.count + reviveAmount, this.maxCount);
    const gain = newCount - this.count;
    if (gain > 0) {
      this.totalHp += gain * this.hpEach;
      this.sync();
      this.log('    ' + this.fmt() + ' 复活！恢复 ' + gain + ' 人 -> ' + this.count + '人');
    }
  }

  canCounter(attacker) {
    if (!this.alive) return false;
    if (!this.skills.includes('counter_attack')) return false;
    if (attacker.isRanged || attacker.tryCounterImmune()) return false;
    return true;
  }

  counterStrike(attacker) {
    if (!this.canCounter(attacker)) return 0;
    const base = calcDamage(this.count, this.minDmg, this.minDmg, this.maxDmg, this.attack, attacker.defense);
    let mult = 0.5;
    let tag = '反击';
    if (this.special.fury) {
      mult *= this.special.fury;
      tag = '愤怒反击';
    }
    const dmg = Math.max(0, Math.round(base * mult));
    attacker.takeDamage(dmg);
    this.log('    ' + this.fmt() + ' ' + tag + '！造成 ' + dmg + ' 伤害');
    return dmg;
  }

  handleCounter(target) {
    if (!target.alive) return;
    if (target.canCounter(this)) {
      const preCount = this.count;
      target.counterStrike(this);
      this.log('    ' + this.fmt() + ' ' + preCount + ' -> ' + this.count);
      if (!this.alive) this.log('    ' + this.fmt() + ' 被反击致死！');
    } else if (this.isRanged) {
      // 远程不显示任何反击相关内容
    } else if (target.skills.includes('counter_attack') && this.tryCounterImmune()) {
      this.log('    ' + this.fmt() + ' 免疫了反击！');
    }
  }

  performStrikeSequence(target, multiplier, skipMultiplier) {
    if (!this.alive) return false;

    if (target.tryDodge()) {
      if (this.special.charge && this.firstAttack) {
        this.firstAttack = false;
      }
      this.log('  ' + this.fmtCount() + ' -> ' + target.fmtCount() + ' 被闪避！');
      this.handleCounter(target);
      return false;
    }

    const preCount = target.count;
    const [dmg, kills] = this.strike(target, multiplier);
    const causedDeath = target.count < preCount;

    if (multiplier !== 1.0 && !skipMultiplier) {
      this.log('  ' + this.fmtCount() + ' -> ' + target.fmt() + ' 造成 ' + dmg + ' 伤害 (x' + (multiplier*100).toFixed(0) + '%)');
    } else {
      this.log('  ' + this.fmtCount() + ' -> ' + target.fmt() + ' 造成 ' + dmg + ' 伤害');
    }
    this.log('    ' + target.fmt() + ' ' + preCount + ' -> ' + target.count);

    this.applyAfterStrike(kills, target);
    target.tryRevive(preCount);
    this.handleCounter(target);
    return causedDeath;
  }

  performMultiStrike(target, shots, mult, shotName) {
    this.log('  ' + this.fmt() + ' 发动' + shotName + '！');
    for (let i = 0; i < shots; i++) {
      if (!this.alive || !target.alive) return shots - i;
      const pct = (mult * 100).toFixed(0);
      const label = shotName === '吐息' ? '次喷射' : '箭';
      this.log('    第' + (i+1) + label + '（' + pct + '%伤害）:');
      this.performStrikeSequence(target, mult, true);
    }
    return 0;
  }

  performRampage(target) {
    let causedDeath = this.performStrikeSequence(target, 1.0);
    while (causedDeath && this.special.rampage) {
      if (Math.random() >= this.special.rampage) break;
      if (!this.alive || !target.alive) break;
      this.log('  ' + this.fmt() + ' 怒斩！');
      causedDeath = this.performStrikeSequence(target, 1.0);
    }
    return causedDeath;
  }
}

// ==================== 4. 战斗引擎 ====================
function simulateOne(unitA, countA, unitB, countB, logs) {
  const a = new Squad('甲', unitA, countA, logs);
  const b = new Squad('乙', unitB, countB, logs);

  logs.push('=== 战斗开始：' + a.fmt() + '(' + countA + ') vs ' + b.fmt() + '(' + countB + ') ===\n');

  for (let rnd = 1; rnd <= 1000; rnd++) {
    if (!a.alive || !b.alive) break;
    logs.push('--- 回合 ' + rnd + ' ---');

    let order;
    if (a.speed > b.speed) {
      order = [[a, b], [b, a]];
      logs.push('  速度判定：' + a.fmt() + '(' + a.speed + ') > ' + b.fmt() + '(' + b.speed + ')，' + a.fmt() + '先动');
    } else if (b.speed > a.speed) {
      order = [[b, a], [a, b]];
      logs.push('  速度判定：' + b.fmt() + '(' + b.speed + ') > ' + a.fmt() + '(' + a.speed + ')，' + b.fmt() + '先动');
    } else {
      const first = Math.random() < 0.5 ? a : b;
      const second = first === a ? b : a;
      order = [[first, second], [second, first]];
      logs.push('  速度相同(' + a.speed + ')，随机先手：' + first.fmt() + '先动');
    }

    for (const [attacker, defender] of order) {
      if (!attacker.alive || !defender.alive) continue;
      logs.push('\n  ' + attacker.fmtCount() + ' 行动：');

      if (attacker.special.triple_crossbow) {
        attacker.performMultiStrike(defender, 3, attacker.special.triple_crossbow, '三连弩');
      } else if (attacker.special.breath) {
        attacker.performMultiStrike(defender, 3, attacker.special.breath, '吐息');
      } else {
        attacker.performRampage(defender);
      }

      if (!defender.alive) {
        logs.push('\n  * ' + defender.fmt() + ' 全军覆没！');
        break;
      }
      if (!attacker.alive) {
        logs.push('\n  * ' + attacker.fmt() + ' 全军覆没！');
        break;
      }
    }
  }

  logs.push('');
  if (a.alive && !b.alive) {
    logs.push('=== 战斗结束：' + a.fmt() + ' 胜利 ===');
    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
    return { winner: 'A', winnerUnit: unitA, winnerCount: a.count, loserCount: b.count, aRem: a.count, bRem: b.count };
  } else if (b.alive && !a.alive) {
    logs.push('=== 战斗结束：' + b.fmt() + ' 胜利 ===');
    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
    return { winner: 'B', winnerUnit: unitB, winnerCount: b.count, loserCount: a.count, aRem: a.count, bRem: b.count };
  } else {
    logs.push('=== 战斗结束：平局 ===');
    logs.push('  ' + a.fmt() + ' 剩余：' + a.count + '/' + a.maxCount);
    logs.push('  ' + b.fmt() + ' 剩余：' + b.count + '/' + b.maxCount);
    return { winner: 'draw', aRem: a.count, bRem: b.count };
  }
}

function priorityKey(s) { return [-s.speed, -s.roll]; }

function simulateRelay(unitA, countA, groupsA, unitB, countB, groupsB, logs) {
  const FAST_MODE = groupsA > 10 && groupsB > 10;
  const totalAStart = countA * groupsA;
  const totalBStart = countB * groupsB;

  function log(line) { if (!FAST_MODE) logs.push(line); }

  const queueA = Array(groupsA).fill(countA);
  const queueB = Array(groupsB).fill(countB);

  let curA = new Squad('甲', unitA, queueA.shift(), logs);
  if (FAST_MODE) curA.log = function() {};
  let curB = new Squad('乙', unitB, queueB.shift(), logs);
  if (FAST_MODE) curB.log = function() {};
  let groupNumA = 1, groupNumB = 1;

  logs.push('=== 接力模式：' + curA.fmt() + '(' + countA + ')x' + groupsA + ' vs ' + curB.fmt() + '(' + countB + ')x' + groupsB + ' ===\n');

  function assignRoll(squad) {
    const used = new Set();
    if (curA.alive && curA !== squad && curA.speed === squad.speed) used.add(curA.roll.toFixed(8));
    if (curB.alive && curB !== squad && curB.speed === squad.speed) used.add(curB.roll.toFixed(8));
    let roll;
    do { roll = Math.random(); } while (used.has(roll.toFixed(8)));
    squad.roll = roll;
  }

  function getSpeedLineBottom(acted) {
    let bs = Infinity, br = Infinity;
    for (const s of acted) {
      if (s.speed < bs || (s.speed === bs && s.roll < br)) {
        bs = s.speed; br = s.roll;
      }
    }
    return [bs, br];
  }

  function isBehindSpeedLine(squad, bs, br) {
    if (bs === Infinity) return true;
    if (squad.speed < bs) return true;
    if (squad.speed === bs && squad.roll <= br) return true;
    return false;
  }

  const MAX_ROUNDS = Math.max(5000, (groupsA + groupsB) * 50);

  for (let rnd = 1; rnd <= MAX_ROUNDS; rnd++) {
    if (curA.alive) assignRoll(curA);
    if (curB.alive) assignRoll(curB);

    if (!curA.alive && !queueA.length) {
      log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
      const remB = 1 + queueB.length;
      log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
      if (FAST_MODE) logFastResult();
      return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: curA.alive ? curA.count : 0, bRem: curB.count, remGA: queueA.length, remGB: 1 + queueB.length };
    }
    if (!curB.alive && !queueB.length) {
      log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
      const remA = 1 + queueA.length;
      log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
      if (FAST_MODE) logFastResult();
      return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: curB.alive ? curB.count : 0, remGA: 1 + queueA.length, remGB: queueB.length };
    }

    log('\n--- 回合 ' + rnd + ' ---');

    const aliveA = curA.alive, aliveB = curB.alive;
    if (aliveA && aliveB) {
      if (curA.speed !== curB.speed) {
        log('  速度判定：' + (curA.speed > curB.speed ? curA.fmt() : curB.fmt()) + '先动');
      } else {
        log('  速度相同(' + curA.speed + ')，随机先手：' + (curA.roll > curB.roll ? curA.fmt() : curB.fmt()) + '先动');
      }
    }

    let acted = new Set();

    function buildQueue(actedSet) {
      const [bs, br] = getSpeedLineBottom(actedSet);
      let q = [];
      if (curA.alive && !actedSet.has(curA) && isBehindSpeedLine(curA, bs, br)) q.push(['甲', curA]);
      if (curB.alive && !actedSet.has(curB) && isBehindSpeedLine(curB, bs, br)) q.push(['乙', curB]);
      q.sort((a, b) => {
        const ka = priorityKey(a[1]), kb = priorityKey(b[1]);
        for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
        return 0;
      });
      return q;
    }

    let queue = buildQueue(acted);

    while (queue.length > 0) {
      const [owner, attacker] = queue.shift();
      acted.add(attacker);

      const defender = owner === '甲' ? curB : curA;
      if (!attacker.alive || !defender.alive) continue;

      log('\n  ' + attacker.fmtCount() + ' 行动：');

      let msRem = 0, msMult = 1.0, msLabel = '箭';

      if (attacker.special.triple_crossbow) {
        msRem = attacker.performMultiStrike(defender, 3, attacker.special.triple_crossbow, '三连弩');
        msMult = attacker.special.triple_crossbow;
      } else if (attacker.special.breath) {
        msRem = attacker.performMultiStrike(defender, 3, attacker.special.breath, '吐息');
        msMult = attacker.special.breath;
        msLabel = '次喷射';
      } else {
        attacker.performRampage(defender);
      }

      if (!attacker.alive) {
        const ga = owner === '甲' ? groupNumA : groupNumB;
        log('\n  * ' + attacker.fmt() + ' 第' + ga + '组全军覆没！');
        if (owner === '甲') {
          if (queueA.length) {
            curA = new Squad('甲', unitA, queueA.shift(), logs);
            if (FAST_MODE) curA.log = function() {};
            groupNumA++;
            log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
            assignRoll(curA);
            queue = buildQueue(acted);
          } else {
            log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
            const remB2 = 1 + queueB.length;
            log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB2 + '/' + groupsB + '组)');
            if (FAST_MODE) logFastResult();
            return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: 0, bRem: curB.count, remGA: 0, remGB: remB2 };
          }
        } else {
          if (queueB.length) {
            curB = new Squad('乙', unitB, queueB.shift(), logs);
            if (FAST_MODE) curB.log = function() {};
            groupNumB++;
            log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
            assignRoll(curB);
            queue = buildQueue(acted);
          } else {
            log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
            const remA2 = 1 + queueA.length;
            log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA2 + '/' + groupsA + '组)');
            if (FAST_MODE) logFastResult();
            return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: 0, remGA: remA2, remGB: 0 };
          }
        }
      }

      if (!defender.alive) {
        const gd = defender.player === '甲' ? groupNumA : groupNumB;
        log('\n  * ' + defender.fmt() + ' 第' + gd + '组全军覆没！');

        while (true) {
          if (defender.player === '甲') {
            if (!queueA.length) {
              log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
              const remB = 1 + queueB.length;
              log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
              if (FAST_MODE) logFastResult();
              return { winner: 'B', winnerUnit: unitB, winnerCount: curB.count, aRem: 0, bRem: curB.count, remGA: 0, remGB: remB };
            }
            curA = new Squad('甲', unitA, queueA.shift(), logs);
            if (FAST_MODE) curA.log = function() {};
            groupNumA++;
            log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
          } else {
            if (!queueB.length) {
              log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
              const remA = 1 + queueA.length;
              log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
              if (FAST_MODE) logFastResult();
              return { winner: 'A', winnerUnit: unitA, winnerCount: curA.count, aRem: curA.count, bRem: 0, remGA: remA, remGB: 0 };
            }
            curB = new Squad('乙', unitB, queueB.shift(), logs);
            if (FAST_MODE) curB.log = function() {};
            groupNumB++;
            log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
          }

          if (msRem <= 0 || !attacker.alive) break;

          let shotNum = 4 - msRem;
          while (msRem > 0 && attacker.alive) {
            const currentTarget = defender.player === '甲' ? curA : curB;
            if (!currentTarget.alive) break;
            log('    第' + shotNum + msLabel + '（' + (msMult*100).toFixed(0) + '%伤害）:');
            attacker.performStrikeSequence(currentTarget, msMult, true);
            msRem--;
            shotNum++;
          }

          const currentTarget = defender.player === '甲' ? curA : curB;
          if (currentTarget.alive) break;
          const gc = currentTarget.player === '甲' ? groupNumA : groupNumB;
          log('\n  * ' + currentTarget.fmt() + ' 第' + gc + '组全军覆没！');
        }

        if (curA.alive) assignRoll(curA);
        if (curB.alive) assignRoll(curB);
        queue = buildQueue(acted);
      }
    }
  }

  log('\n=== 战斗结束：回合耗尽(' + MAX_ROUNDS + ')，平局 ===');
  const remA3 = 1 + queueA.length;
  const remB3 = 1 + queueB.length;
  log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA3 + '/' + groupsA + '组)');
  log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB3 + '/' + groupsB + '组)');
  if (FAST_MODE) logFastResult();
  return { winner: 'draw', aRem: curA.count, bRem: curB.count, remGA: remA3, remGB: remB3 };

  function logFastResult() {
    const aAlive = curA.alive ? 1 : 0;
    const bAlive = curB.alive ? 1 : 0;
    const remA = (curA.alive ? curA.count : 0) + queueA.reduce(function(s,c){return s+c;}, 0);
    const remB = (curB.alive ? curB.count : 0) + queueB.reduce(function(s,c){return s+c;}, 0);
    const remGA = aAlive + queueA.length;
    const remGB = bAlive + queueB.length;
    const aLoss = totalAStart - remA;
    const bLoss = totalBStart - remB;
    let ratioStr = '\n伤亡对比：' + aLoss + '/' + bLoss;
    if (bLoss > 0) ratioStr += ' = ' + (aLoss / bLoss).toFixed(4);
    const redName = '[[R:' + stripSuffix(unitA) + ']]';
    const greenName = '[[G:' + stripSuffix(unitB) + ']]';
    if (FAST_MODE) {
      logs.push("\n（双方组数均超过10组，进入快速模式）");
    }
    logs.push("\n=== 快速模式统计 ===");
    logs.push(redName + ": 初始 " + totalAStart + " 人(" + groupsA + "组) | 剩余 " + remA + " 人(" + remGA + "组)");
    logs.push(greenName + ": 初始 " + totalBStart + " 人(" + groupsB + "组) | 剩余 " + remB + " 人(" + remGB + "组)" + ratioStr);
  }
}

// ==================== API 路由 ====================
export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { unitA, countA, groupsA, unitB, countB, groupsB, mode } = req.body;

  // 验证参数
  if (!unitA || !unitB || !UNITS_DB[unitA] || !UNITS_DB[unitB]) {
    return res.status(400).json({ error: 'Invalid unit' });
  }

  const cA = Math.min(parseInt(countA) || 1, UNITS_DB[unitA].attributes.max_troop_size);
  const cB = Math.min(parseInt(countB) || 1, UNITS_DB[unitB].attributes.max_troop_size);
  const gA = Math.min(parseInt(groupsA) || 1, 10000);
  const gB = Math.min(parseInt(groupsB) || 1, 10000);
  const m = mode || 'single';

  const logs = [];
  let result;

  try {
    if (m === 'single') {
      result = simulateOne(unitA, cA, unitB, cB, logs);
    } else {
      result = simulateRelay(unitA, cA, gA, unitB, cB, gB, logs);
    }

    res.status(200).json({
      logs,
      result: {
        winner: result.winner,
        winnerUnit: result.winnerUnit || null,
        winnerCount: result.winnerCount || 0,
        aRem: result.aRem,
        bRem: result.bRem,
        remGA: result.remGA || 1,
        remGB: result.remGB || 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
