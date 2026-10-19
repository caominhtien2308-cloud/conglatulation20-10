# 🌸 A Gift Just For You — 20/10 Love Experience

Website quà tặng tình yêu nhân dịp Ngày Phụ nữ Việt Nam 20/10.

---

## 📁 Cấu trúc thư mục

```
conglaturation20.10/
├── index.html          ← Trang chính
├── style.css           ← Toàn bộ style & animation
├── main.js             ← Logic tương tác
├── data.js             ← ⭐ Chỉnh sửa file này để thay nội dung
└── assets/
    ├── images/
    │   ├── bouquet.jpg ← Ảnh bó hoa (đã có)
    │   └── particle_bg.jpg
    ├── photos/         ← 📷 Đặt ảnh kỷ niệm vào đây
    └── audio/          ← 🎵 (tuỳ chọn) Đặt nhạc nền vào đây
```

---

## 🖼️ Cách thêm ảnh kỷ niệm

1. Đặt ảnh vào thư mục `assets/photos/`
2. Mở file `data.js`
3. Tìm phần `photos: [...]`
4. Bỏ comment và thêm ảnh:

```js
photos: [
  {
    src: "assets/photos/anh1.jpg",
    caption: "Lần đầu mình gặp nhau.",
    date: "01/01/2024"
  },
  {
    src: "assets/photos/anh2.jpg",
    caption: "Khoảnh khắc đáng nhớ.",
    date: "14/02/2024"
  },
  // Thêm tiếp...
],
```

---

## ✏️ Cách thay đổi nội dung thư tình

Mở file `data.js` và tìm phần `loveLetter`:

```js
loveLetter: {
  toLine: "To my favorite person ♡",
  title: "Gửi em, cô gái đặc biệt của anh.",
  paragraphs: [
    "Đoạn văn thứ nhất...",
    "Đoạn văn thứ hai...",
    // ...
  ],
  fromLine: "From your favorite person.",
  dateSignature: "20.10 — A little gift, made with love.",
},
```

---

## 🎵 Thêm nhạc nền (tuỳ chọn)

Hiện tại website sử dụng nhạc ambient tự tạo bằng Web Audio API.
Nếu muốn dùng file nhạc riêng:

1. Đặt file `.mp3` vào `assets/audio/music.mp3`
2. Trong `main.js`, tìm hàm `createAmbientMusic()` và thêm:

```js
const audio = new Audio('assets/audio/music.mp3');
audio.loop = true;
State.audioElement = audio;
```

---

## 🚀 Triển khai lên GitHub Pages

1. Tạo repository mới trên GitHub
2. Upload toàn bộ nội dung thư mục này
3. Vào Settings → Pages → Source: main branch / root
4. Website sẽ có địa chỉ: `https://username.github.io/repo-name`

---

## 📱 Các tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🌌 Màn hình intro | Typing animation + nút mở quà |
| ✨ Vũ trụ ảnh | Ảnh trôi nổi 3D, vuốt để khám phá |
| 💬 Câu chữ tình yêu | Fade in/out tự động |
| 🌸 Bó hoa | Cảnh bó hoa + animation cánh hoa rơi |
| 🔮 Quả cầu kỷ niệm | Ảnh bố trí hình cầu, xoay được |
| 📷 Thư viện ảnh | Gallery dạng lưới |
| 💌 Thư tình | Thư xuất hiện từng đoạn |
| 🎵 Nhạc nền | Ambient music, bật/tắt tự do |
| 🎆 Hiệu ứng hạt | Particle system canvas |

---

Made with ♡
