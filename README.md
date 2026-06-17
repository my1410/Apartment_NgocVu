# Da Nang Apartment Hub

Website căn hộ full-stack dùng React, Node.js, MongoDB, Ant Design, Google Map và chatbot AI.

## Link demo

Frontend demo trên GitHub Pages:

```text
https://my1410.github.io/Apartment_NgocVu/
```

Lưu ý: GitHub Pages chỉ host frontend tĩnh. Nếu chưa deploy backend/API online, app vẫn cho test giao diện, danh mục, bộ lọc, trang chi tiết và map fallback bằng dữ liệu mẫu phía client.

## Tính năng đã dựng

- Giao diện full màn hình, tone hiện đại, responsive mobile.
- Component tách nhỏ, mỗi component có `styles.js` riêng.
- Bộ lọc theo quận, phường, trạng thái, giá, số phòng ngủ và diện tích.
- Danh sách căn hộ + trang chi tiết + bản đồ hiển thị vị trí.
- Google Map thật khi có `VITE_GOOGLE_MAPS_API_KEY`, fallback map preview khi chưa có key.
- Chatbot AI nổi góc màn hình, gọi backend `/api/chat`.
- Backend Express + MongoDB/Mongoose, có fallback dữ liệu mẫu khi MongoDB chưa bật.
- Auth qua JWT trong signed HTTP-only cookie.
- Bảo mật cơ bản: `helmet`, `cors` credentials, rate limit, mongo sanitize, `hpp`, bcrypt, AES-256-GCM cho dữ liệu nhạy cảm.
- Seed dữ liệu mẫu căn hộ Đà Nẵng và tài khoản admin.

## Cấu trúc

```text
client/
  src/components/        Component tái sử dụng + styles.js riêng
  src/pages/             Trang Home, Detail, Login
  src/services/          API client
  src/data/              Dữ liệu fallback phía frontend
server/
  src/controllers/       Logic API
  src/models/            Mongoose schemas
  src/routes/            Routes
  src/middleware/        Auth/error/security helpers
  src/data/              Seed + fallback data
```

## Chạy local

```bash
npm install
cp client/.env.example client/.env
cp server/.env.example server/.env
npm run dev
```

Frontend chạy ở `http://localhost:5173`, API chạy ở `http://localhost:4000`.

## Seed MongoDB

Bật MongoDB local trước, rồi chạy:

```bash
npm run seed --workspace server
```

Tài khoản admin mẫu:

```text
admin@example.com
Admin@123456
```

## Google Map và AI

- Thêm `VITE_GOOGLE_MAPS_API_KEY` vào `client/.env` để bật bản đồ thật.
- Thêm `OPENAI_API_KEY` vào `server/.env` để chatbot gọi AI thật.
- Nếu chưa có key, app vẫn chạy bằng fallback local để phát triển UI và filter.

## Gợi ý phát triển tiếp

- Dashboard đăng tin cho môi giới/chủ nhà.
- Upload ảnh qua Cloudinary/S3.
- Lưu yêu thích, lịch xem nhà, lead CRM.
- Index geospatial MongoDB để tìm căn hộ quanh vị trí hiện tại.
- Realtime chat giữa khách và tư vấn viên.
