# 資安研究室｜資安產業研究入門百科

面向具備基本投資知識、但不熟悉資安的人，以「企業問題 → 產品 → 公司 → 財報」建立研究框架。

- 網頁：https://howardchiang0129.github.io/cybersecurity-research-wiki/
- GitHub：https://github.com/howardchiang0129/cybersecurity-research-wiki
- AI 協作規則：[AGENTS.md](AGENTS.md)

## 網站內容

第一版共七頁：產業總覽、端點安全、身分安全、CrowdStrike、Okta、Palo Alto Networks、財報指標。三家公司各有四季資料、季度切換、營收軌跡、官方財測與原始來源連結。附全站主題搜尋與 FCF Margin 互動練習。

## 資料範圍與限制

核對日為 2026-11-16。CRWD、OKTA 最新為 FY2027 Q2；PANW 最新為 FY2026 Q4，各截止於 2026-07-31。數據來自官方財報新聞稿與正式申報；部分延伸欄位仍待核對，JSON 以 null 記錄，網頁標示「待核對」。不將缺值當作 0，不把財測當作實績。

歷史 CRWD EPS 與股數採各期原始公告口徑，明確標記一拆四前後，不直接比較。營收 YoY 採官方四捨五入成長率。營業利益率及 FCF Margin 部分由公開金額計算。來源數據採百萬美元，EPS 採美元／股，股數採百萬股。PANW 普通 FCF 與 Adjusted FCF 分開理解。

## 技術與本機預覽

純 HTML／CSS／JavaScript，無第三方套件、無 API 金鑰、無後端。Python 3.9 以上僅用於重新產生 HTML 與檢查。

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 -m http.server 8000
```

瀏覽 http://localhost:8000 。也可直接開啟 index.html；公司頁資料已內嵌，不依賴 fetch，因此季度切換不需後端。

## 新增內容的方式

### 新增公司

1. 先閱讀 AGENTS.md。
2. 依照 data/companies/okta.json 的結構新增 data/companies/{ticker}.json，填入官方來源與至少四個已公布季度。
3. 在 scripts/build.py 的 companies 字典加入公司介紹，NAV 加入導覽，並更新首頁公司清單與適合的領域連結。
4. 在 assets/js/app.js 的 pages 陣列加入搜尋項目。
5. 執行 build.py 與 check.py，檢查手機、季度切換、來源連結，更新 CHANGELOG.md。

範例指令：「請先閱讀 AGENTS.md，依既有模板新增一家資安公司，從官方來源整理最近四季，不猜測缺值，並更新首頁、導覽與搜尋。」

### 新增領域

在 scripts/build.py 的 sector_data 中新增領域資料，依現有固定段落補齊內容，更新 NAV、首頁、搜尋及公司交叉連結，再重新建置。不要只修改產生後的 HTML，否則下次 build.py 會覆蓋。

### 每季財務更新

1. 檢查三家官方 IR 是否公布新季度。
2. 在對應 JSON 的 quarters 末尾追加季度，保留舊資料；填妥截止日、公告日、來源、核對日期與狀態。
3. 在 guidance 更新當期財測，並修改 scripts/build.py 的最新一季解讀；首頁資料狀態及核對日期同步更新。
4. 檢查單季／累計、GAAP／non-GAAP、拆股與併購口徑；原始數值更正需留下紀錄。
5. 執行建置與檢查後提交 GitHub，Pages 會發布新的靜態內容。

AGENTS.md 是執行規則，並不是自動執行器。網站沒有設定每季自動抓取或自動發布。
