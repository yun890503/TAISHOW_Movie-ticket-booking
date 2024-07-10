# TAISHOW 訂票系統

TAISHOW 訂票系統是一個整合了多家影城的在線訂票平台，旨在提供最便捷的訂票體驗，讓用戶可以輕鬆選擇心儀的電影和座位。此系統包含電影資訊、快速訂票、評論區、會員系統、會員後台管理等功能，旨在提升用戶的觀影體驗。

## 使用技術

### 前端
- React
- Chakra
- JavaScript
- HTML
- CSS
- React Bootstrap
- Material-UI (MUI)

### 後端
- Spring Boot
- JWT
- Java

### 資料庫
- MySQL

### 雲端
- AWS

### 開發工具
- GitHub
- Git
- Figma
- Axure RP

### 編譯器
- IntelliJ IDEA
- Eclipse
- Visual Studio Code

### API串接
- FireBase
- Infobip
- Geolocation API
- 綠界金流
- Java Mail Sender

## 功能介紹

### 首先登入會員 (註冊帳密或是Google登入)
![Login](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/810e6be8-56b2-40c9-aa1f-ffc8b49fdaad)

### 會員資料界面
![Member Info](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/3f8dfd1e-b38a-4d48-bd6d-e38ea1c575bc)

### 接下來我們去訂票~

#### 首頁
![Homepage](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/35a77a9c-2835-4386-82bd-036a8e3a8157)

#### 在首頁的最下方有個現正熱映與即將上映的區塊，用戶可以馬上找到自己想看的電影直接前往訂票。
![Movies](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/2aca9620-f455-4dbd-83a7-cc05c28aea8c)

### 在訂票流程中如果您允許開啟定位，系統會自動幫你匹配最近的影城，並直達影城劃位功能。

#### 步驟一 (開啟定位)
![Enable Location](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/5ebd4f5b-a5c2-484c-b8c8-7d49c536f34c)

#### 步驟二 (選座位)
![Select Seat](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/13d51ece-2113-4418-95b2-aea60e5e9943)

#### 步驟三 (選票種)
![Select Ticket Type](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/69d11f8d-6731-4bf7-8c2c-fa30635c05c7)

#### 步驟四 (綠界支付)
![Payment](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/07850f3b-fd85-4dc6-9e20-78274fd3b664)
![Payment](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/d29de9f3-0ce5-4276-8ec3-0e9873d60503)
![Payment](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/a6e44382-8938-401c-85f3-c6be86a4c0b2)

### 交易成功後就可以看到訂單
![Order Confirmation](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/c0455b67-a305-4a69-8ccc-fc49c0ee4317)
![Order Confirmation](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/287441af-d271-4dcf-a9b2-919d23c41cbb)

### 也可以看到因下訂生成的紅利
![Bonus Points](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/e0628233-750d-483c-adf6-1f868736fe54)

### 那麼我既然看完電影後當然要評價一下這部電影啦~

#### 來到評論區選擇自己看過的電影
![Select Movie for Review](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/ae7a896c-4681-40cd-a14f-5b6b0dfc8336)

#### 我們可以看到這部電影在評論區的評價與平均星數
![Reviews](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/04690e7f-1131-4652-8f82-fe4c093ff6c4)
![Reviews](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/2632c987-bacc-49c1-9e47-470919a51b1c)

### 我們也可以發送、刪除、編輯、按讚、檢舉評論，同時在會員中心看到自己曾經發過的評論
![Manage Reviews](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/19d5ce06-6b6d-475e-9d57-16268eba5751)
![Manage Reviews](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/be1ee172-f21b-4113-8a7f-bda06752d192)

#### 當檢舉評論時會把這則評論發送到後台，後台人員會進行審核並決定是否刪除
![Review Report](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/af32dc0b-3f1c-4bc0-8faa-a886619559e4)
![Review Report](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/585f68be-55f1-46b7-9600-e80425296702)
![Review Report](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/3046ae0e-7d01-4135-8cb7-73449151329e)

### 同時後台還有上架電影與管理會員的功能

#### 新增電影
![Add Movie](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/b6e483db-e185-4a4c-b74f-dbb13546748d)
![Add Movie](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/6574b94e-72f1-4844-a9c3-08cc33d90ccf)
![Add Movie](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/24981518-3cae-455f-b385-674229a21bf0)

#### 管理會員
![Manage Members](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/b4828c92-22fe-4138-85bf-aee62148ea1c)

#### 管理紅利
![Manage Bonus Points](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/643f3ed5-75f5-4c3c-afd7-74645a63ebee)

#### 購票紀錄 (退款功能)
![Order History](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/8e103831-4d01-4391-aa2b-bac81e456e29)
![Order History](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/4c21a0e3-27cf-4e11-9f5b-a160f2cd5487)

#### 退票紀錄
![Refund History](https://github.com/yun890503/Taishow_Movie_Movie-ticket-bookinging/assets/131766930/de157ae1-87c6-4fa2-a3db-866002787b7b)

這就是我們網站的全部了，謝謝觀看!
