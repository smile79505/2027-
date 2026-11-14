# 名古屋繪本之旅 7 日遊

一個結合「旅行手帳風格」與「繪本氛圍」的單頁旅遊規劃 App，旨在幫助你整理：
- 名古屋與飛驒高山 7 日旅遊
- 吉卜力公園兩日深度路線
- 航班與飯店資訊
- 行前清單
- 安全急難資訊
- 記帳與分帳
- 天氣與旅遊概要

## 功能特色
- 旅遊首頁與逐日行程
- 手動新增當日行程
- 吉卜力公園互動型 SVG 路線圖
- 可播放/暫停/跳站的路線導覽
- 天氣預報卡片
- 航班與飯店資訊
- 行前清單與完成度
- 安全急難與日語語音卡
- 記帳分帳與匯率換算
- 本機 localStorage 持久化
- 手機版底部導航

## 技術
- HTML
- CSS
- JavaScript
- GitHub Pages

## 檔案結構
```text
project/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
```

## 本地預覽
直接打開 `index.html` 即可預覽。

或使用 Python 啟動本地靜態伺服器：

```bash
python -m http.server 8000
```

然後在瀏覽器打開：

```text
http://localhost:8000
```

## GitHub Pages 部署
1. 將檔案 push 到 GitHub repo
2. 進入 repo 的 `Settings`
3. 選 `Pages`
4. 在 Source 選擇：
   - `Deploy from a branch`
5. Branch 選：
   - `main`
6. Folder 選：
   - `/root`
7. Save
8. 等待部署完成，訪問公開 URL

公開網址格式大致如下：

```text
https://smile79505.github.io/2027-/
```

## 注意
- 本專案為純前端靜態頁面
- 資料存在瀏覽器 localStorage
- 交通、天氣、營業資訊為規劃示意，實際請以官方資訊為準

## 使用建議
這個網站很適合：
- 旅遊規劃展示
- 個人作品集
- GitHub Pages 靜態頁面
- 行程管理 App
