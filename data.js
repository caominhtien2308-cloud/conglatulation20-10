/**
 * ============================================================
 *  DATA.JS — Tệp cấu hình nội dung
 *  Chỉnh sửa file này để thay đổi toàn bộ nội dung website.
 *  KHÔNG cần chỉnh sửa các file khác.
 * ============================================================
 */

const LOVE_DATA = {

  // ——— THÔNG TIN CHUNG ———
  general: {
    senderName: "Anh",
    receiverName: "Em",
    occasion: "20/10",
    siteTitle: "A Gift Just For You — 20/10 ♡",
  },

  // ——— MÀN HÌNH MỞ ĐẦU ———
  intro: {
    mainText: "Anh có một món quà dành riêng cho em...",
    subText: "Em có muốn khám phá không? ♡",
    buttonText: "Mở món quà của anh",
  },

  // ——— NHỮNG CÂU CHỮ TÌNH YÊU NỀN ———
  loveQuotes: [
    "Em là điều tuyệt vời nhất mà anh có.",
    "Thank you for being in my life.",
    "Every little moment with you means a lot to me.",
    "Anh mong em luôn được vui vẻ và hạnh phúc.",
    "Happy Vietnamese Women's Day 20.10 ♡",
    "Cảm ơn em đã xuất hiện trong cuộc đời anh.",
    "Em xứng đáng với tất cả những điều tốt đẹp nhất.",
    "I love you more than words can say.",
    "Mỗi ngày bên em đều là một món quà.",
    "You are my favorite everything.",
  ],

  // ——— BÓ HOA ———
  bouquet: {
    title: "20/10 này, anh muốn dành cho em một điều thật đặc biệt.",
    subtitle: "Em xứng đáng với tất cả những điều dịu dàng nhất. ♡",
    buttonText: "Nhận hoa từ anh",
    giftMessage: "Bó hoa này là tất cả niềm yêu thương của anh gửi đến em. Chúc em ngày 20/10 thật hạnh phúc! ♡",
  },

  // ——— THƯ VIỆN ẢNH KỶ NIỆM ———
  // Để thêm ảnh: thêm object vào mảng photos[]
  // Đặt ảnh vào thư mục assets/photos/
  // Nếu chưa có ảnh thật, các vị trí mẫu sẽ được hiển thị tự động

  photos: [
    {
      src: "assets/photos/photo1.jfif",
      caption: "Thì ra là em àa ❤️",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo2.jpg",
      caption: "Cô công chúa bé nhỏ.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo3.jpg",
      caption: "Vẫn là cô công chúa bé nhỏ.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo4.jfif",
      caption: "Bé nhìn trưởng thành.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo5.jfif",
      caption: "Bé nhìn lạnh lùng.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo6.jfif",
      caption: "Em bé dễ huông.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo7.png",
      caption: "Kiếm anh hả bé.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo8.png",
      caption: "Trao vương miệng luôn.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo9.png",
      caption: "Nàng thơ của anhh.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo10.png",
      caption: "Em nhìn gì thía.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo11.png",
      caption: "Mợ hai đẹp quá ò.",
      date: "20/10/2026"
    },
    {
      src: "assets/photos/photo12.png",
      caption: "Xuất sắc luôn mợ ơi.",
      date: "20/10/2026"
    },
  ],



  // Số lượng ảnh mẫu nếu chưa có ảnh thật
  placeholderCount: 12,

  // ——— BỨC THƯ TÌNH ———
  loveLetter: {
    toLine: "To my favorite person ♡",
    title: "Gửi em, cô gái đặc biệt của anh.",
    paragraphs: [
      "Chúc em một ngày 20/10 thật vui vẻ và hạnh phúc.",
      "Anh mong em luôn giữ được nụ cười của mình, luôn được yêu thương và luôn có đủ can đảm để theo đuổi những điều em mong muốn.",
      "Cảm ơn em vì đã xuất hiện trong cuộc sống của anh và tạo nên những khoảnh khắc hài hước, vui vẻ, hồn nhiên. Những khoảng khắc mà anh luôn muốn trân trọng.",
      "Anh không biết tương lai sẽ mang đến những điều gì, nhưng anh hy vọng chúng ta sẽ còn cùng nhau tạo nên thật nhiều kỷ niệm đẹp.",
      "Mong rằng mỗi ngày của em đều có những điều dịu dàng, và nếu có một ngày em cảm thấy không vui, anh hy vọng mình có thể là người khiến em mỉm cười.",
      "Chúc cô bé của anh có một ngày 20/10 thật đặc biệt nhé!",
      "♡",
    ],
    fromLine: "From your favorite person.",
    dateSignature: "20.10 — A little gift, made with love.",
  },
};
