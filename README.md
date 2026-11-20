

HKDN — Hệ thống xác thực chứng chỉ và học liệu số
Đồ án: Xây dựng hệ thống xác thực chứng chỉ và học liệu số ứng dụng chữ ký số và Blockchain.

Trạng thái hiện tại: Đã khởi tạo Spring Boot Backend, React Frontend và PostgreSQL. API GET /api/health đã chạy thành công và Frontend đã hiển thị Backend Status: UP. Chức năng nghiệp vụ, chữ ký số và Blockchain chưa hoàn thiện.

1. Công nghệ
Thành phần	Công nghệ / phiên bản đã thử nghiệm trên máy khởi tạo
Backend	Java 21 (Temurin 21.0.8), Spring Boot, Maven 3.9.11
Frontend	React, Vite, TypeScript, Tailwind CSS, Axios, React Router
Database	PostgreSQL 18.7, database hkdn
API	http://localhost:8080
Frontend	http://localhost:5173
Blockchain	Dự kiến Solidity + Hardhat, phụ trách: Long; chưa cần để chạy bản hiện tại
Lưu ý: Phiên bản PostgreSQL 18.7 và cổng 5433 là cấu hình trên máy khởi tạo. Mỗi thành viên có thể dùng PostgreSQL 17/18 và cổng phù hợp, miễn là cấu hình kết nối đúng. Maven Wrapper (mvnw.cmd) giúp không bắt buộc phải cài Maven toàn cục.

2. Yêu cầu trước khi clone
Cài các công cụ:

Git
JDK 21
Node.js LTS (chọn phiên bản tương thích với Vite và package.json hiện tại)
PostgreSQL Windows — cài PostgreSQL Server, Command Line Tools và khuyến nghị pgAdmin 4. Không cần Stack Builder.
VS Code
Extension VS Code khuyến nghị: Extension Pack for Java, Spring Boot Extension Pack, ESLint, Prettier, Tailwind CSS IntelliSense, REST Client.

Mở PowerShell kiểm tra:

java -version
node -v
npm -v
git --version
Nếu cài Maven toàn cục thì kiểm tra thêm mvn -version. Kiểm tra PostgreSQL bằng psql --version; nếu không nhận lệnh, sử dụng đường dẫn đầy đủ đến psql.exe hoặc thêm thư mục bin của PostgreSQL vào PATH.

3. Clone dự án
Mở PowerShell tại thư mục muốn lưu code:

git clone <URL_REPOSITORY_GITHUB>
cd <TEN_THU_MUC_REPO>
Thay các giá trị trong dấu <...> bằng URL và tên thư mục thực tế của repository nhóm. Không cần chạy lại Spring Initializr hoặc npm create vite: source code đã có sẵn trong repo.

Cấu trúc dự kiến:

do_an_HKDN/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── blockchain/          # Long bổ sung sau
├── docs/
└── scripts/
4. Thiết lập PostgreSQL trên máy từng thành viên
4.1. Xác định cổng và đăng nhập
Khi cài PostgreSQL, đặt mật khẩu mạnh cho tài khoản postgres và ghi nhớ. Cổng mặc định thường là 5432; máy khởi tạo dự án sử dụng 5433 vì có nhiều phiên bản PostgreSQL. Không bắt buộc mọi người phải dùng cổng 5433.

Nếu psql đã nằm trong PATH:

psql -U postgres -h 127.0.0.1 -p 5432
Thay 5432 bằng cổng PostgreSQL trên máy của bạn. Nếu psql chưa nằm trong PATH, với PostgreSQL 18 cài tại đường dẫn mặc định:

& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -p 5432
Nhập mật khẩu đã đặt khi cài (Terminal không hiển thị ký tự khi nhập).

4.2. Tạo database
Tại dấu nhắc postgres=#, chạy:

CREATE DATABASE hkdn;
Nếu database đã tồn tại, không tạo lại và không xóa dữ liệu. Kiểm tra và kết nối:

\l
\c hkdn
Kết quả mong đợi là dấu nhắc hkdn=#. Thoát bằng \q.

Không cần import dữ liệu ở thời điểm hiện tại. Dự án đang ở giai đoạn khởi tạo; khi nhóm có migration/schema hoặc seed data sẽ cập nhật README.

5. Cấu hình Backend
File backend/src/main/resources/application.properties cần có cấu hình tương đương:

spring.application.name=hkdn
spring.datasource.url=${DB_URL:jdbc:postgresql://127.0.0.1:5433/hkdn}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=none
Quan trọng: Trên máy khởi tạo đã dùng URL cứng jdbc:postgresql://127.0.0.1:5433/hkdn. Để mỗi thành viên dùng cổng riêng, người quản lý repo cần cập nhật dòng spring.datasource.url theo mẫu ${DB_URL:...} ở trên và commit thay đổi này. Nếu chưa cập nhật, thành viên phải chỉnh URL trong file local cho đúng cổng (không commit thay đổi mang tính cá nhân).

Không ghi mật khẩu thật vào application.properties hoặc commit file chứa mật khẩu.

Mở Terminal PowerShell số 1 tại thư mục repo:

cd backend
$env:DB_URL = "jdbc:postgresql://127.0.0.1:5432/hkdn"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = Read-Host "Nhap mat khau PostgreSQL"
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
Thay 5432 bằng cổng máy bạn. Nếu cấu hình URL trong file vẫn đang cố định là 5433, biến DB_URL chỉ có hiệu lực sau khi đã cập nhật application.properties như trên.

Chờ log có dòng tương tự:

Tomcat started on port 8080 (http)
Started BackendApplication
Kiểm tra: http://localhost:8080/api/health

Kết quả dự kiến:

{"application":"HKDN Backend","status":"UP"}
Giữ Terminal này chạy. Nếu BUILD SUCCESS nhưng ứng dụng không chạy, xem lỗi phía trên trong Terminal (thường là sai cấu hình database hoặc trùng cổng).

6. Chạy Frontend
Mở Terminal PowerShell số 2 tại thư mục repo:

cd frontend
npm install
npm run dev
Nếu vừa mở Terminal từ backend/, quay về repo bằng cd .. trước khi vào frontend.

Truy cập http://localhost:5173. Giao diện kiểm tra hiện tại sẽ hiển thị:

HKDN - Certificate Verification System
Backend Status: UP
Nếu chỉ hiện Không kết nối được Backend, kiểm tra Backend ở cổng 8080 có đang chạy không.

Cấu hình Vite Proxy
File frontend/vite.config.ts cần có proxy:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
Frontend gọi /api/health qua Axios (baseURL: '/api'). Vite chuyển tiếp request sang Spring Boot tại localhost:8080 khi chạy development.

7. Kiểm tra hoàn tất
java -version cho thấy Java 21.
node -v và npm -v chạy được.
PostgreSQL Server đang chạy và đăng nhập được.
Database hkdn tồn tại.
backend: Maven build thành công và ứng dụng chạy ở cổng 8080.
http://localhost:8080/api/health trả về status: UP.
frontend: Vite chạy ở cổng 5173.
Trang frontend hiển thị Backend Status: UP.
8. Lỗi thường gặp
Lỗi	Cách kiểm tra / xử lý
psql is not recognized	Thêm C:\Program Files\PostgreSQL\18\bin vào PATH hoặc gọi psql.exe bằng đường dẫn đầy đủ.
password authentication failed	Kiểm tra mật khẩu, cổng, phiên bản PostgreSQL. Nếu cần reset mật khẩu, nhờ thành viên quản trị máy hỗ trợ; không để cấu hình trust tồn tại.
Connection refused tới PostgreSQL	Kiểm tra dịch vụ PostgreSQL đã chạy, host và cổng đúng.
database "hkdn" does not exist	Đăng nhập psql và chạy CREATE DATABASE hkdn;.
DB_PASSWORD chưa thiết lập	Thiết lập biến môi trường trong cùng Terminal trước khi chạy Spring Boot.
Port 8080 was already in use	Dừng tiến trình cũ hoặc đổi port Backend và cập nhật Vite Proxy tương ứng.
Port 5173 was already in use	Dừng Vite cũ; nếu Vite tự đổi port, dùng URL được in trong Terminal.
Backend Status: Không kết nối được Backend	Mở /api/health trực tiếp, kiểm tra Vite Proxy, khởi động lại Vite sau khi sửa config.
npm không nhận diện	Cài Node.js LTS và mở lại VS Code.
Maven tải dependency thất bại	Kiểm tra Internet, proxy và thử chạy lại Maven Wrapper.
9. Quy tắc làm việc nhóm
Mỗi thành viên clone repo, cấu hình database trên máy riêng.
Không commit mật khẩu, .env, private key, JWT secret, node_modules/, backend/target/.
Nên tạo branch riêng theo chức năng và mở Pull Request trước khi merge.
Không chạy lại lệnh khởi tạo Vite/Spring Initializr trong repo đã clone.
Khi thay đổi cổng Backend, cập nhật cấu hình Frontend Proxy tương ứng.
Blockchain chưa bắt buộc cho bản chạy thử hiện tại. Long sẽ cập nhật cách cài Hardhat, compile, test và thông số tích hợp sau.
10. Các lệnh chạy hằng ngày
Terminal 1 — Backend (tại thư mục repo):

cd backend
$env:DB_URL = "jdbc:postgresql://127.0.0.1:5432/hkdn"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = Read-Host "Nhap mat khau PostgreSQL"
.\mvnw.cmd spring-boot:run
Terminal 2 — Frontend (tại thư mục repo):

cd frontend
npm run dev
Truy cập: http://localhost:5173.

Dành cho người quản lý repository trước khi chia sẻ: Kiểm tra đã commit backend/pom.xml, backend/mvnw.cmd, thư mục .mvn/wrapper, backend/src, frontend/package.json, frontend/package-lock.json, frontend/src, frontend/vite.config.ts; kiểm tra .gitignore loại bỏ file nhạy cảm và thư mục build. Đặc biệt hãy cập nhật spring.datasource.url để nhận DB_URL như Mục 5, rồi tự clone vào một thư mục mới để thử quy trình.
