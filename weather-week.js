'use strict';

(() => {
  const CACHE_KEY = 'travel-planner-weather-week-v2';
  const LOCATION_KEY = 'travel-planner-weather-location-v1';
  const MAX_AGE_MS = 24 * 60 * 60 * 1000;
  const CHECK_INTERVAL_MS = 60 * 60 * 1000;
  const LOCATIONS = {
    nagoya: { name: '名古屋', latitude: 35.1815, longitude: 136.9066 },
    takayama: { name: '飛驒高山', latitude: 36.1461, longitude: 137.2522 }
  };
  const WEATHER = {
    0: ['☀️', '晴朗'], 1: ['🌤️', '大致晴朗'], 2: ['⛅', '局部多雲'], 3: ['☁️', '陰天'],
    45: ['🌫️', '有霧'], 48: ['🌫️', '霧凇'], 51: ['🌦️', '毛毛雨'], 53: ['🌦️', '毛毛雨'],
    55: ['🌧️', '較強毛毛雨'], 56: ['🌧️', '凍毛毛雨'], 57: ['🌧️', '較強凍毛毛雨'],
    61: ['🌧️', '小雨'], 63: ['🌧️', '中雨'], 65: ['🌧️', '大雨'], 66: ['🌧️', '凍雨'],
    67: ['🌧️', '強凍雨'], 71: ['🌨️', '小雪'], 73: ['🌨️', '中雪'], 75: ['❄️', '大雪'],
    77: ['🌨️', '雪粒'], 80: ['🌦️', '陣雨'], 81: ['🌧️', '中度陣雨'], 82: ['🌧️', '強陣雨'],
    85: ['🌨️', '陣雪'], 86: ['❄️', '強陣雪'], 95: ['⛈️', '雷雨'], 96: ['⛈️', '雷雨並有冰雹可能'],
    99: ['⛈️', '強雷雨並有冰雹可能']
  };

  const weatherBox = document.getElementById('weatherBox');
  const refreshButton = document.getElementById('refreshWeather');
  if (!weatherBox || !refreshButton) return;

  let selectedCity = readSelectedCity();
  let requestSequence = 0;
  let lastAutoCheck = 0;

  function readSelectedCity() {
    try {
      const city = localStorage.getItem(LOCATION_KEY);
      if (LOCATIONS[city]) return city;
    } catch (_) {}
    return 'nagoya';
  }

  function cacheKey(city) { return `${CACHE_KEY}-${city}`; }

  function readCache(city) {
    try {
      const cache = JSON.parse(localStorage.getItem(cacheKey(city)) || 'null');
      if (cache && Number.isFinite(cache.savedAt) && cache.data && Array.isArray(cache.data.days)) return cache;
    } catch (_) {}
    return null;
  }

  function saveCache(city, data) {
    try { localStorage.setItem(cacheKey(city), JSON.stringify({ savedAt: Date.now(), data })); } catch (_) {}
  }

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    return new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'UTC', month: 'numeric', day: 'numeric', weekday: 'short'
    }).format(date);
  }

  function status(message, error = false) {
    const element = document.getElementById('weatherWeekStatus');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', error);
  }

  function buildUI() {
    weatherBox.classList.remove('weather-grid');
    weatherBox.classList.add('weather-week-root');
    weatherBox.replaceChildren();

    const toolbar = create('div', 'weather-week-toolbar');
    const label = create('label', 'weather-week-label', '選擇城市');
    label.htmlFor = 'weatherCitySelect';
    const select = create('select', 'input weather-city-select');
    select.id = 'weatherCitySelect';
    select.setAttribute('aria-label', '選擇天氣預報城市');
    Object.entries(LOCATIONS).forEach(([id, location]) => {
      const option = create('option', '', location.name);
      option.value = id;
      select.appendChild(option);
    });
    select.value = selectedCity;

    const info = create('p', 'weather-week-status');
    info.id = 'weatherWeekStatus';
    info.setAttribute('role', 'status');
    info.setAttribute('aria-live', 'polite');
    const grid = create('div', 'weather-week-grid');
    grid.id = 'weatherWeekCards';
    const note = create('p', 'weather-week-note', '預報會在每日首次開啟頁面時更新；頁面保持開啟時每小時檢查一次。預報僅涵蓋近期，無法提前預測 2027 年 1 月的天氣。');
    const source = document.createElement('a');
    source.className = 'weather-week-source';
    source.href = 'https://open-meteo.com/';
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = '天氣資料來源：Open-Meteo';

    toolbar.append(label, select);
    weatherBox.append(toolbar, info, grid, note, source);

    select.addEventListener('change', () => {
      selectedCity = LOCATIONS[select.value] ? select.value : 'nagoya';
      try { localStorage.setItem(LOCATION_KEY, selectedCity); } catch (_) {}
      loadForecast(false);
    });
  }

  function renderForecast(data, city, savedAt) {
    const grid = document.getElementById('weatherWeekCards');
    if (!grid) return;
    grid.replaceChildren();

    data.days.forEach((day, index) => {
      const [icon, description] = WEATHER[Number(day.code)] || ['🌡️', '天氣狀況'];
      const card = create('article', 'weather-day-card');
      const head = create('div', 'weather-day-head');
      head.append(create('strong', 'weather-day-date', `${index === 0 ? '今天 · ' : ''}${formatDate(day.date)}`));
      head.append(create('span', 'weather-day-icon', icon));
      const condition = create('div', 'weather-day-condition', description);
      const temperatures = create('div', 'weather-day-range');
      temperatures.append(create('strong', 'weather-day-high', `${Math.round(day.high)}°`));
      temperatures.append(create('span', 'weather-day-low', `${Math.round(day.low)}°`));
      const rain = day.rain == null ? '降雨機率 —' : `降雨機率 ${Math.round(day.rain)}%`;
      card.append(head, condition, temperatures, create('div', 'weather-day-rain', `💧 ${rain}`));
      grid.appendChild(card);
    });

    const updated = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit'
    }).format(new Date(savedAt));
    status(`${LOCATIONS[city].name}・未來 7 天預報　｜　日本時間 ${updated} 更新`, false);
  }

  async function fetchForecast(city) {
    const location = LOCATIONS[city];
    const query = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: '7',
      timezone: 'Asia/Tokyo'
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Forecast request failed (${response.status})`);
    const result = await response.json();
    const daily = result.daily;
    if (!daily || !Array.isArray(daily.time)) throw new Error('Forecast data is missing');

    return {
      days: daily.time.map((date, index) => ({
        date,
        code: daily.weather_code?.[index] ?? -1,
        high: daily.temperature_2m_max?.[index] ?? null,
        low: daily.temperature_2m_min?.[index] ?? null,
        rain: daily.precipitation_probability_max?.[index] ?? null
      }))
    };
  }

  async function loadForecast(force = false) {
    const city = selectedCity;
    const sequence = ++requestSequence;
    const cached = readCache(city);
    const currentTime = Date.now();

    if (cached) renderForecast(cached.data, city, cached.savedAt);
    if (!force && cached && currentTime - cached.savedAt < MAX_AGE_MS) return;

    if (!cached) status(`${LOCATIONS[city].name}天氣資料載入中…`);
    try {
      const data = await fetchForecast(city);
      if (sequence !== requestSequence || city !== selectedCity) return;
      saveCache(city, data);
      renderForecast(data, city, Date.now());
    } catch (error) {
      if (sequence !== requestSequence) return;
      console.error('Weather forecast update failed:', error);
      if (cached) {
        status(`${LOCATIONS[city].name}・目前顯示上次快取；更新失敗，請檢查網路後重試。`, true);
      } else {
        status('無法載入天氣預報，請檢查網路連線後按「更新」重試。', true);
      }
    }
  }

  refreshButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    loadForecast(true);
  }, true);

  buildUI();
  loadForecast(false);

  setInterval(() => {
    if (Date.now() - lastAutoCheck >= CHECK_INTERVAL_MS) {
      lastAutoCheck = Date.now();
      loadForecast(false);
    }
  }, CHECK_INTERVAL_MS);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastAutoCheck >= CHECK_INTERVAL_MS) {
      lastAutoCheck = Date.now();
      loadForecast(false);
    }
  });

  // Keep the decorative home date strip, current-day summary, and editable itinerary
  // driven by the same persisted itinerary dates instead of separate hard-coded dates.
  function syncItineraryDateRibbon() {
    if (typeof state === 'undefined' || typeof currentDay === 'undefined') return;
    const itinerary = state.itin || {};
    const dayEntries = Object.entries(itinerary);
    const ribbon = document.querySelector('.journey-days');
    const caption = document.querySelector('.journey-progress-caption');
    const progress = document.querySelector('.progress-track i');
    const todayTitle = document.querySelector('.today-copy h2');
    const todayDescription = document.querySelector('.today-copy p');
    const homeSchedule = document.querySelector('.home-itinerary');
    if (!ribbon || !dayEntries.length) return;

    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    ribbon.replaceChildren();
    dayEntries.forEach(([key, day], index) => {
      const match = String(day.date || '').match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      const fallbackDate = new Date(2027, 0, 20 + index);
      const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12) : fallbackDate;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `journey-day${Number(key) === Number(currentDay) ? ' active' : ''}`;
      button.dataset.gotoDay = key;
      const weekday = document.createElement('span');
      weekday.append(document.createTextNode(weekdays[date.getDay()]));
      const dayMark = document.createElement('sup');
      dayMark.textContent = `D${index + 1}`;
      weekday.appendChild(dayMark);
      const number = document.createElement('strong');
      number.textContent = String(date.getDate());
      const month = document.createElement('small');
      month.textContent = `${String(date.getMonth() + 1).padStart(2, '0')}月`;
      button.append(weekday, number, month);
      ribbon.appendChild(button);
    });

    const selectedIndex = Math.max(0, dayEntries.findIndex(([key]) => Number(key) === Number(currentDay)));
    const [selectedKey, selectedDay] = dayEntries[selectedIndex];
    if (caption) caption.textContent = `Day ${selectedIndex + 1} / ${dayEntries.length}`;
    if (progress) progress.style.width = `${((selectedIndex + 1) / dayEntries.length) * 100}%`;
    if (todayTitle) {
      const match = String(selectedDay.date || '').match(/\d{4}\/(\d{1,2})\/(\d{1,2})/);
      todayTitle.textContent = match ? `Day ${selectedIndex + 1}　${Number(match[1])}月${Number(match[2])}日` : `Day ${selectedIndex + 1}`;
    }
    if (todayDescription) todayDescription.textContent = selectedDay.title || '';

    if (homeSchedule) {
      const sectionHead = homeSchedule.querySelector('.section-head');
      homeSchedule.replaceChildren();
      if (sectionHead) homeSchedule.appendChild(sectionHead);
      const title = homeSchedule.querySelector('.home-section-title h2');
      if (title) title.textContent = '今日行程';
      const viewAll = homeSchedule.querySelector('.text-link');
      if (viewAll) viewAll.dataset.gotoDay = selectedKey;
      (selectedDay.items || []).forEach((item) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'home-stop';
        row.dataset.gotoDay = selectedKey;
        const time = document.createElement('time');
        time.textContent = item.time || '—';
        const details = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = item.title || '未命名行程';
        const note = document.createElement('small');
        note.textContent = item.desc || item.q || '';
        details.append(name, note);
        const arrow = document.createElement('b');
        arrow.textContent = '›';
        row.append(time, details, arrow);
        homeSchedule.appendChild(row);
      });
    }

    const activeButton = ribbon.querySelector('.journey-day.active');
    activeButton?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  document.addEventListener('click', () => window.setTimeout(syncItineraryDateRibbon, 0));
  syncItineraryDateRibbon();
})();
