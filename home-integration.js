(() => {
  const overview = document.getElementById('overview');
  const itineraryPage = document.getElementById('itinerary');
  const itineraryCard = itineraryPage?.querySelector('.card');
  const dateButtons = document.getElementById('dayButtons');
  const itineraryBox = document.getElementById('itineraryBox');
  if (!overview || !itineraryCard || !dateButtons || !itineraryBox) return;

  // Reuse the existing itinerary renderer and state, but place its live content on Home.
  const dailyPlan = document.createElement('section');
  dailyPlan.className = 'home-daily-plan';
  dailyPlan.setAttribute('aria-label', '每日行程');
  dateButtons.hidden = true;
  dailyPlan.append(dateButtons, itineraryBox);

  const oldPreview = overview.querySelector('.home-itinerary');
  oldPreview?.remove();
  const todayCard = overview.querySelector('.today-card');
  if (todayCard) todayCard.after(dailyPlan);
  else overview.appendChild(dailyPlan);

  // The date ribbon is now the sole day selector; remove the separate itinerary page/tab.
  itineraryPage.remove();
  document.querySelectorAll('[data-tab="itinerary"]').forEach((button) => button.remove());

  // Existing date buttons already call switchTab('itinerary'); route that action to Home.
  const switchTabOriginal = switchTab;
  switchTab = function (tab) {
    return switchTabOriginal(tab === 'itinerary' ? 'overview' : tab);
  };

  // Keep the full itinerary readable below the date selector and make weather compact.
  const style = document.createElement('style');
  style.textContent = `
    #overview.page.active { display: flex; flex-direction: column; gap: 16px; }
    .home-daily-plan { min-width: 0; }
    .home-daily-plan #dayButtons[hidden] { display: none !important; }
    .home-daily-plan #itineraryBox { display: grid; gap: 12px; }
    .home-daily-plan #itineraryBox > .soft-card:first-child { margin: 0; }
    .home-daily-plan #itineraryBox > .soft-card:last-child { margin: 0; }
    #weatherBox.weather-week-root .weather-week-grid {
      display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 10px;
      scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    }
    #weatherBox .weather-day-card {
      box-sizing: border-box; flex: 0 0 112px; min-height: 0; padding: 10px 9px;
      border-radius: 16px; scroll-snap-align: start;
    }
    #weatherBox .weather-day-head { align-items: flex-start; gap: 4px; }
    #weatherBox .weather-day-date { font-size: 11px; line-height: 1.35; }
    #weatherBox .weather-day-icon { font-size: 19px; }
    #weatherBox .weather-day-condition { margin: 5px 0; font-size: 11px; }
    #weatherBox .weather-day-range { gap: 6px; font-size: 12px; }
    #weatherBox .weather-day-high { font-size: 15px; }
    #weatherBox .weather-day-rain { margin-top: 5px; font-size: 10px; white-space: nowrap; }
    #weatherBox .weather-week-note { margin: 8px 0 4px; font-size: 11px; line-height: 1.5; }
    #weatherBox .weather-week-toolbar { padding: 8px 10px; }
    @media (max-width: 680px) {
      #overview.page.active { gap: 12px; }
      #weatherBox .weather-day-card { flex-basis: 104px; }
    }
  `;
  document.head.appendChild(style);
})();
