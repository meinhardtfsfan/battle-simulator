// ============================================================
//  Cloudflare Pages Functions - 模拟帝国战斗模拟器后端
//  文件位置: functions/_worker.js
//  部署后 API 地址: https://你的pages域名/api/simulate
// ============================================================

const UNITS_DB = {"殉教者(波斯)": {"name": "殉教者", "faction": "persian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 9, "defense": 8, "min_damage": 3, "max_damage": 4, "hp": 18}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "弓箭兵(波斯)": {"name": "弓箭兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 6, "defense": 8, "min_damage": 2, "max_damage": 5, "hp": 18}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "长矛步兵(波斯)": {"name": "长矛步兵", "faction": "persian", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 11, "defense": 12, "min_damage": 4, "max_damage": 8, "hp": 30}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "象骑射手(波斯)": {"name": "象骑射手", "faction": "persian", "attributes": {"speed": 4, "max_troop_size": 124, "attack": 7, "defense": 12, "min_damage": 5, "max_damage": 10, "hp": 129}, "tags": {"role": "ranged", "size": 3, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "轻骑兵(波斯)": {"name": "轻骑兵", "faction": "persian", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 12, "defense": 12, "min_damage": 7, "max_damage": 7, "hp": 36}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "铁甲骑士(波斯)": {"name": "铁甲骑士", "faction": "persian", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 20, "defense": 17, "min_damage": 12, "max_damage": 17, "hp": 50}, "tags": {"role": "melee", "size": 2, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "影子武士(波斯)": {"name": "影子武士", "faction": "persian", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 17, "defense": 12, "min_damage": 10, "max_damage": 12, "hp": 36}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "猛犸(波斯)": {"name": "猛犸", "faction": "persian", "attributes": {"speed": 3, "max_troop_size": 124, "attack": 21, "defense": 17, "min_damage": 9, "max_damage": 15, "hp": 150}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "弓箭手(希腊)": {"name": "弓箭手", "faction": "greek", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 9, "defense": 9, "min_damage": 2, "max_damage": 5, "hp": 20}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "雅典卫兵(希腊)": {"name": "雅典卫兵", "faction": "greek", "attributes": {"speed": 7, "max_troop_size": 174, "attack": 9, "defense": 6, "min_damage": 3, "max_damage": 5, "hp": 20}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "标枪手(希腊)": {"name": "标枪手", "faction": "greek", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 10, "defense": 9, "min_damage": 4, "max_damage": 8, "hp": 20}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "泰坦(希腊)": {"name": "泰坦", "faction": "greek", "attributes": {"speed": 6, "max_troop_size": 124, "attack": 14, "defense": 11, "min_damage": 7, "max_damage": 11, "hp": 89}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "女祭司(希腊)": {"name": "女祭司", "faction": "greek", "attributes": {"speed": 4, "max_troop_size": 149, "attack": 11, "defense": 13, "min_damage": 0, "max_damage": 0, "hp": 19}, "tags": {"role": "healer", "size": 1, "special_skills": ["heal"], "attack_pattern": "support", "is_melee": false, "is_ranged": false, "is_healer": true, "can_counter": false}}, "重装骑兵(希腊)": {"name": "重装骑兵", "faction": "greek", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 16, "defense": 15, "min_damage": 10, "max_damage": 13, "hp": 36}, "tags": {"role": "melee", "size": 2, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "斯巴达勇士(希腊)": {"name": "斯巴达勇士", "faction": "greek", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 16, "defense": 17, "min_damage": 9, "max_damage": 12, "hp": 46}, "tags": {"role": "melee", "size": 2, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "半人马(希腊)": {"name": "半人马", "faction": "greek", "attributes": {"speed": 8, "max_troop_size": 124, "attack": 19, "defense": 18, "min_damage": 9, "max_damage": 11, "hp": 100}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "长戟步兵(中国)": {"name": "长戟步兵", "faction": "chinese", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 12, "defense": 6, "min_damage": 4, "max_damage": 5, "hp": 25}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "盾兵(中国)": {"name": "盾兵", "faction": "chinese", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 5, "defense": 19, "min_damage": 2, "max_damage": 5, "hp": 25}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "连弩校尉(中国)": {"name": "连弩校尉", "faction": "chinese", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 6, "defense": 6, "min_damage": 3, "max_damage": 7, "hp": 22}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "轻骑兵(中国)": {"name": "轻骑兵", "faction": "chinese", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 11, "defense": 11, "min_damage": 6, "max_damage": 8, "hp": 35}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "御林将军(中国)": {"name": "御林将军", "faction": "chinese", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 14, "defense": 17, "min_damage": 9, "max_damage": 14, "hp": 42}, "tags": {"role": "melee", "size": 2, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "狴犴(中国)": {"name": "狴犴", "faction": "chinese", "attributes": {"speed": 8, "max_troop_size": 124, "attack": 21, "defense": 12, "min_damage": 6, "max_damage": 13, "hp": 62}, "tags": {"role": "melee", "size": 2, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "女娲(中国)": {"name": "女娲", "faction": "chinese", "attributes": {"speed": 6, "max_troop_size": 124, "attack": 20, "defense": 17, "min_damage": 9, "max_damage": 10, "hp": 100}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "努比亚卫兵(埃及)": {"name": "努比亚卫兵", "faction": "egyptian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 9, "defense": 8, "min_damage": 2, "max_damage": 5, "hp": 21}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "长弓兵(埃及)": {"name": "长弓兵", "faction": "egyptian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 10, "defense": 8, "min_damage": 3, "max_damage": 6, "hp": 19}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "精锐枪盾兵(埃及)": {"name": "精锐枪盾兵", "faction": "egyptian", "attributes": {"speed": 5, "max_troop_size": 149, "attack": 14, "defense": 11, "min_damage": 4, "max_damage": 7, "hp": 39}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "木乃伊战士(埃及)": {"name": "木乃伊战士", "faction": "egyptian", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 8, "defense": 6, "min_damage": 6, "max_damage": 7, "hp": 35}, "tags": {"role": "melee", "size": 1, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "皇家木乃伊(埃及)": {"name": "皇家木乃伊", "faction": "egyptian", "attributes": {"speed": 7, "max_troop_size": 149, "attack": 16, "defense": 12, "min_damage": 6, "max_damage": 10, "hp": 85}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "阿努比斯(埃及)": {"name": "阿努比斯", "faction": "egyptian", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 21, "defense": 16, "min_damage": 10, "max_damage": 13, "hp": 70}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}, "荷鲁斯(埃及)": {"name": "荷鲁斯", "faction": "egyptian", "attributes": {"speed": 4, "max_troop_size": 124, "attack": 21, "defense": 17, "min_damage": 10, "max_damage": 15, "hp": 130}, "tags": {"role": "melee_counter", "size": 3, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "梭镖投射手(阿兹特克)": {"name": "梭镖投射手", "faction": "aztec", "attributes": {"speed": 5, "max_troop_size": 174, "attack": 9, "defense": 8, "min_damage": 2, "max_damage": 5, "hp": 24}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "黑曜石刃枪兵(阿兹特克)": {"name": "黑曜石刃枪兵", "faction": "aztec", "attributes": {"speed": 6, "max_troop_size": 174, "attack": 14, "defense": 10, "min_damage": 4, "max_damage": 7, "hp": 36}, "tags": {"role": "melee_counter", "size": 1, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "美洲虎武士(阿兹特克)": {"name": "美洲虎武士", "faction": "aztec", "attributes": {"speed": 8, "max_troop_size": 149, "attack": 17, "defense": 14, "min_damage": 8, "max_damage": 10, "hp": 42}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "雄鹰武士(阿兹特克)": {"name": "雄鹰武士", "faction": "aztec", "attributes": {"speed": 7, "max_troop_size": 149, "attack": 14, "defense": 10, "min_damage": 6, "max_damage": 8, "hp": 36}, "tags": {"role": "melee_counter", "size": 2, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "巫师(阿兹特克)": {"name": "巫师", "faction": "aztec", "attributes": {"speed": 6, "max_troop_size": 149, "attack": 6, "defense": 10, "min_damage": 2, "max_damage": 4, "hp": 22}, "tags": {"role": "ranged", "size": 1, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "审判者(阿兹特克)": {"name": "审判者", "faction": "aztec", "attributes": {"speed": 6, "max_troop_size": 124, "attack": 16, "defense": 14, "min_damage": 8, "max_damage": 11, "hp": 90}, "tags": {"role": "melee_counter", "size": 3, "special_skills": ["counter_attack"], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": true}}, "羽蛇神(阿兹特克)": {"name": "羽蛇神", "faction": "aztec", "attributes": {"speed": 6, "max_troop_size": 124, "attack": 20, "defense": 16, "min_damage": 10, "max_damage": 15, "hp": 120}, "tags": {"role": "ranged", "size": 3, "special_skills": ["ranged"], "attack_pattern": "ranged", "is_melee": false, "is_ranged": true, "is_healer": false, "can_counter": false}}, "阿努比斯(替身)": {"name": "阿努比斯替身", "faction": "egyptian", "attributes": {"speed": 9, "max_troop_size": 149, "attack": 21, "defense": 16, "min_damage": 10, "max_damage": 13, "hp": 70}, "tags": {"role": "melee", "size": 3, "special_skills": [], "attack_pattern": "melee", "is_melee": true, "is_ranged": false, "is_healer": false, "can_counter": false}}};

const SPECIAL_ABILITIES = {
  "影子武士(波斯)":   {dodge: 0.50},
  "御林将军(中国)":   {counter_immune: 1.00},
  "美洲虎武士(阿兹特克)":   {counter_immune: 1.00},
  "荷鲁斯(埃及)":   {fury: 1.50},
  "铁甲骑士(波斯)":   {charge: 0.30},
  "斯巴达勇士(希腊)":   {formation: true},
  "皇家木乃伊(埃及)":   {rebirth: true},
  "女娲(中国)":   {revive: 0.20},
  "半人马(希腊)":   {rampage: 0.40},
  "审判者(阿兹特克)":   {rampage: 0.40},
  "连弩校尉(中国)":   {triple_crossbow: 0.50},
  "羽蛇神(阿兹特克)":   {breath: 0.55},
  "长弓兵(埃及)":   {gale: 0.20},
  "重装骑兵(希腊)":   {holy_light: true},
  "泰坦(远程)(希腊)":   {lightning: true},
  "狴犴(中国)":   {teamwork: 0.70},
  "阿努比斯(埃及)":   {clone: 0.35}
};

const MUMMY_TYPES = new Set(["皇家木乃伊(埃及)", "木乃伊战士(埃及)"]);

function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function calcDamage(Num, L, Rmin, Rmax, A, D) {
  const R = randint(Rmin, Rmax);
  let dmg;
  if (A > D) dmg = Num * (L + R * (1 + (A - D) * 0.1));
  else if (A < D) dmg = Num * (L + R * (1 - (D - A) * 0.05));
  else dmg = Num * (L + R);
  return Math.max(0, Math.round(dmg));
}

function stripSuffix(name) {
  const idx = name.lastIndexOf('(');
  return idx > 0 ? name.slice(0, idx) : name;
}

function priorityKey(s) { return [-s.speed, -s.roll]; }

function getUnitAttr(unitName, overrides) {
  const dbName = unitName === '阿努比斯(替身)' ? '阿努比斯(埃及)' : unitName;
  const orig = UNITS_DB[dbName].attributes;
  if (!overrides) {
    return { ...orig, orig_max_troop_size: orig.max_troop_size };
  }
  return {
    speed: overrides.speed ?? orig.speed,
    attack: overrides.attack ?? orig.attack,
    defense: overrides.defense ?? orig.defense,
    min_damage: overrides.min_damage ?? orig.min_damage,
    max_damage: overrides.max_damage ?? orig.max_damage,
    hp: unitName === '阿努比斯(替身)' ? 0.001 : (overrides.hp ?? orig.hp),
    max_troop_size: overrides.max_troop_size ?? orig.max_troop_size,
    orig_max_troop_size: orig.max_troop_size
  };
}

class Squad {
  constructor(player, unitName, count, logs, atkBuff, defBuff, modes, overrides) {
    this.player = player;
    this.unitName = unitName;
    this.logs = logs;
    const dbName = unitName === '阿努比斯(替身)' ? '阿努比斯(埃及)' : unitName;
    const attr = getUnitAttr(unitName, overrides);
    const tags = UNITS_DB[dbName].tags;
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
    this.special = {};
    if (SPECIAL_ABILITIES[dbName]) {
      this.special = { ...SPECIAL_ABILITIES[dbName] };
    }
    if (dbName === '泰坦(希腊)' && modes?.ranged) {
      this.isRanged = true;
      this.special = { ...this.special, lightning: true };
    }
    this.firstAttack = true;
    this.roll = 0;
    this.atkBuff = atkBuff || 0;
    this.defBuff = defBuff || 0;
    this.modes = modes || {};
    this.getEnemy = null;
    this._teamRem = 0;
    this._teamIsEr = false;
  }

  fmt() {
    const isClone = this.unitName === '阿努比斯(替身)';
    const base = stripSuffix(this.unitName);
    return this.player === '甲' ? '[[R:' + base + (isClone ? '(替身)' : '') + ']]' : '[[G:' + base + (isClone ? '(替身)' : '') + ']]';
  }
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
    const netBuff = this.atkBuff - target.defBuff;
    if (netBuff !== 0) {
      const netMult = Math.max(0, 1 + netBuff / 4000);
      final = Math.floor(final * netMult);
    }
    if (multiplier !== 1.0) final = Math.max(0, Math.round(final * multiplier));
    const [dmg, kills] = this.dealStrikeDamage(final, target);
    return [dmg, kills];
  }

  calcStrikeDamage(target) {
    let atk = this.attack;
    if (this.special.formation) {
      const bonus = randint(7, 10);
      atk += bonus;
      this.log('    ' + this.fmt() + ' 战阵触发！攻击 +' + bonus + ' → ' + atk);
    }
    if (this.special.holy_light && MUMMY_TYPES.has(target.unitName)) {
      this.log('    ' + this.fmt() + ' 光明力量！对木乃伊造成双倍伤害');
      var hlMult = 2.0;
    } else {
      var hlMult = 1.0;
    }
    if (this.special.lightning) {
      this.log('    ' + this.fmt() + ' 闪电！伤害减半');
      var lnMult = 0.5;
    } else {
      var lnMult = 1.0;
    }
    let dmg = Math.round(calcDamage(this.count, this.minDmg, this.minDmg, this.maxDmg, atk, target.defense) * hlMult * lnMult);
    if (this.special.gale && target.isRanged) {
      const isSaladinOn = this.modes.saladin;
      const galeBonus = isSaladinOn ? (this.special.gale + 0.20) : this.special.gale;
      dmg = Math.round(dmg * (1 + galeBonus));
      this.log('    ' + this.fmt() + (isSaladinOn ? ' 萨拉丁·怒风！' : ' 怒风！') + '对远程伤害 +' + (galeBonus * 100).toFixed(0) + '% → ' + dmg);
    }
    return dmg;
  }

  applyStrikeBonus(base) {
    let mult = 1.0;
    if (this.special.charge && this.firstAttack) {
      const fullHp = this.maxCount * this.hpEach;
      if (this.totalHp >= fullHp) {
        const chargePct = this.modes.chargeLevel;
        mult += chargePct / 100;
        this.log('    ' + this.fmt() + ' 冲锋！');
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
    if (this.special.rebirth && kills > 0 && !MUMMY_TYPES.has(target.unitName) && target.unitName !== '阿努比斯(替身)') {
      const isOsirisOn = this.modes.osiris;
      const ratio = isOsirisOn ? 0.8 : 0.5;
      const absorb = Math.ceil(kills * ratio);
      const newCount = Math.min(this.count + absorb, this.maxCount);
      const gain = newCount - this.count;
      if (gain > 0) {
        this.totalHp += gain * this.hpEach;
        this.sync();
        this.log('    ' + this.fmt() + (isOsirisOn ? ' 奥西里斯·转化复生！' : ' 转化复生！') + '吸收 ' + gain + ' 人 → ' + this.count + '人');
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
      this.log('    ' + this.fmt() + ' 复活！恢复 ' + gain + ' 人 → ' + this.count + '人');
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
      mult *= 1.5;
      tag = '愤怒反击';
    }
    const isMentuOn = this.modes.mentu;
    if (isMentuOn) {
      mult += 0.5;
      tag = this.special.fury ? '愤怒·孟图反击' : '孟图反击';
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
      this.log('    ' + this.fmt() + ' ' + preCount + ' → ' + this.count);
      if (!this.alive) this.log('    ' + this.fmt() + ' 被反击致死！');
    } else if (this.isRanged) {
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
      this.log('  ' + this.fmtCount() + ' → ' + target.fmtCount() + ' 被闪避！');
      this.handleCounter(target);
      return false;
    }
    const preCount = target.count;
    const [dmg, kills] = this.strike(target, multiplier);
    const causedDeath = target.count < preCount;
    if (multiplier !== 1.0 && !skipMultiplier) {
      this.log('  ' + this.fmtCount() + ' → ' + target.fmt() + ' 造成 ' + dmg + ' 伤害 (×' + (multiplier*100).toFixed(0) + '%)');
    } else {
      this.log('  ' + this.fmtCount() + ' → ' + target.fmt() + ' 造成 ' + dmg + ' 伤害');
    }
    this.log('    ' + target.fmt() + ' ' + preCount + ' → ' + target.count);
    this.applyAfterStrike(kills, target);
    target.tryRevive(preCount);
    this.handleCounter(target);
    return causedDeath;
  }

  performMultiStrike(target, shots, mult, shotName) {
    this.log('  ' + this.fmt() + ' ' + shotName + '！');
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
    const isAresOn = this.modes.ares;
    const rampageRate = isAresOn ? 0.9 : (this.special.rampage || 0);
    if (causedDeath && rampageRate && Math.random() < rampageRate) {
      if (this.alive && target.alive) {
        this.log('  ' + this.fmt() + (isAresOn ? ' 阿瑞斯·怒斩！' : ' 怒斩！'));
        this.performStrikeSequence(target, 1.0);
      }
    }
    const isErOn = this.modes.erlangshen;
    const teamRate = isErOn ? 1.0 : (this.special.teamwork || 0);
    const teamShots = isErOn ? 2 : 1;
    this._teamRem = 0;
    this._teamIsEr = isErOn;
    if (this.special.teamwork && this.alive && Math.random() < teamRate) {
      this._teamRem = teamShots;
      let currentTarget = target;
      while (this._teamRem > 0 && this.alive) {
        if (!currentTarget || !currentTarget.alive) break;
        this.log('  ' + this.fmt() + (this._teamIsEr ? ' 二郎神·团队作战！' : ' 团队作战！') + '（50%伤害）');
        this.performStrikeSequence(currentTarget, 0.5, true);
        this._teamRem--;
      }
    }
    return causedDeath;
  }
}

function simulateRelay(params) {
  const { red, blue, logs } = params;
  const unitA = red.unitName;
  const countA = red.count;
  const groupsA = red.groups;
  const unitB = blue.unitName;
  const countB = blue.count;
  const groupsB = blue.groups;
  const atkBuffA = red.atkBuff;
  const defBuffA = red.defBuff;
  const atkBuffB = blue.atkBuff;
  const defBuffB = blue.defBuff;
  const redModes = red.modes || {};
  const blueModes = blue.modes || {};
  const redOverrides = red.overrides || null;
  const blueOverrides = blue.overrides || null;

  const FAST_MODE = groupsA > 10 && groupsB > 10;
  const totalAStart = countA * groupsA;
  const totalBStart = countB * groupsB;
  let finalRound = 0;

  function log(line) { if (!FAST_MODE) logs.push(line); }

  const queueA = Array(groupsA).fill(countA);
  const queueB = Array(groupsB).fill(countB);

  const specA = SPECIAL_ABILITIES[unitA];
  const isCloneA = specA && specA.clone && Math.random() < redModes.cloneRate / 100;
  const specB = SPECIAL_ABILITIES[unitB];
  const isCloneB = specB && specB.clone && Math.random() < blueModes.cloneRate / 100;

  let curA = new Squad('甲', isCloneA ? '阿努比斯(替身)' : unitA, queueA.shift(), logs, atkBuffA, defBuffA, redModes, redOverrides);
  if (FAST_MODE) curA.log = function() {};
  curA.getEnemy = function() { return curB; };
  let curB = new Squad('乙', isCloneB ? '阿努比斯(替身)' : unitB, queueB.shift(), logs, atkBuffB, defBuffB, blueModes, blueOverrides);
  if (FAST_MODE) curB.log = function() {};
  curB.getEnemy = function() { return curA; };
  let groupNumA = 1, groupNumB = 1;

  const displayNameA = unitA === '阿努比斯(替身)' ? '阿努比斯' : stripSuffix(unitA);
  const displayNameB = unitB === '阿努比斯(替身)' ? '阿努比斯' : stripSuffix(unitB);
  logs.push('=== 接力模式：[[R:' + displayNameA + ']](' + countA + ')×' + groupsA + ' vs [[G:' + displayNameB + ']](' + countB + ')×' + groupsB + ' ===');
  if (isCloneA && !FAST_MODE) logs.push('[[R:阿努比斯]] 替身！');
  if (isCloneB && !FAST_MODE) logs.push('[[G:阿努比斯]] 替身！');
  logs.push('');

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

  const MAX_ROUNDS = Math.max(5000, (groupsA + groupsB) * 50);

  for (let rnd = 1; rnd <= MAX_ROUNDS; rnd++) {
    finalRound = rnd;

    if (!curA.alive && queueA.length) {
      curA = new Squad('甲', unitA, queueA.shift(), logs, atkBuffA, defBuffA, redModes, redOverrides);
      if (FAST_MODE) curA.log = function() {};
      curA.getEnemy = function() { return curB; };
      groupNumA++;
      log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 回合开始上场！');
    }
    if (!curB.alive && queueB.length) {
      curB = new Squad('乙', unitB, queueB.shift(), logs, atkBuffB, defBuffB, blueModes, blueOverrides);
      if (FAST_MODE) curB.log = function() {};
      curB.getEnemy = function() { return curA; };
      groupNumB++;
      log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 回合开始上场！');
    }

    if (curA.alive) assignRoll(curA);
    if (curB.alive) assignRoll(curB);

    if (!curA.alive && !queueA.length) {
      log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
      const remB = 1 + queueB.length;
      log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
      if (FAST_MODE) logFastResult();
      return { winner: unitB, redCount: 0, blueCount: curB.count, finalRound };
    }
    if (!curB.alive && !queueB.length) {
      log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
      const remA = 1 + queueA.length;
      log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
      if (FAST_MODE) logFastResult();
      return { winner: unitA, redCount: curA.count, blueCount: 0, finalRound };
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

    let queue = buildQueue(acted);

    while (queue.length > 0) {
      const [owner, attacker] = queue.shift();
      acted.add(attacker);

      let defender = owner === '甲' ? curB : curA;
      if (!attacker.alive || !defender.alive) continue;

      log('\n  ' + attacker.fmtCount() + ' 行动：');

      let msRem = 0, msMult = 1.0, msLabel = '箭';

      if (attacker.special.triple_crossbow) {
        const isHYOn = attacker.modes.huangyueying;
        const tcMult = isHYOn ? 0.70 : attacker.special.triple_crossbow;
        msRem = attacker.performMultiStrike(defender, 3, tcMult, isHYOn ? '黄月英·三连弩' : '三连弩');
        msMult = tcMult;
      } else if (attacker.special.breath) {
        msRem = attacker.performMultiStrike(defender, 3, attacker.special.breath, '吐息');
        msMult = attacker.special.breath;
        msLabel = '次喷射';
      } else {
        attacker.performRampage(defender);
      }

      if (!attacker.alive) {
        const ga = owner === '甲' ? groupNumA : groupNumB;
        if (attacker.unitName === '阿努比斯(替身)') {
          log('\n  ★ ' + attacker.fmt() + ' 全军覆没！');
        } else {
          log('\n  ★ ' + attacker.fmt() + ' 第' + ga + '组全军覆没！');
        }
        if (owner === '甲') {
          if (attacker.unitName === '阿努比斯(替身)') {
            curA = new Squad('甲', unitA, attacker.maxCount, logs, atkBuffA, defBuffA, redModes, redOverrides);
            if (FAST_MODE) curA.log = function() {};
            curA.getEnemy = function() { return curB; };
            log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
            assignRoll(curA);
            queue = buildQueue(acted);
          } else if (queueA.length) {
            const nextCountA = queueA.shift();
            const isCloneA2 = SPECIAL_ABILITIES[unitA] && SPECIAL_ABILITIES[unitA].clone && Math.random() < redModes.cloneRate / 100;
            curA = new Squad('甲', isCloneA2 ? '阿努比斯(替身)' : unitA, nextCountA, logs, atkBuffA, defBuffA, redModes, redOverrides);
            if (FAST_MODE) curA.log = function() {};
            curA.getEnemy = function() { return curB; };
            groupNumA++;
            if (curA.unitName === '阿努比斯(替身)') {
              log('>>> ' + curA.fmt() + ' 上场！');
            } else {
              log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
            }
            assignRoll(curA);
            queue = buildQueue(acted);
          } else {
            log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
            const remB2 = 1 + queueB.length;
            log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB2 + '/' + groupsB + '组)');
            if (FAST_MODE) logFastResult();
            return { winner: unitB, redCount: 0, blueCount: curB.count, finalRound };
          }
        } else {
          if (attacker.unitName === '阿努比斯(替身)') {
            curB = new Squad('乙', unitB, attacker.maxCount, logs, atkBuffB, defBuffB, blueModes, blueOverrides);
            if (FAST_MODE) curB.log = function() {};
            curB.getEnemy = function() { return curA; };
            log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
            assignRoll(curB);
            queue = buildQueue(acted);
          } else if (queueB.length) {
            const nextCountB = queueB.shift();
            const isCloneB2 = SPECIAL_ABILITIES[unitB] && SPECIAL_ABILITIES[unitB].clone && Math.random() < blueModes.cloneRate / 100;
            curB = new Squad('乙', isCloneB2 ? '阿努比斯(替身)' : unitB, nextCountB, logs, atkBuffB, defBuffB, blueModes, blueOverrides);
            if (FAST_MODE) curB.log = function() {};
            curB.getEnemy = function() { return curA; };
            groupNumB++;
            if (curB.unitName === '阿努比斯(替身)') {
              log('>>> ' + curB.fmt() + ' 上场！');
            } else {
              log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
            }
            assignRoll(curB);
            queue = buildQueue(acted);
          } else {
            log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
            const remA2 = 1 + queueA.length;
            log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA2 + '/' + groupsA + '组)');
            if (FAST_MODE) logFastResult();
            return { winner: unitA, redCount: curA.count, blueCount: 0, finalRound };
          }
        }
      }

      if (!defender.alive) {
        const gd = defender.player === '甲' ? groupNumA : groupNumB;
        if (defender.unitName === '阿努比斯(替身)') {
          log('\n  ★ ' + defender.fmt() + ' 全军覆没！');
        } else {
          log('\n  ★ ' + defender.fmt() + ' 第' + gd + '组全军覆没！');
        }

        while (true) {
          if (defender.player === '甲') {
            if (defender.unitName === '阿努比斯(替身)') {
              curA = new Squad('甲', unitA, defender.maxCount, logs, atkBuffA, defBuffA, redModes, redOverrides);
              if (FAST_MODE) curA.log = function() {};
              defender = curA;
              log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
            } else if (!queueA.length) {
              log('\n=== 战斗结束：' + curB.fmt() + ' 胜利 ===');
              const remB = 1 + queueB.length;
              log('  ' + curB.fmt() + ' 剩余：' + curB.count + '/' + curB.maxCount + ' (' + remB + '/' + groupsB + '组)');
              if (FAST_MODE) logFastResult();
              return { winner: unitB, redCount: 0, blueCount: curB.count, finalRound };
            } else {
              const nextCountA = queueA.shift();
              const isCloneA3 = SPECIAL_ABILITIES[unitA] && SPECIAL_ABILITIES[unitA].clone && Math.random() < redModes.cloneRate / 100;
              curA = new Squad('甲', isCloneA3 ? '阿努比斯(替身)' : unitA, nextCountA, logs, atkBuffA, defBuffA, redModes, redOverrides);
              if (FAST_MODE) curA.log = function() {};
              if (isCloneA3) defender = curA;
              groupNumA++;
              if (curA.unitName === '阿努比斯(替身)') {
                log('>>> ' + curA.fmt() + ' 上场！');
              } else {
                log('>>> ' + curA.fmt() + ' 第' + groupNumA + '组(' + curA.maxCount + ') 上场！');
              }
            }
          } else {
            if (defender.unitName === '阿努比斯(替身)') {
              curB = new Squad('乙', unitB, defender.maxCount, logs, atkBuffB, defBuffB, blueModes, blueOverrides);
              if (FAST_MODE) curB.log = function() {};
              defender = curB;
              log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
            } else if (!queueB.length) {
              log('\n=== 战斗结束：' + curA.fmt() + ' 胜利 ===');
              const remA = 1 + queueA.length;
              log('  ' + curA.fmt() + ' 剩余：' + curA.count + '/' + curA.maxCount + ' (' + remA + '/' + groupsA + '组)');
              if (FAST_MODE) logFastResult();
              return { winner: unitA, redCount: curA.count, blueCount: 0, finalRound };
            } else {
              const nextCountB = queueB.shift();
              const isCloneB3 = SPECIAL_ABILITIES[unitB] && SPECIAL_ABILITIES[unitB].clone && Math.random() < blueModes.cloneRate / 100;
              curB = new Squad('乙', isCloneB3 ? '阿努比斯(替身)' : unitB, nextCountB, logs, atkBuffB, defBuffB, blueModes, blueOverrides);
              if (FAST_MODE) curB.log = function() {};
              if (isCloneB3) defender = curB;
              groupNumB++;
              if (curB.unitName === '阿努比斯(替身)') {
                log('>>> ' + curB.fmt() + ' 上场！');
              } else {
                log('>>> ' + curB.fmt() + ' 第' + groupNumB + '组(' + curB.maxCount + ') 上场！');
              }
            }
          }

          if ((msRem <= 0 && attacker._teamRem <= 0) || !attacker.alive) break;

          let shotNum = 4 - msRem;
          while (msRem > 0 && attacker.alive) {
            const currentTarget = defender.player === '甲' ? curA : curB;
            if (!currentTarget.alive) break;
            log('    第' + shotNum + msLabel + '（' + (msMult*100).toFixed(0) + '%伤害）:');
            attacker.performStrikeSequence(currentTarget, msMult, true);
            msRem--;
            shotNum++;
          }

          while (attacker._teamRem > 0 && attacker.alive) {
            const currentTarget = defender.player === '甲' ? curA : curB;
            if (!currentTarget.alive) break;
            attacker.log('  ' + attacker.fmt() + (attacker._teamIsEr ? ' 二郎神·团队作战！' : ' 团队作战！') + '（50%伤害）');
            attacker.performStrikeSequence(currentTarget, 0.5, true);
            attacker._teamRem--;
          }

          const currentTarget = defender.player === '甲' ? curA : curB;
          if (currentTarget.alive) break;
          const gc = currentTarget.player === '甲' ? groupNumA : groupNumB;
          if (currentTarget.unitName === '阿努比斯(替身)') {
            log('\n  ★ ' + currentTarget.fmt() + ' 全军覆没！');
          } else {
            log('\n  ★ ' + currentTarget.fmt() + ' 第' + gc + '组全军覆没！');
          }
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
  return { winner: '平局', redCount: curA.count, blueCount: curB.count, finalRound };

  function logFastResult() {
    const aAlive = curA.alive ? 1 : 0;
    const bAlive = curB.alive ? 1 : 0;
    const remA = (curA.alive ? curA.count : 0) + queueA.reduce(function(s,c){return s+c;}, 0);
    const remB = (curB.alive ? curB.count : 0) + queueB.reduce(function(s,c){return s+c;}, 0);
    const remGA = aAlive + queueA.length;
    const remGB = bAlive + queueB.length;
    const aLoss = totalAStart - remA;
    const bLoss = totalBStart - remB;
    let ratioStr = '\n战损比：' + aLoss + '/' + bLoss;
    if (bLoss > 0) ratioStr += ' = ' + (aLoss / bLoss).toFixed(4);

    const redName = '[[R:' + stripSuffix(unitA) + ']]';
    const greenName = '[[G:' + stripSuffix(unitB) + ']]';

    logs.push("\n（双方组数均超过10组，进入快速模式）");
    logs.push("=== 快速模式统计（第 " + finalRound + " 回合结束）===");
    logs.push(redName + ": 初始 " + totalAStart + " 人(" + groupsA + "组) | 剩余 " + remA + " 人(" + remGA + "组)");
    logs.push(greenName + ": 初始 " + totalBStart + " 人(" + groupsB + "组) | 剩余 " + remB + " 人(" + remGB + "组)" + ratioStr);
  }
}

export default {
  async fetch(request, env, executionCtx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (url.pathname === '/api/simulate' && request.method === 'POST') {
      try {
        const params = await request.json();
        const logs = [];
        const result = simulateRelay({ ...params, logs });
        return new Response(JSON.stringify({ logs, result }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (url.pathname === '/api/units' && request.method === 'GET') {
      const units = Object.keys(UNITS_DB).filter(n => n !== '阿努比斯(替身)').map(name => ({
        name,
        faction: UNITS_DB[name].faction,
        attributes: UNITS_DB[name].attributes,
        tags: UNITS_DB[name].tags
      }));
      return new Response(JSON.stringify({ units }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
