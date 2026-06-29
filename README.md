# Da Nang Apartment Hub

Website căn hộ full-stack dùng React, Node.js, MongoDB, Ant Design, Google Map và chatbot AI.

## Link demo

Frontend demo trên GitHub Pages:

```text
https://my1410.github.io/Apartment_NgocVu/
```

Lưu ý: GitHub Pages chỉ host frontend tĩnh. Nếu chưa deploy backend/API online, app vẫn cho test giao diện, danh mục, bộ lọc, trang chi tiết và map fallback bằng dữ liệu mẫu phía client.

## Deploy demo đầy đủ

Frontend đã có workflow GitHub Pages tại `.github/workflows/deploy-pages.yml`. Backend có sẵn blueprint `render.yaml` để deploy nhanh lên Render.

1. Tạo database MongoDB Atlas và lấy connection string.
2. Vào Render, chọn **New Blueprint**, kết nối repo `Apartment_NgocVu`, Render sẽ đọc `render.yaml`.
3. Điền các biến bắt buộc cho service backend:

```text
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...           # không bắt buộc, thiếu key sẽ dùng AI fallback
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
```

4. Sau khi Render deploy xong, lấy backend URL, ví dụ:

```text
https://apartment-ngocvu-api.onrender.com
```

5. Seed dữ liệu demo trên Render Shell hoặc local terminal có `MONGODB_URI` Atlas:

```bash
npm run seed --workspace server
```

Lệnh này tạo lại căn hộ mẫu và tài khoản admin:

```text
admin@example.com
Admin@123456
```

6. Vào GitHub repo > Settings > Secrets and variables > Actions, thêm secret:

```text
VITE_API_URL=https://apartment-ngocvu-api.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your-google-map-key
```

7. Chạy lại GitHub Actions **Deploy GitHub Pages**. Khi đó link GitHub Pages sẽ gọi backend thật, đăng nhập admin và quản lý dữ liệu MongoDB online.

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

## Chạy bằng Docker

Yêu cầu có Docker Desktop hoặc Docker Engine + Compose.

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

Sau khi container chạy:

```text
Frontend: http://localhost:8080
API:      http://localhost:4000
MongoDB:  mongodb://localhost:27017/apartment_platform
```

Seed dữ liệu mẫu và tài khoản admin:

```bash
docker compose --env-file .env.docker run --rm server npm run seed --workspace server
```

Tài khoản admin mẫu:

```text
admin@example.com
Admin@123456
```

Nếu muốn bật Google Map hoặc OpenAI thật, sửa `.env.docker`:

```text
VITE_GOOGLE_MAPS_API_KEY=your-google-map-key
OPENAI_API_KEY=sk-...
```

Sau đó build lại:

```bash
docker compose --env-file .env.docker up --build
```

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
