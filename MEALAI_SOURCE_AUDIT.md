# BÁO CÁO AUDIT SOURCE CODE DỰ ÁN MEALAI

Phạm vi audit: source code hiện có trong `frontend/`, `backend/`, cấu hình deploy `render.yaml`.

Nguyên tắc: chỉ ghi nhận những gì tồn tại trong source code, không suy đoán thêm.

---

## PHẦN 1 - TỔNG QUAN DỰ ÁN

### 1.1. Tên dự án

**MealAI**

Tên thể hiện trong giao diện frontend, backend và cấu hình deploy.

### 1.2. Mục tiêu dự án

Dựa trên source code, MealAI là hệ thống hỗ trợ:

- Quản lý công thức món ăn.
- Gợi ý món ăn theo dinh dưỡng, sở thích, nguyên liệu trong tủ lạnh.
- Lập thực đơn theo tuần.
- Phân tích dinh dưỡng.
- Quản lý tủ lạnh.
- Tạo danh sách mua sắm.
- Chia sẻ công thức cộng đồng.
- Duyệt công thức, bình luận và đánh giá.
- Chatbot/voice assistant dùng Gemini và rule-based fallback.
- Thông báo người dùng và thông báo quản trị.

### 1.3. Kiến trúc tổng thể

```text
Frontend Next.js / React
        ↓
Axios API Client
        ↓
Backend NestJS REST API
        ↓
TypeORM
        ↓
PostgreSQL
```

Luồng chính:

```text
Người dùng
  ↓
Giao diện MealAI
  ↓
frontend/src/lib/api.ts
  ↓
REST API /api/v1
  ↓
NestJS Controllers
  ↓
Services / AI / Business Logic
  ↓
PostgreSQL Entities
```

### 1.4. Frontend

Frontend nằm trong thư mục:

```text
frontend/
```

Framework chính:

- Next.js App Router.
- React.
- TypeScript.
- TailwindCSS.
- Axios.
- Chart.js.
- Framer Motion.
- React Hot Toast.
- React Icons.

Các route frontend thực tế có trong source:

```text
/
/login
/register
/forgot-password
/reset-password
/recipes
/recipes/[id]
/recipes/[id]/edit
/recipes/submit
/favorites
/recently-viewed
/meal-planner
/nutrition
/insights
/inventory
/shopping-list
/profile
/profile/favorites
/profile/my-recipes
/my-reviews
/notifications
/privacy-policy
/terms-of-service
/admin
/admin/recipes
/admin/recipes/create
/admin/recipes/[id]/edit
/admin/pending
/admin/users
/admin/notifications
```

Ghi nhận: `/insights` tồn tại nhưng redirect về `/nutrition`, phù hợp với việc gộp menu **Dinh dưỡng & AI Insights**.

### 1.5. Backend

Backend nằm trong thư mục:

```text
backend/
```

Framework chính:

- NestJS.
- TypeORM.
- PostgreSQL.
- Passport JWT.
- Google Gemini SDK.
- Nodemailer.
- PDFKit.

Backend dùng global prefix:

```text
/api/v1
```

Ví dụ:

```text
GET /api/v1/recipes
POST /api/v1/auth/login
GET /api/v1/meal-plans
```

### 1.6. Database

Database dùng PostgreSQL qua TypeORM.

Cấu hình trong backend:

- Có hỗ trợ `DATABASE_URL`.
- Có hỗ trợ cấu hình rời: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.
- Có `DB_SSL`.
- Có `DB_SYNC`.
- `autoLoadEntities: true`.

---

## PHẦN 2 - CÔNG NGHỆ SỬ DỤNG

### 2.1. Frontend

| Nhóm | Công nghệ thực tế |
|---|---|
| Framework | Next.js `16.2.4` |
| UI | React `19.2.4`, custom components |
| Ngôn ngữ | TypeScript |
| Styling | TailwindCSS `^4` |
| API Client | Axios |
| State Management | React Context, React local state, localStorage |
| Form Library | Không thấy thư viện form riêng như Formik/React Hook Form |
| Chart Library | Chart.js, react-chartjs-2 |
| Animation | Framer Motion |
| Notification UI | react-hot-toast |
| Icon | react-icons |

Không thấy Redux, Zustand hoặc MobX trong source.

### 2.2. Backend

| Nhóm | Công nghệ thực tế |
|---|---|
| Framework | NestJS |
| ORM | TypeORM |
| Database Driver | pg |
| Authentication | JWT, Passport, bcryptjs |
| Validation | class-validator, class-transformer |
| Config | @nestjs/config |
| Upload | Multer qua NestJS platform-express |
| Email | Nodemailer |
| PDF | PDFKit |
| AI SDK | @google/generative-ai |
| Testing | Jest, ts-jest |

### 2.3. Database

Database chính:

```text
PostgreSQL
```

ORM mapping:

```text
TypeORM Entities
```

### 2.4. AI

AI thực tế trong source:

| Thành phần | Tình trạng |
|---|---|
| Gemini | Có |
| OpenAI | Không tìm thấy dependency/import/env trong source |
| Rule-based Recommendation | Có |
| Scoring-based Recommendation | Có |
| Nutrition Analysis | Có, rule/scoring-based |
| AI Recipe Moderation | Có, dùng Gemini nếu có API key |
| AI Review Moderation | Có, dùng Gemini nếu có API key |
| Chatbot AI | Có, dùng Gemini + tool calling + fallback |

---

## PHẦN 3 - CẤU TRÚC SOURCE CODE

### 3.1. Frontend

Cấu trúc chính:

```text
frontend/src/
  app/
  components/
  context/
  lib/
```

#### `frontend/src/app/`

Chứa các page theo Next.js App Router.

Các nhóm route chính:

| Route | Chức năng |
|---|---|
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |
| `/reset-password` | Đặt lại mật khẩu |
| `/recipes` | Danh sách công thức |
| `/recipes/[id]` | Chi tiết công thức |
| `/recipes/submit` | Người dùng gửi công thức |
| `/meal-planner` | Lập thực đơn |
| `/nutrition` | Dinh dưỡng & AI Insights |
| `/inventory` | Tủ lạnh |
| `/shopping-list` | Danh sách mua sắm |
| `/profile` | Hồ sơ cá nhân |
| `/favorites` | Món yêu thích |
| `/notifications` | Thông báo |
| `/privacy-policy` | Chính sách bảo mật |
| `/terms-of-service` | Điều khoản sử dụng |
| `/admin/*` | Khu vực quản trị |

#### `frontend/src/components/`

Chứa component dùng chung:

```text
Navbar.tsx
Footer.tsx
RecipeImage.tsx
ImageUpload.tsx
ChatWidget.tsx
VoiceAssistantButton.tsx
NutritionCharts.tsx
```

Component nutrition:

```text
components/nutrition/NutritionTabs.tsx
```

Component animation:

```text
AnimatedCounter.tsx
FadeInUp.tsx
ScrollReveal.tsx
StaggerContainer.tsx
```

#### `frontend/src/context/`

Có:

```text
AuthContext.tsx
```

Chức năng:

- Lưu trạng thái đăng nhập.
- Quản lý user hiện tại.
- Lưu token.
- Gọi API profile.
- Phân biệt user/admin ở giao diện.

#### `frontend/src/lib/`

Có:

```text
api.ts
images.ts
mealPlanEvents.ts
mealPortion.ts
```

Chức năng:

- `api.ts`: toàn bộ API client frontend.
- `images.ts`: xử lý URL ảnh/placeholder.
- `mealPlanEvents.ts`: event liên quan meal planner.
- `mealPortion.ts`: logic cảnh báo khẩu phần/số món.

Không thấy thư mục `frontend/src/hooks` hoặc `frontend/src/services`.

### 3.2. Backend

Cấu trúc chính:

```text
backend/src/
  common/
  modules/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
```

#### `backend/src/main.ts`

Chức năng:

- Khởi tạo Nest app.
- Cấu hình CORS.
- Prefix API `/api/v1`.
- ValidationPipe global.
- Serve static file upload:

```text
/uploads/
```

#### `backend/src/app.module.ts`

Chức năng:

- ConfigModule.
- TypeORM PostgreSQL.
- Import các module nghiệp vụ.

Module thực tế:

```text
AuthModule
RecipesModule
InventoryModule
RecommendationModule
MealPlanModule
ShoppingListModule
SeedModule
UploadModule
ChatbotModule
NotificationModule
```

#### `backend/src/common/`

Có:

```text
decorators/roles.decorator.ts
guards/roles.guard.ts
```

Chức năng:

- Phân quyền admin/user theo role.

#### `backend/src/modules/`

Các module chính:

| Module | Chức năng |
|---|---|
| auth | Đăng ký, đăng nhập, JWT, profile, admin users, reset password |
| recipes | Công thức, duyệt bài, rating, favorite, lịch sử sửa, view |
| recommendation | Gợi ý món ăn, anti-waste, phân tích dinh dưỡng |
| meal-plan | Thực đơn tuần, AI generate, đổi món, khóa món, PDF |
| inventory | Tủ lạnh, nguyên liệu sắp hết hạn |
| shopping-list | Danh sách mua sắm, PDF |
| chatbot | Chatbot, voice assistant, action log |
| notification | Thông báo người dùng |
| upload | Upload ảnh |
| pdf | Sinh PDF |
| seed | Seed dữ liệu/admin |

---

## PHẦN 4 - TÍNH NĂNG ĐÃ HOÀN THÀNH

### 4.1. Authentication

Có trong source:

- Đăng ký.
- Đăng nhập.
- Refresh token.
- Lấy profile.
- Cập nhật profile.
- Thống kê profile.
- Quên mật khẩu.
- Reset mật khẩu bằng OTP.
- Quản lý user bởi admin.

### 4.2. Authorization

Có:

- JWT guard.
- Role guard.
- Role `admin`.
- Role `user`.

### 4.3. Recipe

Có:

- Xem danh sách công thức.
- Tìm kiếm công thức.
- Lọc theo bữa ăn.
- Lọc theo thời gian nấu.
- Lọc theo calories.
- Lọc theo vùng miền.
- Sắp xếp.
- Xem chi tiết công thức.
- Theo dõi lượt xem.
- Ảnh công thức.
- Placeholder ảnh nếu lỗi.
- Admin tạo/sửa/xóa công thức.
- User gửi công thức.
- User sửa công thức đã gửi.
- User xóa công thức đã gửi.
- User gửi lại công thức bị từ chối.
- Lịch sử chỉnh sửa công thức.

### 4.4. Favorites

Có:

- Thêm món yêu thích.
- Xóa món yêu thích.
- Kiểm tra trạng thái yêu thích.
- Trang danh sách yêu thích.
- Profile favorites.

### 4.5. Reviews / Ratings

Có:

- Xem đánh giá công thức.
- Tạo rating/review.
- Trả lời review.
- Sửa review.
- Xóa review.
- AI/static moderation review.
- Admin duyệt review.
- Admin từ chối review.
- Mở khóa user bị moderation.

### 4.6. Community

Có:

- User chia sẻ công thức.
- Công thức chờ duyệt.
- Admin duyệt công thức.
- Admin từ chối công thức.
- AI đánh giá chất lượng công thức.
- Audit moderation.
- Retry AI moderation.
- Thông báo admin khi có nội dung cần xử lý.

### 4.7. Meal Planner

Có:

- Xem thực đơn theo tuần.
- Tạo thực đơn tự động.
- Tạo thực đơn theo ngày.
- Chọn món thủ công vào bữa ăn.
- Hỗ trợ nhiều món trong một bữa thông qua `recipeIds`.
- Đổi món.
- Xóa món khỏi bữa.
- Khóa món.
- Đánh dấu đã ăn.
- Xóa meal plan.
- Tính nutrition cho meal plan.
- Xuất PDF.
- Tùy chọn anti-waste.
- Tùy chọn tránh lặp món trong 7 ngày.
- Tùy chọn tối ưu khẩu phần/số món.
- Logic cảnh báo khẩu phần trong `meal-portion`.

### 4.8. Nutrition

Có:

- Trang `/nutrition`.
- Dashboard dinh dưỡng.
- Nutrition tabs.
- Biểu đồ dinh dưỡng.
- Phân tích tuần.
- Lưu kết quả phân tích dinh dưỡng vào database.
- Lấy phân tích mới nhất.

### 4.9. AI Insights

Có trong source thông qua:

- `/nutrition`.
- `NutritionTabs.tsx`.
- `recommendations/nutrition-analysis`.
- `weekly_nutrition_analyses`.
- `NutritionAnalyzerService`.

Ghi nhận: route `/insights` redirect về `/nutrition`, không còn là trang riêng độc lập.

### 4.10. Inventory / Fridge

Có:

- Danh sách nguyên liệu trong tủ lạnh.
- Thêm nguyên liệu.
- Sửa nguyên liệu.
- Xóa nguyên liệu.
- Lọc nguyên liệu sắp hết hạn.
- Tìm kiếm nguyên liệu.
- Dùng inventory vào gợi ý anti-waste.

### 4.11. Shopping List

Có:

- Danh sách mua sắm.
- Xem chi tiết.
- Tạo từ meal plan.
- Tạo từ recipe.
- Đánh dấu đã mua.
- Xóa danh sách.
- Xuất PDF.

### 4.12. Chatbot / Voice Assistant

Có:

- Chatbot message.
- Chat history.
- Xóa lịch sử chat.
- Action log.
- Voice command.
- Voice stats cho admin.
- Text-to-speech endpoint.
- Frontend voice assistant button.
- Wake word trong frontend.
- Speech-to-text dùng Web Speech API phía frontend.
- TTS backend dùng Azure Speech hoặc ElevenLabs nếu có key.
- TTS fallback phía frontend bằng Web Speech API.

### 4.13. Notifications

Có:

- Lấy danh sách thông báo.
- Đếm thông báo chưa đọc.
- Đánh dấu một thông báo đã đọc.
- Đánh dấu tất cả đã đọc.
- Admin moderation notifications.

### 4.14. Admin

Có:

- Dashboard admin.
- Quản lý công thức.
- Tạo công thức.
- Sửa công thức.
- Xóa công thức.
- Duyệt công thức chờ.
- Quản lý thành viên.
- Quản lý thông báo/moderation.

Không thấy page source thực tế cho `/admin/voice-dashboard/page.tsx` trong danh sách route hiện tại.

### 4.15. Legal Pages

Có:

- `/privacy-policy`
- `/terms-of-service`

---

## PHẦN 5 - API INVENTORY

Tất cả endpoint dưới đây có prefix:

```text
/api/v1
```

### 5.1. App / Health

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/` | Trả thông tin trạng thái API |
| GET | `/health` | Health check |

### 5.2. Auth

| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/forgot-password` | Gửi OTP quên mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu |
| GET | `/auth/profile` | Lấy profile |
| GET | `/auth/profile/stats` | Thống kê profile |
| PUT | `/auth/profile` | Cập nhật profile |
| GET | `/auth/admin/users` | Admin lấy danh sách user |
| POST | `/auth/admin/users` | Admin tạo user |
| PUT | `/auth/admin/users/:id` | Admin sửa user |
| DELETE | `/auth/admin/users/:id` | Admin xóa user |

### 5.3. Recipes

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/recipes` | Danh sách công thức |
| GET | `/recipes/:id` | Chi tiết công thức |
| GET | `/recipes/:recipeId/ratings` | Lấy đánh giá |
| POST | `/recipes/:recipeId/ratings` | Tạo đánh giá |
| POST | `/recipes/:recipeId/ratings/:parentId/replies` | Trả lời đánh giá |
| PUT | `/recipes/:recipeId/ratings/:ratingId` | Sửa đánh giá |
| DELETE | `/recipes/:recipeId/ratings/:ratingId` | Xóa đánh giá |
| POST | `/recipes/submit` | User gửi công thức |
| GET | `/recipes/my-submissions` | Công thức user đã gửi |
| PUT | `/recipes/my-submissions/:id` | Sửa công thức đã gửi |
| DELETE | `/recipes/my-submissions/:id` | Xóa công thức đã gửi |
| POST | `/recipes/my-submissions/:id/resubmit` | Gửi lại công thức |
| GET | `/recipes/my-reviews` | Review của user |
| GET | `/recipes/:id/edit-history` | Lịch sử sửa công thức |

### 5.4. Admin Recipes

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/recipes/admin/stats` | Thống kê admin |
| GET | `/recipes/admin/all` | Tất cả công thức |
| POST | `/recipes/admin/create` | Admin tạo công thức |
| PUT | `/recipes/admin/:id` | Admin sửa công thức |
| DELETE | `/recipes/admin/:id` | Admin xóa công thức |
| GET | `/recipes/admin/pending` | Công thức chờ duyệt |
| POST | `/recipes/admin/:id/approve` | Duyệt công thức |
| POST | `/recipes/admin/:id/reject` | Từ chối công thức |
| PUT | `/recipes/admin/:id/edit-pending` | Sửa công thức pending |
| GET | `/recipes/admin/moderation/:recipeId/audit` | Xem audit AI |
| POST | `/recipes/admin/moderation/:recipeId/audit/retry` | Chạy lại moderation |

### 5.5. Favorites

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/favorites` | Danh sách yêu thích |
| GET | `/favorites/:recipeId/status` | Kiểm tra yêu thích |
| POST | `/favorites` | Thêm yêu thích |
| DELETE | `/favorites/:recipeId` | Xóa yêu thích |

### 5.6. Recommendation

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/recommendations` | Gợi ý món ăn |
| GET | `/recommendations/anti-waste` | Gợi ý chống lãng phí |
| GET | `/recommendations/nutrition-analysis` | Phân tích dinh dưỡng tuần |
| GET | `/recommendations/nutrition-analysis/latest` | Phân tích mới nhất |

### 5.7. Meal Plans

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/meal-plans` | Lấy meal plan theo tuần |
| POST | `/meal-plans/generate` | Sinh meal plan tuần |
| POST | `/meal-plans/generate-days` | Sinh meal plan theo ngày |
| PUT | `/meal-plans/slot` | Thêm/cập nhật món vào slot |
| PUT | `/meal-plans/:id/items/:itemId` | Đổi món |
| DELETE | `/meal-plans/:id/items/:itemId` | Xóa món |
| PATCH | `/meal-plans/:id/items/:itemId/lock` | Khóa/mở khóa món |
| PATCH | `/meal-plans/:id/items/:itemId/consume` | Đánh dấu đã ăn |
| DELETE | `/meal-plans/:id` | Xóa meal plan |
| GET | `/meal-plans/:id/nutrition` | Nutrition meal plan |
| GET | `/meal-plans/current/pdf` | PDF meal plan hiện tại |
| GET | `/meal-plans/:id/pdf` | PDF meal plan theo id |

### 5.8. Inventory

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/inventory` | Lấy danh sách tủ lạnh |
| POST | `/inventory` | Thêm nguyên liệu |
| PUT | `/inventory/:id` | Sửa nguyên liệu |
| DELETE | `/inventory/:id` | Xóa nguyên liệu |
| GET | `/inventory/ingredients/search` | Tìm nguyên liệu |

### 5.9. Shopping Lists

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/shopping-lists` | Danh sách mua sắm |
| GET | `/shopping-lists/:id` | Chi tiết danh sách |
| POST | `/shopping-lists/generate` | Tạo từ meal plan |
| POST | `/shopping-lists/add-recipe` | Tạo/thêm từ recipe |
| PATCH | `/shopping-lists/:id/items/:itemId` | Đánh dấu item đã mua |
| DELETE | `/shopping-lists/:id` | Xóa danh sách |
| GET | `/shopping-lists/:id/pdf` | Xuất PDF |

### 5.10. Chatbot / Voice

| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/chatbot/message` | Gửi tin nhắn chatbot |
| POST | `/chatbot/voice` | Gửi lệnh thoại |
| GET | `/chatbot/tts` | Text-to-speech |
| GET | `/chatbot/voice/stats` | Thống kê voice admin |
| GET | `/chatbot/history` | Lịch sử chat |
| DELETE | `/chatbot/history` | Xóa lịch sử chat |
| POST | `/chatbot/action-log` | Ghi action log |

### 5.11. Notifications

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/notifications` | Danh sách thông báo |
| GET | `/notifications/unread-count` | Số chưa đọc |
| PUT | `/notifications/mark-all-read` | Đánh dấu tất cả đã đọc |
| PUT | `/notifications/:id/read` | Đánh dấu một thông báo đã đọc |

### 5.12. Admin Moderation

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/admin/moderation/notifications` | Thông báo moderation |
| PATCH | `/admin/moderation/notifications/:id/read` | Đánh dấu đã đọc |
| POST | `/admin/moderation/reviews/:reviewId/approve` | Duyệt review |
| POST | `/admin/moderation/reviews/:reviewId/reject` | Từ chối review |
| PATCH | `/admin/moderation/users/:userId/unlock` | Mở khóa user |

### 5.13. Upload

| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/upload/image` | Upload ảnh công thức |

---

## PHẦN 6 - DATABASE INVENTORY

Các bảng/entity thực tế trong source:

| Bảng | Mục đích | Quan hệ chính |
|---|---|---|
| `users` | Tài khoản, profile, role, thông tin sức khỏe | 1-1 preferences, 1-n recipes, favorites, meal plans |
| `user_preferences` | Sở thích ăn uống, dị ứng, bệnh lý, khẩu phần | 1-1 user |
| `password_reset_tokens` | OTP reset password | Theo email |
| `recipes` | Công thức món ăn | N-1 submitter, 1-n ingredients, ratings, favorites |
| `ingredients` | Nguyên liệu | 1-n recipe ingredients, inventory |
| `recipe_ingredients` | Nguyên liệu của công thức | N-1 recipe, N-1 ingredient |
| `favorite_recipes` | Món yêu thích | N-1 user, N-1 recipe |
| `recipe_ratings` | Đánh giá/bình luận | N-1 user, N-1 recipe, self-reply |
| `recipe_views` | Lượt xem công thức | N-1 recipe, user nullable |
| `recipe_moderation_audits` | Kết quả AI moderation công thức | Theo recipe |
| `recipe_edit_history` | Lịch sử sửa công thức | Theo recipe/user |
| `admin_notifications` | Thông báo admin moderation | Liên quan review/user |
| `inventory` | Tủ lạnh cá nhân | N-1 user, N-1 ingredient |
| `meal_plans` | Thực đơn tuần | N-1 user, 1-n meal plan items |
| `meal_plan_items` | Món trong thực đơn | N-1 meal plan, N-1 recipe |
| `shopping_lists` | Danh sách mua sắm | N-1 user, mealPlan nullable |
| `shopping_list_items` | Item mua sắm | N-1 shopping list, N-1 ingredient |
| `weekly_nutrition_analyses` | Kết quả phân tích dinh dưỡng tuần | N-1 user |
| `chat_messages` | Lịch sử chat | N-1 user |
| `user_action_logs` | Log hành vi người dùng | N-1 user, recipe nullable |
| `voice_command_logs` | Log lệnh thoại | N-1 user |
| `notifications` | Thông báo người dùng | N-1 user, actor, recipe nullable |

---

## PHẦN 7 - AI FEATURES

### 7.1. AI đang dùng ở đâu

AI hoặc logic thông minh xuất hiện ở:

- Recommendation Engine.
- Anti-waste recommendation.
- Nutrition Analysis.
- Meal Planner.
- Recipe Moderation.
- Review Moderation.
- Chatbot.
- Voice Assistant.

### 7.2. Gemini

Source có dùng:

```text
@google/generative-ai
```

Các file có Gemini:

```text
backend/src/modules/chatbot/chatbot-ai.service.ts
backend/src/modules/recipes/recipe-moderation.service.ts
backend/src/modules/recipes/review-moderation.service.ts
```

Model được dùng trong source:

```text
gemini-2.5-flash
```

Biến môi trường:

```text
GEMINI_API_KEY
```

Nếu không có key, source có fallback mode.

### 7.3. OpenAI

Không tìm thấy dependency/import/env OpenAI trong source hiện tại.

Kết luận audit:

```text
OpenAI: chưa được tích hợp trong source.
```

### 7.4. Recommendation Engine

File chính:

```text
backend/src/modules/recommendation/recommendation.service.ts
```

Logic thực tế:

- Lấy công thức active/approved.
- Lọc theo meal type.
- Lọc theo chế độ ăn.
- Lọc theo dị ứng.
- Lọc theo bệnh lý.
- Lọc theo thời gian nấu.
- Lọc theo ngân sách.
- Tính điểm dựa trên nhiều thành phần.

Các nhóm điểm:

```text
nutritionHealth
ingredientMatch
wasteReduction
preferenceMatch
cookTimeScore
```

Trọng số trong source:

```text
nutritionHealth: 0.30
ingredientMatch: 0.25
wasteReduction: 0.20
preferenceMatch: 0.15
cookTimeScore: 0.10
```

### 7.5. Luồng AI gợi ý món ăn

```text
User profile/preferences
        ↓
Inventory + favorites + action logs
        ↓
Recipe candidates
        ↓
Filter allergy / health / diet / budget / cooking time
        ↓
Scoring engine
        ↓
Sort by score
        ↓
Return recommendations
```

### 7.6. Luồng phân tích dinh dưỡng

File chính:

```text
backend/src/modules/recommendation/nutrition-analyzer.service.ts
```

Luồng:

```text
Meal plan trong tuần
        ↓
Tổng calories/protein/carbs/fat/sugar/sodium/fiber
        ↓
So sánh với target cá nhân
        ↓
Tính nutritionScore
        ↓
Sinh strengths / weaknesses / recommendations
        ↓
Lưu weekly_nutrition_analyses
```

Đây là rule/scoring-based, không thấy gọi Gemini trong nutrition analyzer.

### 7.7. Luồng AI đánh giá công thức

File chính:

```text
backend/src/modules/recipes/recipe-moderation.service.ts
```

Luồng:

```text
User submit recipe
        ↓
Kiểm tra tên, nguyên liệu, bước làm
        ↓
Kiểm tra trùng lặp
        ↓
Nếu có GEMINI_API_KEY: gọi Gemini
        ↓
Trả qualityScore, feedback, nutritionValidityNotes
        ↓
Lưu recipe_moderation_audits
        ↓
Admin duyệt/từ chối
```

### 7.8. Review Moderation

File chính:

```text
backend/src/modules/recipes/review-moderation.service.ts
```

Có hai lớp:

- Static bad-word filter.
- Gemini moderation nếu có API key.

### 7.9. Chatbot AI

File chính:

```text
backend/src/modules/chatbot/chatbot-ai.service.ts
```

Chatbot dùng Gemini với tool/function declarations.

Các nhóm tool trong source gồm:

- Tìm công thức.
- Lấy chi tiết công thức.
- Gợi ý món.
- Xem inventory.
- Xem nguyên liệu sắp hết hạn.
- Tìm nguyên liệu.
- Thêm vào inventory.
- Tạo meal plan.
- Xem meal plan.
- Tạo shopping list.
- Thêm món vào meal plan.
- Xóa món khỏi meal plan.
- Tính calories.
- Điều hướng frontend.
- Cập nhật preferences.

---

## PHẦN 8 - PHÂN QUYỀN

### 8.1. Guest

Guest có thể truy cập các phần public trong source:

- Trang chủ.
- Đăng nhập.
- Đăng ký.
- Quên mật khẩu.
- Reset mật khẩu.
- Danh sách công thức public.
- Chi tiết công thức public.
- Xem rating public.
- Chính sách bảo mật.
- Điều khoản sử dụng.

### 8.2. User

User đăng nhập có thể:

- Xem/cập nhật profile.
- Xem thống kê profile.
- Quản lý món yêu thích.
- Gửi công thức.
- Quản lý công thức đã gửi.
- Đánh giá/bình luận công thức.
- Quản lý tủ lạnh.
- Nhận gợi ý món ăn.
- Tạo meal planner.
- Tạo shopping list.
- Dùng chatbot.
- Dùng voice assistant.
- Xem thông báo.
- Upload ảnh.

### 8.3. Admin

Admin có thể:

- Quản lý users.
- Xem thống kê admin.
- Quản lý toàn bộ công thức.
- Tạo/sửa/xóa công thức.
- Duyệt công thức chờ.
- Từ chối công thức.
- Xem audit moderation.
- Chạy lại moderation.
- Duyệt/từ chối review.
- Mở khóa user.
- Xem voice stats.
- Xem admin moderation notifications.

---

## PHẦN 9 - RESPONSIVE & DEPLOYMENT

### 9.1. Responsive

Trong frontend có sử dụng TailwindCSS responsive classes như:

```text
sm:
md:
lg:
xl:
```

Các trang dùng layout dạng grid/flex, card layout và responsive utilities.

Ghi nhận từ source:

- Có thiết kế responsive bằng Tailwind.
- Không thấy test tự động kiểm tra responsive/mobile/tablet trong source.

### 9.2. Mobile / Tablet / Desktop

Có hỗ trợ ở mức source UI:

- Navbar responsive.
- Card layout.
- Grid layout.
- Nutrition dashboard.
- Meal planner layout.
- Legal pages responsive.

Không tìm thấy Playwright/Cypress/e2e viewport test.

### 9.3. Deployment

Có file:

```text
render.yaml
```

Render blueprint gồm:

- PostgreSQL database.
- Backend service.
- Frontend service.

Không tìm thấy trong workspace:

```text
Dockerfile
docker-compose.yml
vercel.json
```

### 9.4. Environment Variables

Backend:

```text
PORT
FRONTEND_URL
DATABASE_URL
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_NAME
DB_SSL
DB_SYNC
JWT_SECRET
JWT_REFRESH_SECRET
JWT_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
GEMINI_API_KEY
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASS
MAIL_FROM
AZURE_SPEECH_KEY
AZURE_SPEECH_REGION
ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID
```

Frontend:

```text
NEXT_PUBLIC_API_URL
```

### 9.5. Static Uploads

Backend expose ảnh upload:

```text
/uploads/
```

Source cấu hình:

```text
app.useStaticAssets(..., { prefix: '/uploads/' })
```

Upload ảnh công thức lưu vào:

```text
backend/uploads/recipes
```

Lưu ý kỹ thuật từ source/deploy: nếu dùng Render không có persistent disk hoặc object storage, file upload local có thể không bền vững sau restart/deploy.

---

## PHẦN 10 - BÁO CÁO CUỐI

### 10.1. Tính năng đã hoàn thành theo source

Đánh giá này dựa trên mức độ hiện diện trong source, không phải kiểm thử production.

| Nhóm chức năng | Mức hoàn thiện theo source |
|---|---:|
| Authentication | 90% |
| Authorization | 85% |
| Recipe Management | 90% |
| Community / Rating / Review | 85% |
| Admin Moderation | 85% |
| Meal Planner | 85% |
| Recommendation Engine | 85% |
| Nutrition Dashboard / AI Insights | 80% |
| Inventory / Fridge | 85% |
| Shopping List | 80% |
| Notification | 75% |
| Chatbot / Voice Assistant | 80% |
| Legal Pages | 90% |
| Deployment Render | 70% |

Mức hoàn thiện tổng thể theo source:

```text
82/100
```

### 10.2. Tính năng còn thiếu hoặc chưa thấy trong source

Không tìm thấy:

- OpenAI integration.
- Dockerfile.
- Docker Compose.
- Vercel config.
- Dedicated frontend form library.
- Redux/Zustand state management.
- Automated e2e test.
- Automated responsive viewport test.
- Object storage/cloud storage cho ảnh upload.
- Payment/subscription.
- Real-time websocket notification.

### 10.3. Nợ kỹ thuật

Các điểm thấy trực tiếp từ source/cấu hình:

- `DB_SYNC` có thể bật synchronize TypeORM, cần cẩn trọng khi production.
- Seed service có admin mặc định `admin@mealai.vn` / `admin123456`, cần đổi hoặc vô hiệu hóa khi deploy thật.
- Upload ảnh dùng local filesystem, không bền vững nếu deploy trên môi trường ephemeral.
- Một số chuỗi tiếng Việt trong backend có dấu hiệu lỗi encoding/mojibake.
- Test coverage còn mỏng so với số lượng module nghiệp vụ.
- Một phần logic AI phụ thuộc biến môi trường `GEMINI_API_KEY`; nếu thiếu key sẽ chạy fallback.
- Admin moderation có nơi dùng RolesGuard, có nơi kiểm tra role thủ công.

### 10.4. Lỗi tiềm ẩn

Các rủi ro từ source:

- File ảnh upload có thể mất sau redeploy nếu không có persistent storage.
- Nếu `GEMINI_API_KEY` thiếu, chatbot và moderation không dùng Gemini thật.
- Nếu `FRONTEND_URL` sai, CORS có thể chặn frontend.
- Nếu `NEXT_PUBLIC_API_URL` sai, frontend gọi nhầm backend.
- Nếu database chưa migrate/seed đúng, các trang phụ thuộc recipe/ingredient/meal plan có thể empty.
- `synchronize: true` có thể làm thay đổi schema ngoài ý muốn trên production.
- API nhiều module dùng dữ liệu cá nhân, cần kiểm tra bảo mật token và quyền truy cập từng endpoint khi production.

### 10.5. Đề xuất cải tiến

Ưu tiên kỹ thuật:

1. Thêm migration TypeORM chính thức, tắt `synchronize` trên production.
2. Đổi seed admin mặc định hoặc yêu cầu tạo admin qua env.
3. Chuyển upload ảnh sang Cloudinary/S3/Supabase Storage hoặc Render persistent disk.
4. Chuẩn hóa encoding tiếng Việt trong source.
5. Thêm e2e test cho các luồng chính: login, recipe, meal planner, nutrition, admin moderation.
6. Thêm unit test cho Recommendation Engine, Nutrition Analyzer, Meal Planner no-repeat.
7. Chuẩn hóa authorization, tránh trộn RolesGuard và kiểm tra role thủ công.
8. Thêm logging có cấu trúc cho AI request/fallback.
9. Thêm rate limit cho auth, chatbot, upload.
10. Thêm tài liệu `.env.example`.

### 10.6. Kết luận kiến trúc

MealAI hiện là một hệ thống full-stack tương đối đầy đủ:

```text
Next.js frontend
NestJS backend
PostgreSQL database
Gemini AI integration
Rule/scoring recommendation
Meal planning
Nutrition analysis
Community moderation
Voice/chat assistant
Render deployment config
```

Điểm mạnh của source hiện tại là có nhiều module nghiệp vụ đã được tách rõ: auth, recipes, recommendation, meal-plan, inventory, shopping-list, chatbot, notification. Phần AI không chỉ gọi model mà còn có rule-based fallback và scoring engine, phù hợp với một đồ án tốt nghiệp về hệ thống gợi ý thực đơn thông minh.

Điểm cần xử lý trước khi nộp/deploy ổn định là cấu hình production, lưu trữ ảnh, bảo mật admin seed, migration database và bổ sung test.
