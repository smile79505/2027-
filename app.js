const STORAGE_KEY = 'travel-planner-v1';

const DEFAULT_DATA = {
  itin: {
    1:{date:'2027/01/20 (三)', title:'抵達名古屋、熱田神宮參拜', items:[
      {time:'06:30', title:'抵達中部國際機場 (T2)', desc:'搭乘樂桃 MM860 抵達,轉乘名鐵特急前往名古屋。', q:'中部國際機場'},
      {time:'10:00', title:'熱田神宮', desc:'日本三大神宮之一,古木參天、氣氛幽靜。', q:'熱田神宮'},
      {time:'12:30', title:'🍱 熱田蓬萊軒(鰻魚飯三吃)', desc:'名古屋代表美食。', q:'熱田蓬萊軒 本店'},
      {time:'16:00', title:'Oasis 21 與名古屋電視塔', desc:'看榮商圈夜景。', q:'Oasis 21 名古屋'}
    ]},
    2:{date:'2027/01/21 (四)', title:'名古屋城、大須商店街', items:[
      {time:'09:30', title:'名古屋城、本丸御殿', desc:'金鯱天守閣與木造本丸御殿。', q:'名古屋城'},
      {time:'12:30', title:'🍱 矢場豬排 (矢場とん)', desc:'濃厚赤味噌醬汁的招牌味噌豬排。', q:'矢場とん'},
      {time:'14:30', title:'大須觀音、大須商店街', desc:'古寺與熱鬧商店街。', q:'大須観音'}
    ]},
    3:{date:'2027/01/22 (五)', title:'吉卜力公園 第 1 天', items:[
      {time:'09:30', title:'抵達愛・地球博紀念公園', desc:'搭 Linimo 前往吉卜力公園。', q:'愛・地球博記念公園'},
      {time:'10:30', title:'吉卜力大倉庫', desc:'神隱少女、貓巴士與動畫名場面展區。', q:'ジブリの大倉庫'},
      {time:'13:00', title:'🍱 大倉庫繪本咖啡廳', desc:'吉卜力主題輕食與甜點。', q:'ジブリの大倉庫 カフェ'}
    ]},
    4:{date:'2027/01/23 (六)', title:'吉卜力公園 第 2 天', items:[
      {time:'10:00', title:'魔法公主之里、魔女之谷', desc:'魔法公主的村落與《霍爾的移動城堡》場景。', q:'ジブリパーク 魔女の谷'},
      {time:'13:00', title:'🍱 園區五平餅', desc:'炭火現烤。', q:'ジブリパーク'},
      {time:'16:00', title:'回榮商圈自由購物', desc:'買吉卜力周邊。', q:'栄 名古屋'}
    ]},
    5:{date:'2027/01/24 (日)', title:'國寶犬山城、三光稻荷神社', items:[
      {time:'09:30', title:'犬山城', desc:'現存最古老的木造天守。', q:'犬山城'},
      {time:'11:30', title:'三光稻荷神社', desc:'粉紅愛心繪馬牆與錢洗祈福。', q:'三光稲荷神社 犬山'},
      {time:'13:00', title:'🍱 犬山城下町', desc:'飛驒牛炙燒握壽司、五平餅。', q:'犬山城下町'}
    ]},
    6:{date:'2027/01/25 (一)', title:'白川鄉合掌村、飛驒高山老街', items:[
      {time:'08:00', title:'搭高速巴士前往白川鄉', desc:'巴士需事先預約。', q:'名鉄バスセンター'},
      {time:'10:30', title:'白川鄉合掌村', desc:'雪中合掌屋像繪本場景。', q:'白川郷 合掌造り集落'},
      {time:'14:00', title:'飛驒高山老街', desc:'黑木格子窗的古街���', q:'飛騨高山 古い町並'}
    ]},
    7:{date:'2027/01/26 (二)', title:'榮商圈與 JR 塔購物、搭機返台', items:[
      {time:'10:30', title:'JR Central Towers、伴手禮', desc:'購物與最後一餐。', q:'JRセントラルタワーズ'},
      {time:'13:00', title:'🍱 名古屋雞白湯拉麵', desc:'旅程最後一餐。', q:'名古屋駅 鶏白湯ラーメン'},
      {time:'18:30', title:'抵達中部國際機場 (T2)', desc:'辦理樂桃登機。', q:'中部国際空港 第2ターミナル'}
    ]}
  },
  hotel:{name:'名古屋站前精選飯店(待預訂)', address:'愛知縣名古屋市中村區名駅(近 JR 名古屋站)', notes:'鄰近名鐵百貨與巴士總站。'},
  members:['我','小明','小美'],
  rate:0.215,
  expenses:[
    {id:1,title:'Komeda 咖啡早餐', amount:1800, payer:'我', split:{'我':600,'小明':600,'小美':600}},
    {id:2,title:'矢場豬排晚餐', amount:5400, payer:'小明', split:{'我':1800,'小明':1800,'小美':1800}}
  ],
  checklist:[
    {id:1,cat:'證件與付款', text:'護照(效期 6 個月以上)', done:false},
    {id:2,cat:'證件與付款', text:'電子機票與登機證', done:false},
    {id:3,cat:'預約', text:'吉卜力公園指定日期門票', done:false},
    {id:4,cat:'衣物', text:'保暖外套、發熱衣', done:false},
    {id:5,cat:'電子與其他', text:'eSIM 或網路卡', done:false}
  ]
};

let state = loadState();
let currentDay = 1;

const GHIBLI_NODES = {
  nagoya:{label:'名古屋車站',x:90,y:105},
  fuji:{label:'藤之丘站',x:330,y:105},
  station:{label:'公園站',x:590,y:105},
  tower:{label:'電梯塔（北口）',x:590,y:245},
  valley:{label:'魔女之谷',x:405,y:330},
  hill:{label:'青春之丘',x:155,y:390},
  warehouse:{label:'吉卜力大倉庫',x:445,y:430},
  magic:{label:'魔法故鄉',x:245,y:520},
  forest:{label:'動動力森林',x:605,y:520}
};

const GHIBLI_MODES = [
  {name:'聯外交通',sub:'名古屋 → 吉卜力公園北口',steps:[
    {node:'nagoya',time:'10:30',note:'名古屋車站出發，搭乘東山線。',type:'transit'},
    {node:'fuji',time:'10:58',note:'藤之丘站轉乘 Linimo。',type:'transit'},
    {node:'station',time:'11:16',note:'抵達愛・地球博紀念公園站。',type:'walk'},
    {node:'tower',time:'11:18',note:'步行前往電梯塔（北口）。',type:'walk'}
  ]},
  {name:'園區 Day 1',sub:'1/22・輕量探索',steps:[
    {node:'nagoya',time:'09:40',note:'從名古屋車站出發。',type:'transit'},
    {node:'fuji',time:'10:08',note:'藤之丘站轉乘 Linimo。',type:'transit'},
    {node:'station',time:'10:26',note:'抵達公園站。',type:'walk'},
    {node:'tower',time:'10:28',note:'從北口進入園區。',type:'walk'},
    {node:'valley',time:'10:40',note:'魔女之谷散步與拍照。',type:'walk'},
    {node:'warehouse',time:'13:00',note:'依預約時段參觀吉卜力大倉庫。',type:'walk'},
    {node:'hill',time:'15:00',note:'前往青春之丘。',type:'walk'},
    {node:'forest',time:'16:00',note:'視體力安排動動力森林。',type:'walk'}
  ]},
  {name:'園區 Day 2',sub:'1/23・園區深度遊',steps:[
    {node:'nagoya',time:'07:50',note:'早班從名古屋車站出發。',type:'transit'},
    {node:'fuji',time:'08:18',note:'藤之丘站轉乘 Linimo。',type:'transit'},
    {node:'station',time:'08:36',note:'抵達公園站。',type:'walk'},
    {node:'tower',time:'08:38',note:'從北口進入園區。',type:'walk'},
    {node:'valley',time:'08:50',note:'先前往魔女之谷。',type:'walk'},
    {node:'hill',time:'11:00',note:'前往青春之丘。',type:'walk'},
    {node:'magic',time:'12:00',note:'魔法故鄉散步。',type:'walk'},
    {node:'forest',time:'13:00',note:'動動力森林與午餐。',type:'walk'},
    {node:'warehouse',time:'15:00',note:'依票券與體力安排大倉庫。',type:'walk'}
  ]}
];

let ghibliIndex = 0;
let ghibliStop = 0;
let ghibliPlaying = false;
let ghibliFrame = 0;

function loadState(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) return JSON.parse(saved);
  }catch{}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.hidden = true, 2200);
}

function switchTab(tab){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(tab)?.classList.add('active');
  document.querySelectorAll('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.bottom-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
}

function updateCountdown(){
  const start = new Date(2027,0,20);
  const today = new Date();
  const diff = Math.ceil((start - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  const text = diff > 0 ? `${diff} 天` : '旅程進行中';
  document.getElementById('countdownText').textContent = text;
}

function getWeatherData(){
  const fallback = {
    nagoya:{city:'名古屋',temp:12,condition:'晴時多雲',icon:'☀️',humidity:62,rain:'10%',wind:'8 km/h',summary:'早晚偏冷，輕羽絨外套最適合。'},
    takayama:{city:'飛驒高山',temp:4,condition:'多雲',icon:'☁️',humidity:72,rain:'25%',wind:'6 km/h',summary:'氣溫較低，保暖衣物必備。'}
  };
  try{
    const raw = localStorage.getItem('travel-weather');
    if(raw) return JSON.parse(raw);
  }catch{}
  localStorage.setItem('travel-weather', JSON.stringify(fallback));
  return fallback;
}
function renderWeather(){
  const weather = getWeatherData();
  document.getElementById('weatherBox').innerHTML = Object.values(weather).map(item => `
    <div class="weather-card">
      <div class="weather-top">
        <div>
          <div class="weather-city">${item.city}</div>
          <div class="weather-temp">${Math.round(item.temp)}°</div>
        </div>
        <div class="weather-cond">${item.icon} ${item.condition}</div>
      </div>

      <div class="weather-stats">
        <div class="weather-stat"><div>濕度</div><strong>${item.humidity}%</strong></div>
        <div class="weather-stat"><div>雨機</div><strong>${item.rain}</strong></div>
        <div class="weather-stat"><div>風</div><strong>${item.wind}</strong></div>
      </div>

      <div class="small" style="color:rgba(255,255,255,.75)">${item.summary}</div>
    </div>
  `).join('');
}
function refreshWeather(){
  const weather = getWeatherData();
  const next = {
    nagoya:{...weather.nagoya, temp: weather.nagoya.temp + (Math.random() > 0.5 ? 1 : -1), rain:`${Math.floor(Math.random()*35)+10}%`},
    takayama:{...weather.takayama, temp: weather.takayama.temp + (Math.random() > 0.5 ? 1 : -1), rain:`${Math.floor(Math.random()*45)+15}%`}
  };
  localStorage.setItem('travel-weather', JSON.stringify(next));
  renderWeather();
  toast('已更新天氣資料');
}

function renderDayButtons(){
  document.getElementById('dayButtons').innerHTML = Object.keys(state.itin).map(key => `
    <button class="day-btn ${Number(key)===currentDay ? 'active' : ''}" data-day="${key}" type="button">${state.itin[key].date}</button>
  `).join('');
}
function renderItinerary(){
  const day = state.itin[currentDay];
  const items = day.items.map((item,index) => `
    <div class="timeline-item">
      <div class="row">
        <span class="time-tag">${item.time}</span>
        <span class="row">
          <button class="small-btn" type="button" data-move-up="${currentDay}:${index}" ${index===0?'disabled':''}>↑</button>
          <button class="small-btn" type="button" data-move-down="${currentDay}:${index}" ${index===day.items.length-1?'disabled':''}>↓</button>
          <button class="small-btn" type="button" data-delete-item="${currentDay}:${index}">刪除</button>
        </span>
      </div>
      <h3>${item.title}</h3>
      <div class="muted">${item.desc || ''}</div>
      <a class="maplink" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.q || item.title)}" target="_blank" rel="noreferrer">📍 在地圖開啟</a>
    </div>
  `).join('');

  document.getElementById('itineraryBox').innerHTML = `
    <div class="soft-card">
      <div class="section-head">
        <div>
          <div class="tiny muted">Day ${currentDay}</div>
          <h2>${day.title}</h2>
        </div>
        <span class="chip">${day.date}</span>
      </div>
      <div class="timeline">${items || '<div class="muted">這天還沒有行程</div>'}</div>
    </div>

    <div class="soft-card">
      <h3>＋ 自訂新增這天的行程</h3>
      <div class="tool-row">
        <input id="newTime" class="input" placeholder="時間 (14:00)" style="max-width:160px">
        <input id="newTitle" class="input grow" placeholder="景點或美食名稱">
      </div>
      <input id="newDesc" class="input" placeholder="介紹與備註" style="margin-top:10px">
      <button id="addItemBtn" class="small-btn" type="button" style="margin-top:10px; width:100%">加入本日行程</button>
    </div>
  `;
}

function renderHotel(){
  const h = state.hotel;
  document.getElementById('hotelBox').innerHTML = `
    <div class="soft-card">
      <div class="row between">
        <strong>${h.name}</strong>
        <button class="small-btn" type="button" data-hotel-edit>編輯</button>
      </div>
      <div class="muted" style="margin-top:8px">${h.address}</div>
      <div class="muted" style="margin-top:8px">${h.notes}</div>
    </div>
  `;
}

function renderChecklist(){
  const items = state.checklist;
  const done = items.filter(i => i.done).length;
  const total = items.length;
  document.getElementById('checkProgressText').textContent = `${done} / ${total}`;
  document.getElementById('checkProgressBar').style.width = total ? `${(done / total) * 100}%` : '0%';

  const cats = [...new Set(items.map(i => i.cat))];
  document.getElementById('checkCategory').innerHTML = cats.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  const box = document.getElementById('checklistBox');
  box.innerHTML = cats.map(cat => {
    const list = items.filter(i => i.cat === cat);
    return `
      <div class="soft-card">
        <h3>${cat}</h3>
        ${list.map(item => `
          <div class="checklist-item ${item.done ? 'done' : ''}">
            <label>
              <input type="checkbox" data-check-id="${item.id}" ${item.done ? 'checked' : ''}>
              <span>${item.text}</span>
            </label>
            <button class="small-btn" type="button" data-delete-check="${item.id}">✕</button>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function renderMembers(){
  const box = document.getElementById('memberBox');
  box.innerHTML = state.members.map((m, idx) => `
    <span class="member-badge">${m}<button type="button" data-remove-member="${idx}">✕</button></span>
  `).join('');

  document.getElementById('expensePayer').innerHTML = state.members.map(m => `<option value="${m}">${m}</option>`).join('');
  renderParticipants();
  renderCustomInputs();
  document.getElementById('rateInput').value = state.rate;
}
function renderParticipants(){
  document.getElementById('expenseParticipants').innerHTML = state.members.map(m => `
    <label class="member-badge">
      <input type="checkbox" checked value="${m}">
      ${m}
    </label>
  `).join('');
}
function renderCustomInputs(){
  document.getElementById('expenseCustom').innerHTML = state.members.map(m => `
    <div class="row" style="align-items:center">
      <span class="small" style="width:52px;">${m}</span>
      <input class="input" type="number" data-custom-member="${m}" value="0">
    </div>
  `).join('');
}
function calculateSettlement(){
  const members = state.members;
  const paid = Object.fromEntries(members.map(m => [m, 0]));
  const owed = Object.fromEntries(members.map(m => [m, 0]));

  state.expenses.forEach(exp => {
    if (paid[exp.payer] !== undefined) paid[exp.payer] += Number(exp.amount || 0);
    Object.entries(exp.split || {}).forEach(([member, amount]) => {
      if (owed[member] !== undefined) owed[member] += Number(amount || 0);
    });
  });

  const net = {};
  members.forEach(m => { net[m] = (paid[m] || 0) - (owed[m] || 0); });

  const debt = [];
  const credit = [];
  members.forEach(m => {
    if (net[m] < 0) debt.push([m, Math.abs(net[m])]);
    if (net[m] > 0) credit.push([m, net[m]]);
  });

  debt.sort((a,b) => b[1]-a[1]);
  credit.sort((a,b) => b[1]-a[1]);

  const transfers = [];
  while (debt.length && credit.length) {
    const debtor = debt[0];
    const creditor = credit[0];
    const value = Math.min(debtor[1], creditor[1]);
    transfers.push({from: debtor[0], to: creditor[0], amount: value});
    debtor[1] -= value;
    creditor[1] -= value;
    if (debtor[1] <= 0) debt.shift();
    if (creditor[1] <= 0) credit.shift();
  }

  return { net, transfers };
}

function renderExpenseList(){
  const total = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  document.getElementById('totalJpy').textContent = 'JPY ' + total.toLocaleString();
  document.getElementById('totalTwd').textContent = '≈ TWD ' + Math.round(total * state.rate).toLocaleString();

  document.getElementById('expenseList').innerHTML = state.expenses.length
    ? state.expenses.map(item => `
      <div class="expense-row">
        <div>
          <strong>${item.title}</strong>
          <div class="muted">${item.payer} 先付</div>
        </div>
        <div class="row">
          <b>JPY ${Number(item.amount).toLocaleString()}</b>
          <button class="small-btn" type="button" data-delete-expense="${item.id}">刪除</button>
        </div>
      </div>
    `).join('')
    : '<div class="muted">尚未新增任何費用。</div>';

  renderSettlement();
}
function renderSettlement(){
  const { net, transfers } = calculateSettlement();
  const box = document.getElementById('settlementBox');

  if(!state.expenses.length){
    box.innerHTML = '<div class="muted">尚未新增任何費用。</div>';
    return;
  }

  let lines = '';
  state.members.forEach(m => {
    const diff = net[m];
    if (diff > 0) lines += `<div class="small" style="color:var(--forest);font-weight:800">🟢 ${m} 應收 JPY ${Math.round(diff).toLocaleString()}</div>`;
    else if (diff < 0) lines += `<div class="small" style="color:var(--danger);font-weight:800">🔴 ${m} 應付 JPY ${Math.round(Math.abs(diff)).toLocaleString()}</div>`;
    else lines += `<div class="small muted">⚪ ${m} 已打平</div>`;
  });

  const transferHtml = transfers.length
    ? transfers.map(t => `<div class="small"><b>${t.from}</b> → <b>${t.to}</b>：JPY ${Math.round(t.amount).toLocaleString()}</div>`).join('')
    : '<div class="muted">沒有需要轉帳的部分。</div>';

  box.innerHTML = `
    ${lines}
    <div style="margin-top:10px;border-top:1px dashed rgba(57,47,44,.35);padding-top:10px">
      <div class="tiny muted">最少轉帳</div>
      ${transferHtml}
    </div>
  `;
}

function drawGhibliRoute(activeProgress = 0){
  const mode = GHIBLI_MODES[ghibliIndex];
  const marker = document.getElementById('ghibliMarker');
  if(!mode || !marker) return;

  const legs = [...document.querySelectorAll('[data-ghibli-leg]')];
  legs.forEach((path, index) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length}`;
    if(index < ghibliStop) path.style.strokeDashoffset = '0';
    else if(index === ghibliStop) path.style.strokeDashoffset = String(length * (1 - activeProgress));
    else path.style.strokeDashoffset = String(length);
  });

  if(ghibliStop >= mode.steps.length - 1){
    const endNode = GHIBLI_NODES[mode.steps[mode.steps.length - 1].node];
    marker.setAttribute('transform', `translate(${endNode.x} ${endNode.y})`);
    return;
  }

  const leg = document.querySelector(`[data-ghibli-leg="${ghibliStop}"]`);
  if(leg){
    const point = leg.getPointAtLength(leg.getTotalLength() * activeProgress);
    marker.setAttribute('transform', `translate(${point.x} ${point.y})`);
  }else{
    const cur = GHIBLI_NODES[mode.steps[ghibliStop].node];
    marker.setAttribute('transform', `translate(${cur.x} ${cur.y})`);
  }
}
function jumpGhibliStop(index){
  const mode = GHIBLI_MODES[ghibliIndex];
  ghibliPlaying = false;
  cancelAnimationFrame(ghibliFrame);
  ghibliStop = Math.max(0, Math.min(index, mode.steps.length - 1));
  renderGhibli();
}
function pauseGhibli(){
  ghibliPlaying = false;
  cancelAnimationFrame(ghibliFrame);
  renderGhibli();
}
function playGhibliLeg(){
  const mode = GHIBLI_MODES[ghibliIndex];
  if(!ghibliPlaying || ghibliStop >= mode.steps.length - 1){
    ghibliPlaying = false;
    renderGhibli();
    return;
  }

  const legIndex = ghibliStop;
  const duration = 1400;
  let start = null;

  const tick = (ts) => {
    if(!ghibliPlaying) return;
    if(start === null) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    drawGhibliRoute(progress);

    if(progress < 1){
      ghibliFrame = requestAnimationFrame(tick);
      return;
    }

    ghibliStop = legIndex + 1;
    renderGhibli();

    if(ghibliStop < mode.steps.length - 1 && ghibliPlaying){
      ghibliFrame = requestAnimationFrame(playGhibliLeg);
    }else{
      ghibliPlaying = false;
      renderGhibli();
    }
  };

  ghibliFrame = requestAnimationFrame(tick);
}
function startGhibli(){
  const mode = GHIBLI_MODES[ghibliIndex];
  if(ghibliStop >= mode.steps.length - 1) ghibliStop = 0;
  ghibliPlaying = true;
  renderGhibli();
  playGhibliLeg();
}
function renderGhibli(){
  const mode = GHIBLI_MODES[ghibliIndex];
  const stepMarkup = mode.steps.map((step,index) => `
    <button class="stop-item ${index === ghibliStop ? 'active' : ''}" type="button" data-ghibli-stop="${index}">
      <span class="stop-no">${index + 1}</span>
      <span>
        <strong>${GHIBLI_NODES[step.node].label}</strong>
        <div class="small muted">${step.note}</div>
      </span>
      <span class="stop-time">${step.time}</span>
    </button>
  `).join('');

  const nodeMarkup = Object.entries(GHIBLI_NODES).map(([id,node]) => {
    const index = mode.steps.findIndex(step => step.node === id);
    const isVisited = index >= 0 && index < ghibliStop;
    const active = index === ghibliStop;
    return `
      <g class="map-node ${isVisited ? 'visited' : ''} ${active ? 'active' : ''}" data-ghibli-node="${id}" tabindex="0" role="button" aria-label="${node.label}" transform="translate(${node.x} ${node.y})">
        <circle r="17"></circle>
        <text class="glabel" x="0" y="32" text-anchor="middle">${node.label}</text>
      </g>
    `;
  }).join('');

  const legMarkup = mode.steps.slice(1).map((step,index) => {
    const from = GHIBLI_NODES[mode.steps[index].node];
    const to = GHIBLI_NODES[step.node];
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2 - 12;
    const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
    return `
      <path class="map-route base" d="${d}"></path>
      <path class="map-route leg ${step.type === 'transit' ? 'transit' : 'walk'}" data-ghibli-leg="${index}" d="${d}"></path>
    `;
  }).join('');

  document.getElementById('ghibliBox').innerHTML = `
    <div class="ghibli-card">
      <div class="section-head">
        <div>
          <h3>${mode.name}</h3>
          <small class="muted">${mode.sub}</small>
        </div>
        <span class="chip">第 ${ghibliStop + 1} / ${mode.steps.length} 站</span>
      </div>

      <div class="ghibli-mode">
        ${GHIBLI_MODES.map((item,index) => `
          <button type="button" class="${index === ghibliIndex ? 'active' : ''}" data-ghibli-mode="${index}">${item.name}</button>
        `).join('')}
      </div>

      <div class="map-shell">
        <svg class="map-svg" viewBox="0 0 760 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${mode.name}遊路線圖">
          <rect x="12" y="12" width="736" height="160" rx="22" fill="#f9f0d6" stroke="#d7c4a5" stroke-width="2"></rect>
          <rect x="12" y="188" width="736" height="400" rx="22" fill="#e6efd9" stroke="#b9cdaa" stroke-width="2"></rect>
          <text class="glabel-small" x="32" y="42">名古屋市區・聯外交通</text>
          <text class="glabel-small" x="32" y="220">愛・地球博紀念公園・園區示意圖</text>
          <path d="M75 105 H620" fill="none" stroke="#d7d0bc" stroke-width="16" stroke-linecap="round"></path>
          <path d="M75 105 H620" fill="none" stroke="#3b7fc4" stroke-width="5" stroke-dasharray="10 8"></path>
          <path d="M590 122 V245" fill="none" stroke="#d0a143" stroke-width="5" stroke-dasharray="7 7"></path>

          ${legMarkup}
          ${nodeMarkup}

          <g id="ghibliMarker" transform="translate(0 0)">
            <circle class="map-marker" r="13"></circle>
            <circle class="map-marker-core" r="4"></circle>
          </g>
        </svg>
      </div>

      <div class="map-controls">
        <button class="small-btn" type="button" data-ghibli-action="prev" ${ghibliStop <= 0 ? 'disabled' : ''}>◀ 上一站</button>
        <button class="small-btn" type="button" data-ghibli-action="play">${ghibliPlaying ? '⏸ 暫停導覽' : '▶ 播放路線'}</button>
        <button class="small-btn" type="button" data-ghibli-action="next" ${ghibliStop >= mode.steps.length - 1 ? 'disabled' : ''}>下一站 ▶</button>
        <button class="small-btn" type="button" data-ghibli-action="reset">↺ 重設</button>
      </div>

      <div class="progress-bar"><i style="width:${mode.steps.length > 1 ? (ghibliStop / (mode.steps.length - 1)) * 100 : 0}%"></i></div>

      <div class="stop-list">${stepMarkup}</div>
    </div>
  `;

  drawGhibliRoute(0);
}

function addItem(){
  const title = document.getElementById('newTitle').value.trim();
  if(!title){ toast('請輸入行程名稱'); return; }
  state.itin[currentDay].items.push({
    time: document.getElementById('newTime').value.trim() || '隨時',
    title,
    desc: document.getElementById('newDesc').value.trim(),
    q: title
  });
  document.getElementById('newTime').value = '';
  document.getElementById('newTitle').value = '';
  document.getElementById('newDesc').value = '';
  saveState(); renderAll(); toast('已加入行程');
}
function addChecklistItem(){
  const text = document.getElementById('newChecklistItem').value.trim();
  if(!text){ toast('請輸入清單項目'); return; }
  const cat = document.getElementById('checkCategory').value || '自訂';
  state.checklist.push({id:Date.now(), cat, text, done:false});
  document.getElementById('newChecklistItem').value = '';
  saveState(); renderChecklist(); toast('已加入清單');
}
function addMember(){
  const name = document.getElementById('newMemberInput').value.trim();
  if(!name){ toast('請輸入成員名稱'); return; }
  if(state.members.includes(name)){ toast('成員已存在'); return; }
  state.members.push(name);
  document.getElementById('newMemberInput').value = '';
  saveState(); renderMembers(); renderExpenseList(); toast('已新增成員');
}
function addExpense(){
  const title = document.getElementById('expenseTitle').value.trim();
  const amount = Number(document.getElementById('expenseAmount').value);
  const payer = document.getElementById('expensePayer').value;
  if(!title || !amount || !payer){ toast('請填寫項目、金額與付款人'); return; }

  const mode = document.getElementById('expenseMode').value;
  const split = {};
  if(mode === 'equal'){
    const checked = [...document.querySelectorAll('#expenseParticipants input:checked')].map(el => el.value);
    if(!checked.length){ toast('請至少勾選一位分攤成員'); return; }
    state.members.forEach(m => split[m] = checked.includes(m) ? amount / checked.length : 0);
  }else{
    state.members.forEach(m => {
      const v = Number(document.querySelector(`[data-custom-member="${m}"]`)?.value || 0);
      split[m] = v;
    });
  }

  state.expenses.push({id:Date.now(), title, amount, payer, split});
  document.getElementById('expenseTitle').value = '';
  document.getElementById('expenseAmount').value = '';
  saveState();
  renderMembers();
  renderExpenseList();
  toast('已記入帳本');
}

function renderAll(){
  renderWeather();
  renderDayButtons();
  renderItinerary();
  renderHotel();
  renderChecklist();
  renderMembers();
  renderExpenseList();
  renderGhibli();
  updateCountdown();
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-tab]');
  if(tab){ switchTab(tab.dataset.tab); return; }

  const dayBtn = e.target.closest('[data-day]');
  if(dayBtn){ currentDay = Number(dayBtn.dataset.day); renderDayButtons(); renderItinerary(); return; }

  const gotoDay = e.target.closest('[data-goto-day]');
  if(gotoDay){ currentDay = Number(gotoDay.dataset.gotoDay); switchTab('itinerary'); renderDayButtons(); renderItinerary(); return; }

  const ghibliMode = e.target.closest('[data-ghibli-mode]');
  if(ghibliMode){
    ghibliPlaying = false;
    cancelAnimationFrame(ghibliFrame);
    ghibliIndex = Number(ghibliMode.dataset.ghibliMode);
    ghibliStop = 0;
    renderGhibli();
    return;
  }

  const ghibliAction = e.target.closest('[data-ghibli-action]');
  if(ghibliAction){
    const action = ghibliAction.dataset.ghibliAction;
    if(action === 'play'){
      if(ghibliPlaying) pauseGhibli(); else startGhibli();
    }else if(action === 'next'){
      jumpGhibliStop(ghibliStop + 1);
    }else if(action === 'prev'){
      jumpGhibliStop(ghibliStop - 1);
    }else if(action === 'reset'){
      ghibliPlaying = false;
      cancelAnimationFrame(ghibliFrame);
      ghibliStop = 0;
      renderGhibli();
    }
    return;
  }

  const stopBtn = e.target.closest('[data-ghibli-stop]');
  if(stopBtn){ jumpGhibliStop(Number(stopBtn.dataset.ghibliStop)); return; }

  const nodeBtn = e.target.closest('[data-ghibli-node]');
  if(nodeBtn){
    const mode = GHIBLI_MODES[ghibliIndex];
    const target = nodeBtn.dataset.ghibliNode;
    const next = mode.steps.findIndex((step,index) => step.node === target && index >= ghibliStop);
    const first = mode.steps.findIndex(step => step.node === target);
    if(next >= 0) jumpGhibliStop(next);
    else if(first >= 0) jumpGhibliStop(first);
    return;
  }

  const addItemBtn = e.target.closest('#addItemBtn'); if(addItemBtn){ addItem(); return; }
  const addChecklistBtn = e.target.closest('#addChecklistBtn'); if(addChecklistBtn){ addChecklistItem(); return; }
  const addMemberBtn = e.target.closest('#addMemberBtn'); if(addMemberBtn){ addMember(); return; }
  const addExpenseBtn = e.target.closest('#addExpenseBtn'); if(addExpenseBtn){ addExpense(); return; }
  const refreshWeatherBtn = e.target.closest('#refreshWeather'); if(refreshWeatherBtn){ refreshWeather(); return; }

  const deleteCheck = e.target.closest('[data-delete-check]');
  if(deleteCheck){
    state.checklist = state.checklist.filter(item => String(item.id) !== String(deleteCheck.dataset.deleteCheck));
    saveState(); renderChecklist(); toast('已刪除項目');
    return;
  }

  const deleteExpense = e.target.closest('[data-delete-expense]');
  if(deleteExpense){
    state.expenses = state.expenses.filter(item => String(item.id) !== String(deleteExpense.dataset.deleteExpense));
    saveState(); renderExpenseList(); toast('已刪除費用');
    return;
  }

  const moveUp = e.target.closest('[data-move-up]');
  if(moveUp){
    const [dayKey, idx] = moveUp.dataset.moveUp.split(':');
    const arr = state.itin[dayKey].items;
    const i = Number(idx);
    if(i > 0){ [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; saveState(); renderAll(); }
    return;
  }

  const moveDown = e.target.closest('[data-move-down]');
  if(moveDown){
    const [dayKey, idx] = moveDown.dataset.moveDown.split(':');
    const arr = state.itin[dayKey].items;
    const i = Number(idx);
    if(i < arr.length - 1){ [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; saveState(); renderAll(); }
    return;
  }

  const deleteItem = e.target.closest('[data-delete-item]');
  if(deleteItem){
    const [dayKey, idx] = deleteItem.dataset.deleteItem.split(':');
    state.itin[dayKey].items.splice(Number(idx),1);
    saveState(); renderAll();
    return;
  }

  const removeMember = e.target.closest('[data-remove-member]');
  if(removeMember){
    const idx = Number(removeMember.dataset.removeMember);
    if(state.members.length <= 1){ toast('至少保留一位成員'); return; }
    const member = state.members[idx];
    const used = state.expenses.some(exp => exp.payer === member || (exp.split && exp.split[member] > 0));
    if(used){ toast('此成員已有帳目，請先整理後再刪除'); return; }
    state.members.splice(idx,1);
    saveState(); renderMembers(); renderExpenseList(); toast('已移除成員');
    return;
  }

  const hotelEdit = e.target.closest('[data-hotel-edit]');
  if(hotelEdit){
    const name = prompt('飯店名稱', state.hotel.name);
    if(name !== null) state.hotel.name = name.trim() || state.hotel.name;
    const addr = prompt('飯店地址', state.hotel.address);
    if(addr !== null) state.hotel.address = addr.trim() || state.hotel.address;
    const note = prompt('入住備忘', state.hotel.notes);
    if(note !== null) state.hotel.notes = note.trim() || state.hotel.notes;
    saveState(); renderHotel(); toast('已更新飯店資訊');
    return;
  }

  const copyBtn = e.target.closest('[data-copy]');
  if(copyBtn){
    const value = copyBtn.dataset.copy;
    navigator.clipboard?.writeText(value).then(() => toast('已複製')).catch(() => toast('複製失敗'));
    return;
  }

  const speakBtn = e.target.closest('[data-speak]');
  if(speakBtn){
    const text = speakBtn.dataset.speak;
    if('speechSynthesis' in window){
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }
});

document.addEventListener('change', (e) => {
  const check = e.target.closest('[data-check-id]');
  if(check){
    const item = state.checklist.find(x => String(x.id) === String(check.dataset.checkId));
    if(item){ item.done = check.checked; saveState(); renderChecklist(); }
  }

  if(e.target.id === 'rateInput'){
    const val = Number(e.target.value);
    state.rate = val > 0 ? val : 0.215;
    saveState(); renderExpenseList();
  }

  if(e.target.id === 'expenseMode'){
    const mode = e.target.value;
    document.getElementById('equalBox').hidden = mode !== 'equal';
    document.getElementById('customBox').hidden = mode !== 'custom';
    if(mode === 'custom') renderCustomInputs();
  }
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && e.target.id === 'newChecklistItem'){ addChecklistItem(); }
  if(e.key === 'Enter' && e.target.id === 'newMemberInput'){ addMember(); }
  if(e.key === 'Enter' && (e.target.id === 'newTime' || e.target.id === 'newTitle' || e.target.id === 'newDesc')){ addItem(); }
});

document.getElementById('countdownBtn').addEventListener('click', () => toast('倒數計時已啟動'));
document.getElementById('refreshWeather').addEventListener('click', refreshWeather);

renderAll();
switchTab('overview');
