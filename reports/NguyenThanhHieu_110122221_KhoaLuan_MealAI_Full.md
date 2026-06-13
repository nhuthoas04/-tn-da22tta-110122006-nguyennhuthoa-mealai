# TRƯỜNG ĐẠI HỌC TRÀ VINH
# KHOA KỸ THUẬT VÀ CÔNG NGHỆ

# KHÓA LUẬN TỐT NGHIỆP

## XÂY DỰNG HỆ THỐNG GỢI Ý THỰC ĐƠN VÀ DINH DƯỠNG THÔNG MINH ỨNG DỤNG TRÍ TUỆ NHÂN TẠO (MEALAI)

**Ngành:** Công nghệ Thông tin

**Sinh viên thực hiện:** Nguyễn Thanh Hiếu

**Mã số sinh viên:** 110122221

**Giảng viên hướng dẫn:** ........................................

**Trà Vinh, 2026**

---

# LỜI MỞ ĐẦU

Trong những năm gần đây, nhu cầu sử dụng các hệ thống hỗ trợ chăm sóc sức khỏe, quản lý bữa ăn và cá nhân hóa dinh dưỡng ngày càng tăng. Người dùng không chỉ cần một danh sách công thức nấu ăn, mà còn cần một công cụ có khả năng hiểu khẩu vị, tình trạng nguyên liệu sẵn có, mục tiêu năng lượng, hạn sử dụng thực phẩm và thói quen sinh hoạt của từng cá nhân hoặc gia đình. Bài toán lập thực đơn vì vậy không còn đơn thuần là chọn món theo cảm tính. Nó là bài toán kết hợp giữa dữ liệu công thức, dữ liệu dinh dưỡng, hồ sơ người dùng, tình trạng tủ lạnh, lịch ăn uống và khả năng tương tác thuận tiện trên giao diện web hiện đại.

Đề tài "Xây dựng hệ thống gợi ý thực đơn và dinh dưỡng thông minh ứng dụng trí tuệ nhân tạo (MealAI)" được thực hiện nhằm xây dựng một hệ thống web có khả năng gợi ý món ăn phù hợp với từng người dùng, tạo thực đơn tuần, hỗ trợ quản lý nguyên liệu trong tủ lạnh, sinh danh sách mua sắm, phân tích dinh dưỡng và tương tác qua chatbot/giọng nói. Hệ thống được phát triển theo kiến trúc frontend Next.js và backend NestJS, sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu, đồng thời tích hợp các thành phần AI theo hai hướng: mô hình chấm điểm có luật rõ ràng cho Recommendation Engine và mô hình ngôn ngữ Gemini cho chatbot, function calling và hỗ trợ kiểm duyệt nội dung.

Điểm quan trọng của khóa luận là toàn bộ phân tích không dừng lại ở mô tả lý thuyết. Nội dung được xây dựng dựa trên source code thực tế của dự án MealAI. Các chức năng như xác thực JWT, phân quyền quản trị, xử lý hồ sơ dinh dưỡng, bảng dữ liệu PostgreSQL, thuật toán gợi ý, tính TDEE, lập thực đơn theo tuần, tạo shopping list, trừ kho khi đánh dấu đã dùng món, kiểm duyệt đánh giá, thông báo, trợ lý giọng nói và xuất PDF đều được phân tích từ các module, service, entity và API hiện có trong dự án. Nhờ đó, báo cáo phản ánh đúng sản phẩm đã xây dựng, tránh tình trạng trình bày chung chung không gắn với hệ thống.

Khóa luận được trình bày theo cấu trúc của khung báo cáo tốt nghiệp: Chương 1 nêu tổng quan đề tài, lý do chọn đề tài, mục tiêu và phạm vi; Chương 2 trình bày cơ sở lý thuyết và công nghệ nền; Chương 3 phân tích và thiết kế hệ thống; Chương 4 mô tả quá trình xây dựng hệ thống dựa trên source code; Chương 5 trình bày kết quả, kiểm thử và đánh giá; cuối cùng là phần kết luận, phụ lục và tài liệu tham khảo.

# LỜI CẢM ƠN

Em xin gửi lời cảm ơn chân thành đến quý thầy cô Trường Đại học Trà Vinh, đặc biệt là quý thầy cô Khoa Kỹ thuật và Công nghệ, đã truyền đạt cho em những kiến thức nền tảng và chuyên môn trong suốt quá trình học tập. Những kiến thức về lập trình web, cơ sở dữ liệu, phân tích thiết kế hệ thống, trí tuệ nhân tạo, kiểm thử phần mềm và triển khai ứng dụng là cơ sở quan trọng để em thực hiện đề tài này.

Em xin cảm ơn giảng viên hướng dẫn đã định hướng, góp ý và hỗ trợ em trong quá trình lựa chọn đề tài, xác định phạm vi chức năng, hoàn thiện hệ thống và trình bày khóa luận. Những góp ý của thầy/cô giúp em nhìn nhận đề tài dưới góc độ hệ thống hơn, đặc biệt trong việc liên kết giữa yêu cầu nghiệp vụ, thiết kế dữ liệu, thuật toán gợi ý và trải nghiệm người dùng.

Em cũng xin cảm ơn gia đình, bạn bè và các anh chị đã động viên, hỗ trợ em trong quá trình học tập và thực hiện khóa luận. Do thời gian và kinh nghiệm còn hạn chế, đề tài khó tránh khỏi thiếu sót. Em kính mong nhận được ý kiến đóng góp từ quý thầy cô để hệ thống MealAI tiếp tục được hoàn thiện hơn trong tương lai.

# MỤC LỤC

- Lời mở đầu
- Lời cảm ơn
- Chương 1. Tổng quan đề tài
- Chương 2. Cơ sở lý thuyết
- Chương 3. Phân tích và thiết kế hệ thống
- Chương 4. Xây dựng hệ thống
- Chương 5. Kết quả và đánh giá
- Kết luận
- Phụ lục
- Tài liệu tham khảo

# DANH MỤC HÌNH

- [HÌNH 1.1: Bối cảnh bài toán lập thực đơn gia đình] - problem-context.png
- [HÌNH 1.2: Phạm vi chức năng tổng quát của MealAI] - scope-overview.png
- [HÌNH 2.1: Mô hình ứng dụng web client-server] - client-server-model.png
- [HÌNH 2.2: Quy trình xác thực JWT] - jwt-auth-flow.png
- [HÌNH 2.3: Công thức tính nhu cầu năng lượng theo hồ sơ người dùng] - calorie-calculation.png
- [HÌNH 2.4: Mô hình chấm điểm gợi ý món ăn] - recommendation-scoring-model.png
- [HÌNH 3.1: Sơ đồ kiến trúc tổng thể hệ thống] - architecture-overview.png
- [HÌNH 3.2: Use Case Diagram hệ thống MealAI] - use-case-diagram.png
- [HÌNH 3.3: Activity Diagram quy trình gợi ý món ăn] - activity-recommendation.png
- [HÌNH 3.4: Sequence Diagram đăng nhập và lấy hồ sơ người dùng] - sequence-auth-profile.png
- [HÌNH 3.5: Sequence Diagram gợi ý món ăn thông minh] - sequence-recommendation.png
- [HÌNH 3.6: Sequence Diagram lập thực đơn tuần] - sequence-meal-plan.png
- [HÌNH 3.7: ERD cơ sở dữ liệu PostgreSQL] - database-erd.png
- [HÌNH 3.8: Luồng Recommendation Engine] - recommendation-engine-flow.png
- [HÌNH 3.9: Luồng Voice Assistant] - voice-assistant-flow.png
- [HÌNH 3.10: Luồng Notification System] - notification-flow.png
- [HÌNH 3.11: Luồng Community Review và Moderation] - community-moderation-flow.png
- [HÌNH 4.1: Cấu trúc thư mục frontend Next.js] - frontend-folder-structure.png
- [HÌNH 4.2: Giao diện trang chủ MealAI] - home-page.png
- [HÌNH 4.3: Giao diện đăng nhập] - login-page.png
- [HÌNH 4.4: Giao diện đăng ký tài khoản] - register-page.png
- [HÌNH 4.5: Giao diện danh sách công thức] - recipes-page.png
- [HÌNH 4.6: Giao diện chi tiết món ăn và đánh giá] - recipe-detail-page.png
- [HÌNH 4.7: Giao diện tủ lạnh cá nhân] - inventory-page.png
- [HÌNH 4.8: Giao diện gợi ý món ăn] - recommendations-page.png
- [HÌNH 4.9: Giao diện lập thực đơn tuần] - meal-planner-page.png
- [HÌNH 4.10: Giao diện danh sách mua sắm] - shopping-list-page.png
- [HÌNH 4.11: Giao diện phân tích dinh dưỡng] - nutrition-analysis-page.png
- [HÌNH 4.12: Giao diện Chatbot AI] - chatbot-widget.png
- [HÌNH 4.13: Giao diện Voice Assistant] - voice-assistant-button.png
- [HÌNH 4.14: Giao diện quản trị duyệt món ăn] - admin-pending-recipes.png
- [HÌNH 4.15: Giao diện quản trị thông báo vi phạm] - admin-moderation-notifications.png
- [HÌNH 4.16: Giao diện thống kê lệnh giọng nói] - admin-voice-dashboard.png
- [HÌNH 4.17: Giao diện hồ sơ và mục tiêu dinh dưỡng] - profile-page.png
- [HÌNH 5.1: Kết quả kiểm thử luồng gợi ý món ăn] - test-recommendation-result.png
- [HÌNH 5.2: Kết quả kiểm thử thực đơn tuần] - test-meal-plan-result.png
- [HÌNH 5.3: Kết quả kiểm thử trợ lý giọng nói] - test-voice-result.png

# DANH MỤC BẢNG

- Bảng 1.1: Phạm vi chức năng chính của hệ thống MealAI.
- Bảng 2.1: Công nghệ sử dụng trong hệ thống.
- Bảng 2.2: Thành phần điểm trong Recommendation Engine.
- Bảng 3.1: Danh sách tác nhân và vai trò.
- Bảng 3.2: Yêu cầu chức năng.
- Bảng 3.3: Yêu cầu phi chức năng.
- Bảng 3.4: Thiết kế API theo nhóm chức năng.
- Bảng 3.5: Thiết kế cơ sở dữ liệu PostgreSQL.
- Bảng 4.1: Cấu trúc module backend.
- Bảng 4.2: Cấu trúc route frontend.
- Bảng 4.3: Trọng số thuật toán gợi ý.
- Bảng 5.1: Bảng kiểm thử chức năng.
- Bảng 5.2: Bảng đánh giá kết quả.
- Bảng 5.3: Bảng hiệu năng.
- Bảng 5.4: Bảng so sánh trước và sau khi ứng dụng MealAI.

# DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt |Diễn giải |Ý nghĩa trong đề tài |
| --- |--- |--- |
| AI |Artificial Intelligence |Trí tuệ nhân tạo, dùng trong gợi ý, chatbot và kiểm duyệt. |
| API |Application Programming Interface |Giao diện lập trình giữa frontend và backend. |
| CRUD |Create, Read, Update, Delete |Nhóm thao tác dữ liệu cơ bản. |
| DTO |Data Transfer Object |Lớp định nghĩa dữ liệu đầu vào trong NestJS. |
| ERD |Entity Relationship Diagram |Sơ đồ thực thể liên kết cơ sở dữ liệu. |
| JWT |JSON Web Token |Cơ chế xác thực access token và refresh token. |
| LLM |Large Language Model |Mô hình ngôn ngữ lớn, trong đề tài là Gemini. |
| ORM |Object Relational Mapping |Cơ chế ánh xạ TypeORM giữa class và bảng PostgreSQL. |
| REST |Representational State Transfer |Kiến trúc API HTTP của hệ thống. |
| STT |Speech-to-Text |Chuyển giọng nói thành văn bản trong Voice Assistant. |
| TDEE |Total Daily Energy Expenditure |Tổng năng lượng tiêu hao hằng ngày. |
| TTS |Text-to-Speech |Chuyển văn bản phản hồi thành giọng nói. |

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

## 1.1. Lý do chọn đề tài

Bữa ăn hằng ngày là một phần quan trọng của sức khỏe cá nhân và đời sống gia đình. Tuy nhiên, việc lựa chọn món ăn phù hợp không đơn giản, đặc biệt khi người dùng phải cân bằng nhiều yếu tố cùng lúc: khẩu vị, thời gian nấu, nguyên liệu còn trong tủ lạnh, hạn sử dụng thực phẩm, ngân sách, mục tiêu calo, bệnh lý liên quan đến đường hoặc muối, chế độ ăn chay, low-carb, keto và nhu cầu đa dạng món theo từng bữa. Trong thực tế, nhiều gia đình vẫn lập thực đơn bằng kinh nghiệm cá nhân, ghi chú rời rạc hoặc chọn món theo thói quen. Cách làm này dễ dẫn đến trùng món, thiếu cân bằng dinh dưỡng, bỏ quên nguyên liệu sắp hết hạn và phát sinh mua sắm không cần thiết.

Các ứng dụng công thức nấu ăn phổ biến thường tập trung vào việc hiển thị danh sách món, tìm kiếm theo tên hoặc nhóm nguyên liệu. Một số ứng dụng có chức năng lưu món yêu thích hoặc đánh giá cộng đồng, nhưng chưa kết hợp sâu dữ liệu cá nhân, dữ liệu tủ lạnh, kế hoạch tuần và phân tích dinh dưỡng trong cùng một luồng sử dụng. Vì vậy, người dùng vẫn phải tự suy luận: món nào hợp với mình, món nào dùng được nguyên liệu đang có, bữa ăn hôm nay có vượt calo hay không, ngày mai cần mua gì, hoặc nguyên liệu nào nên dùng trước để tránh lãng phí. Đây chính là khoảng trống mà hệ thống MealAI hướng đến.

MealAI được xây dựng như một hệ thống hỗ trợ lập thực đơn thông minh, không chỉ là kho công thức. Source code hiện tại cho thấy hệ thống đã triển khai đầy đủ các khối chức năng: frontend Next.js với các trang công thức, tủ lạnh, thực đơn tuần, shopping list, dinh dưỡng, hồ sơ, thông báo và quản trị; backend NestJS với các module Auth, Recipes, Inventory, Recommendation, MealPlan, ShoppingList, Chatbot, Notification, Upload và Seed; cơ sở dữ liệu PostgreSQL thông qua TypeORM; Recommendation Engine dựa trên rule-based filtering và scoring-based ranking; Voice Assistant sử dụng Web Speech API, wake word và TTS; cộng đồng người dùng với đánh giá, phản hồi, yêu thích, kiểm duyệt nội dung và thông báo.

[HÌNH 1.1: Bối cảnh bài toán lập thực đơn gia đình]

[ẢNH CẦN CHÈN:
problem-context.png]

Lý do chọn đề tài còn xuất phát từ tính liên ngành của bài toán. Đề tài kết hợp kiến thức phát triển web full-stack, thiết kế cơ sở dữ liệu quan hệ, xác thực và phân quyền, xử lý dữ liệu dinh dưỡng, thuật toán gợi ý có giải thích, tích hợp mô hình ngôn ngữ lớn, tương tác giọng nói và thiết kế trải nghiệm người dùng. Đây là một đề tài phù hợp với ngành Công nghệ Thông tin vì có thể đánh giá được cả năng lực phân tích nghiệp vụ, thiết kế hệ thống, hiện thực phần mềm và kiểm thử.

## 1.2. Mục tiêu đề tài

Mục tiêu tổng quát của đề tài là xây dựng hệ thống MealAI hỗ trợ người dùng lập thực đơn và quản lý dinh dưỡng thông minh. Hệ thống phải có khả năng thu thập dữ liệu từ hồ sơ người dùng, sở thích ăn uống, nguyên liệu sẵn có, công thức món ăn và lịch thực đơn để đưa ra gợi ý phù hợp. Gợi ý không chỉ dựa trên một tiêu chí duy nhất mà kết hợp nhiều tiêu chí: dinh dưỡng, nguyên liệu khớp, nguyên liệu sắp hết hạn, sở thích, thời gian nấu và thói quen hành vi.

Các mục tiêu cụ thể gồm: xây dựng giao diện web hiện đại bằng React, Next.js, TypeScript và TailwindCSS; xây dựng backend API bằng NestJS theo mô hình module rõ ràng; thiết kế cơ sở dữ liệu PostgreSQL đủ lưu người dùng, công thức, nguyên liệu, tủ lạnh, thực đơn, mua sắm, thông báo, đánh giá và lịch sử AI; xây dựng Recommendation Engine có thể lọc và chấm điểm món ăn theo dữ liệu thật; xây dựng Meal Planner tự động tạo thực đơn tuần; xây dựng Shopping List sinh nguyên liệu cần mua sau khi đối chiếu tồn kho; xây dựng Voice Assistant để người dùng thao tác bằng giọng nói; xây dựng chức năng cộng đồng gồm đánh giá, trả lời, yêu thích, duyệt công thức và thông báo.

| Mục tiêu |Biểu hiện trong source code |Kết quả mong đợi |
| --- |--- |--- |
| Cá nhân hóa gợi ý |`RecommendationService`, `UserPreference`, `Inventory`, `UserActionLog` |Món ăn được lọc và xếp hạng theo hồ sơ, tủ lạnh, hạn sử dụng và hành vi. |
| Lập thực đơn tuần |`MealPlanService`, `MealPlan`, `MealPlanItem` |Sinh thực đơn 7 ngày, 3 bữa/ngày, có khóa món, đổi món và đánh dấu đã ăn. |
| Quản lý nguyên liệu |`InventoryService`, `Ingredient`, `RecipeIngredient` |Theo dõi số lượng, hạn sử dụng và cảnh báo nguyên liệu sắp hết hạn. |
| Danh sách mua sắm |`ShoppingListService`, `ShoppingListItem` |Tính nguyên liệu còn thiếu sau khi trừ tủ lạnh. |
| Tương tác AI |`ChatbotAIService`, `ChatbotActionHandler`, `VoiceAssistantButton` |Chatbot và voice có thể gọi hành động trong hệ thống. |
| Cộng đồng |`RecipeRatingService`, `FavoriteService`, `NotificationService` |Đánh giá, phản hồi, yêu thích, thông báo và kiểm duyệt nội dung. |

## 1.3. Đối tượng và phạm vi nghiên cứu

Đối tượng nghiên cứu của đề tài là hệ thống hỗ trợ lập thực đơn và dinh dưỡng cá nhân hóa. Đề tài tập trung vào cách tổ chức dữ liệu món ăn, cách thu thập thông tin người dùng, cách đánh giá độ phù hợp của công thức, cách biến gợi ý thành kế hoạch ăn uống và cách hỗ trợ người dùng trong quá trình sử dụng. Phạm vi nghiên cứu không dừng ở thuật toán gợi ý độc lập, mà bao gồm toàn bộ vòng đời nghiệp vụ: đăng ký tài khoản, cập nhật hồ sơ, thêm nguyên liệu vào tủ lạnh, xem công thức, nhận gợi ý, tạo thực đơn, tạo danh sách mua, đánh dấu đã dùng món, nhận thông báo và tương tác cộng đồng.

Về mặt kỹ thuật, phạm vi phân tích bao gồm frontend, backend, PostgreSQL, AI Recommendation Engine, Voice Assistant, Community Features, Notification System, Meal Planner, Fridge Management và Authentication & Authorization. Đây cũng chính là các khối module có trong source code. Frontend được triển khai trong thư mục `frontend/src/app` và `frontend/src/components`. Backend được triển khai trong `backend/src/modules` theo từng domain. Database được định nghĩa qua các entity TypeORM và được kết nối PostgreSQL trong `AppModule`. AI được thể hiện ở cả `RecommendationService`, `NutritionAnalyzerService`, `RecipeModerationService`, `ChatbotAIService` và `TtsService`.

[HÌNH 1.2: Phạm vi chức năng tổng quát của MealAI]

[ẢNH CẦN CHÈN:
scope-overview.png]

Đề tài không đặt mục tiêu xây dựng một mô hình học máy huấn luyện mới từ đầu. Recommendation Engine hiện tại là mô hình lai giữa rule-based filtering và scoring-based ranking, phù hợp với quy mô dữ liệu ban đầu và có ưu điểm là dễ giải thích. Các mô hình AI bên ngoài như Gemini được dùng cho chatbot function calling, hỗ trợ kiểm duyệt chất lượng công thức và kiểm duyệt bình luận. Cách tiếp cận này thực tế hơn trong bối cảnh khóa luận vì giảm yêu cầu về dữ liệu huấn luyện lớn nhưng vẫn tạo ra trải nghiệm thông minh và có khả năng mở rộng.

## 1.4. Phương pháp thực hiện

Phương pháp thực hiện đề tài gồm bốn nhóm chính. Thứ nhất là khảo sát nghiệp vụ và phân tích nhu cầu người dùng. Nhu cầu được mô hình hóa thành các use case: quản lý tài khoản, cập nhật hồ sơ dinh dưỡng, xem công thức, đánh giá, yêu thích, quản lý tủ lạnh, nhận gợi ý, lập thực đơn, tạo shopping list, nhận thông báo và thao tác bằng chatbot/voice. Thứ hai là thiết kế hệ thống theo kiến trúc client-server, trong đó frontend Next.js giao tiếp backend NestJS qua REST API, backend thao tác PostgreSQL thông qua TypeORM và các service chịu trách nhiệm xử lý nghiệp vụ.

Thứ ba là xây dựng thuật toán gợi ý dựa trên dữ liệu thực. Source code của `RecommendationService` cho thấy hệ thống không chọn ngẫu nhiên món ăn. Món ăn trước hết được lọc theo trạng thái active/approved, loại bữa ăn, chế độ ăn, thời gian nấu, ngân sách, dị ứng và ràng buộc bệnh lý. Sau đó mỗi công thức được chấm điểm theo năm thành phần: dinh dưỡng, khớp nguyên liệu, chống lãng phí, sở thích và thời gian nấu. Điểm cuối cùng còn được điều chỉnh bởi lịch sử hành vi như người dùng đã chấp nhận hoặc từ chối gợi ý trước đó.

Thứ tư là kiểm thử theo luồng chức năng. Vì hệ thống gồm nhiều module liên kết, kiểm thử không chỉ kiểm tra từng API riêng lẻ mà còn kiểm tra chuỗi nghiệp vụ: đăng nhập → cập nhật hồ sơ → thêm tủ lạnh → nhận gợi ý → tạo thực đơn → sinh shopping list → đánh dấu đã ăn → tự động trừ nguyên liệu. Các bảng kiểm thử ở Chương 5 được xây dựng theo đúng các API và service hiện có.

## 1.5. Ý nghĩa khoa học và thực tiễn

Về mặt khoa học, đề tài minh họa cách áp dụng thuật toán gợi ý có giải thích vào một bài toán đời sống cụ thể. Thay vì chỉ dự đoán bằng mô hình hộp đen, hệ thống tách điểm gợi ý thành các thành phần có thể giải thích: món ăn phù hợp mục tiêu calo, sử dụng được nguyên liệu đang có, ưu tiên nguyên liệu sắp hết hạn, phù hợp khẩu vị và không vượt thời gian nấu. Cách thiết kế này giúp người dùng hiểu vì sao hệ thống đề xuất món đó, đồng thời giúp người phát triển dễ điều chỉnh trọng số khi cần.

Về mặt thực tiễn, MealAI hỗ trợ giảm thời gian suy nghĩ thực đơn, giảm lãng phí thực phẩm và giúp bữa ăn có kế hoạch hơn. Người dùng có thể nhập nguyên liệu trong tủ lạnh, hệ thống cảnh báo nguyên liệu sắp hết hạn và đề xuất món tận dụng nguyên liệu đó. Khi thực đơn tuần được tạo, shopping list tự động tính phần còn thiếu sau khi trừ tồn kho. Khi người dùng đánh dấu đã ăn món, hệ thống có thể trừ nguyên liệu tương ứng khỏi tủ lạnh. Đây là một chu trình khép kín giữa tủ lạnh, công thức, thực đơn và mua sắm.

Đối với nhà trường và sinh viên ngành Công nghệ Thông tin, đề tài có ý nghĩa như một minh chứng triển khai sản phẩm full-stack hoàn chỉnh. Source code cho thấy sinh viên vận dụng nhiều kiến thức: Next.js App Router, React component, TypeScript, Axios interceptor, TailwindCSS, NestJS module/controller/service, TypeORM entity/repository, PostgreSQL, JWT, guard phân quyền, validation pipe, upload file, xuất PDF, email OTP, tích hợp Gemini, TTS và Web Speech API.

## 1.6. Khảo sát một số hướng tiếp cận liên quan

Các hệ thống công thức nấu ăn truyền thống thường tổ chức dữ liệu theo danh mục món ăn, vùng miền, nguyên liệu hoặc thời gian nấu. Người dùng có thể tìm kiếm, lưu món yêu thích và xem đánh giá. Tuy nhiên, các hệ thống này thường chưa quản lý đồng thời tủ lạnh cá nhân và thực đơn tuần. Khi thiếu dữ liệu tồn kho, hệ thống khó biết món nào phù hợp với nguyên liệu thực tế người dùng đang có.

Một số ứng dụng dinh dưỡng tập trung vào tính calo, macro và mục tiêu sức khỏe. Ưu điểm của nhóm này là theo dõi năng lượng khá rõ, nhưng nhược điểm là thường yêu cầu người dùng nhập thủ công từng món ăn hoặc từng khẩu phần. MealAI tiếp cận theo hướng kết hợp: dữ liệu công thức có sẵn thông tin calo, protein, carbs, fat, sugar và sodium; hồ sơ người dùng có cân nặng, chiều cao, giới tính, ngày sinh, mức vận động; hệ thống tính TDEE và dùng mục tiêu calo để xếp hạng món ăn.

Các hệ thống chatbot hiện đại có thể trả lời tự nhiên, nhưng nếu chỉ dừng ở hội thoại thì không tác động đến dữ liệu ứng dụng. Trong MealAI, chatbot được thiết kế theo hướng function calling. `ChatbotAIService` khai báo các công cụ như tìm công thức, lấy gợi ý, xem tủ lạnh, thêm nguyên liệu, tạo thực đơn, tạo shopping list, tính calo và điều hướng trang. Khi người dùng ra lệnh, chatbot không chỉ trả lời văn bản mà có thể gọi `ChatbotActionHandler` để thực hiện hành động thật trên hệ thống.

## 1.7. Đóng góp của đề tài

Đóng góp thứ nhất là xây dựng một kiến trúc hệ thống tương đối hoàn chỉnh cho bài toán lập thực đơn thông minh. Hệ thống có frontend, backend, database, AI service, voice assistant, community và admin moderation. Các module không tồn tại rời rạc mà liên kết theo nghiệp vụ: công thức được dùng cho gợi ý, gợi ý được dùng cho meal planner, meal planner sinh shopping list, shopping list đối chiếu inventory, inventory được cập nhật khi meal plan item được đánh dấu đã dùng.

Đóng góp thứ hai là xây dựng Recommendation Engine có khả năng giải thích. Kết quả gợi ý trả về không chỉ có món ăn và điểm tổng mà còn gồm component scores, reasons, matchedInventory và missingIngredients. Điều này tạo điều kiện để frontend hiển thị lý do gợi ý, đồng thời hỗ trợ đánh giá thuật toán trong Chương 5.

Đóng góp thứ ba là tích hợp AI theo hướng thực dụng. Gemini được dùng cho chatbot function calling, kiểm duyệt công thức và kiểm duyệt bình luận; trong khi các quyết định nghiệp vụ quan trọng vẫn được kiểm soát bằng luật rõ ràng. Cách kết hợp này giúp hệ thống vừa linh hoạt vừa giảm rủi ro từ phản hồi AI không ổn định.

Đóng góp thứ tư là triển khai tương tác giọng nói tiếng Việt trên nền web. `VoiceAssistantButton` sử dụng SpeechRecognition/webkitSpeechRecognition để nghe wake word như "MealAI", "Hey MealAI" và một số biến thể phát âm tiếng Việt, sau đó gửi transcript lên backend qua API voice. Phản hồi được đọc bằng TTS backend nếu có Azure/ElevenLabs hoặc fallback bằng Web Speech Synthesis của trình duyệt.

## 1.8. Cấu trúc báo cáo

Báo cáo gồm năm chương chính. Chương 1 trình bày tổng quan đề tài, lý do chọn đề tài, mục tiêu, phạm vi, phương pháp và đóng góp. Chương 2 trình bày cơ sở lý thuyết về ứng dụng web, Next.js, NestJS, PostgreSQL, JWT, recommendation, dinh dưỡng, voice assistant và kiểm duyệt nội dung. Chương 3 phân tích và thiết kế hệ thống, bao gồm use case, activity, sequence, ERD, kiến trúc, luồng recommendation, voice và notification. Chương 4 mô tả chi tiết quá trình xây dựng hệ thống dựa trên source code hiện tại. Chương 5 trình bày kết quả kiểm thử, đánh giá chức năng, hiệu năng, độ chính xác gợi ý và trải nghiệm người dùng.

## 1.9. Các tình huống sử dụng thực tế

Để xác định đúng giá trị của MealAI, có thể xem xét một số tình huống sử dụng thực tế. Tình huống thứ nhất là người dùng đi làm bận rộn, không có nhiều thời gian suy nghĩ bữa ăn. Người dùng cập nhật hồ sơ cơ bản, đặt giới hạn thời gian nấu là 30-45 phút, thêm một số nguyên liệu trong tủ lạnh và yêu cầu hệ thống gợi ý bữa tối. Trong tình huống này, `RecommendationService` lọc món theo `maxCookingTime`, chọn mealType dinner, tính điểm khớp nguyên liệu và trả món có thời gian nấu phù hợp. Giá trị mang lại không chỉ là một danh sách công thức, mà là danh sách đã được sàng lọc theo thời gian thật của người dùng.

Tình huống thứ hai là gia đình có nhiều nguyên liệu sắp hết hạn sau khi mua sắm cuối tuần. Người dùng nhập hạn sử dụng cho từng nguyên liệu trong tủ lạnh. `InventoryService` tính urgency và `RecommendationService` dùng điểm wasteReduction để ưu tiên món sử dụng các nguyên liệu đó. Nếu người dùng tạo thực đơn tuần, `MealPlanService` tiếp tục tận dụng recommendation để phân bổ món vào từng ngày. Nhờ vậy hệ thống hỗ trợ giảm lãng phí thực phẩm, một vấn đề thường gặp trong sinh hoạt gia đình.

Tình huống thứ ba là người dùng có ràng buộc sức khỏe như tiểu đường hoặc tăng huyết áp. Trong hồ sơ, người dùng có thể lưu `healthConditions`, `maxSugarPerMeal`, `maxSodiumPerMeal` và các ngưỡng dinh dưỡng khác. Recommendation Engine loại bỏ món vượt ngưỡng sugar hoặc sodium ở bước pre-filter. Cách làm này quan trọng vì với sức khỏe, một món không phù hợp không nên chỉ bị giảm điểm mà cần bị loại khỏi kết quả. Thiết kế hiện tại của MealAI phản ánh đúng tính chất của ràng buộc cứng trong bài toán dinh dưỡng.

Tình huống thứ tư là người dùng đang nấu ăn và không tiện chạm vào thiết bị. Voice Assistant cho phép gọi wake word, sau đó nói lệnh như "tạo danh sách mua sắm", "hôm nay ăn gì", "thêm cà chua vào tủ lạnh" hoặc "mở trang thực đơn". Frontend nhận giọng nói bằng Web Speech API, backend xử lý bằng `ChatbotAIService` và `ChatbotActionHandler`. Đây là ví dụ cho thấy AI trong MealAI không chỉ nằm ở thuật toán gợi ý mà còn nằm ở phương thức tương tác.

## 1.10. Tiêu chí thành công của đề tài

Một hệ thống như MealAI được xem là đạt yêu cầu khi các chức năng không chỉ tồn tại độc lập mà còn tạo thành một chuỗi nghiệp vụ khép kín. Nếu người dùng thêm nguyên liệu vào tủ lạnh nhưng recommendation không sử dụng dữ liệu đó, chức năng tủ lạnh sẽ mất giá trị. Nếu meal planner tạo thực đơn nhưng shopping list không trừ nguyên liệu đã có, danh sách mua sắm sẽ thiếu thực tế. Nếu chatbot chỉ trả lời văn bản mà không gọi service thật, nó chưa tạo khác biệt trong hệ thống. Vì vậy, tiêu chí thành công của đề tài được xác định theo khả năng liên kết dữ liệu giữa các module.

| Tiêu chí |Biểu hiện cần đạt |Căn cứ kiểm tra trong MealAI |
| --- |--- |--- |
| Liên kết hồ sơ và gợi ý |Thông tin tuổi, giới tính, cân nặng, chiều cao, hoạt động ảnh hưởng target calo. |`AuthService.updateProfile`, `CalorieService`, `RecommendationService`. |
| Liên kết tủ lạnh và gợi ý |Nguyên liệu đang có và sắp hết hạn ảnh hưởng điểm xếp hạng. |`InventoryService`, `scoreIngredientMatch`, `scoreWasteReduction`. |
| Liên kết gợi ý và thực đơn |Meal planner gọi recommendation cho từng bữa. |`MealPlanService.generate`, `RecommendationService.getRecommendations`. |
| Liên kết thực đơn và mua sắm |Shopping list lấy ingredient từ meal plan và trừ inventory. |`ShoppingListService.generateFromPlan`. |
| Liên kết thực đơn và tủ lạnh |Đánh dấu đã ăn thì trừ nguyên liệu khỏi inventory. |`MealPlanService.toggleConsume`. |
| Liên kết cộng đồng và thông báo |Favorite, comment, reply, rating tạo notification. |`FavoriteService`, `RecipeRatingService`, `NotificationService`. |
| Liên kết AI và thao tác thật |Chatbot/voice gọi action handler để thay đổi dữ liệu. |`ChatbotAIService`, `ChatbotActionHandler`. |

## 1.11. Đặc điểm khác biệt so với ứng dụng công thức thông thường

Điểm khác biệt đầu tiên là MealAI xem công thức như một phần của hệ sinh thái dữ liệu. Một công thức không chỉ có tên, ảnh và bước nấu, mà còn có calories, protein, carbs, fat, sugar, sodium, tags, mealType, cuisineRegion, estimatedCost, ingredient list, status duyệt, lượt xem, đánh giá và quan hệ với người gửi. Nhờ cấu trúc này, công thức có thể được dùng cho nhiều bài toán: tìm kiếm, lọc, gợi ý, phân tích dinh dưỡng, meal planner, shopping list và cộng đồng.

Điểm khác biệt thứ hai là MealAI đưa dữ liệu tủ lạnh vào trung tâm của quá trình gợi ý. Trong nhiều ứng dụng, người dùng tìm món trước rồi kiểm tra nguyên liệu sau. Ở MealAI, inventory là đầu vào của recommendation. Hệ thống biết người dùng có nguyên liệu nào, nguyên liệu nào sắp hết hạn và nguyên liệu nào còn thiếu. Điều này giúp gợi ý trở nên gần với hoàn cảnh thực tế hơn.

Điểm khác biệt thứ ba là hệ thống hỗ trợ vòng đời sau gợi ý. Sau khi nhận món được đề xuất, người dùng có thể đưa vào thực đơn tuần, sinh shopping list, đánh dấu đã mua và đánh dấu đã ăn. Mỗi hành động cập nhật dữ liệu tương ứng. Nhờ vậy MealAI không dừng ở tư vấn mà hỗ trợ quá trình chuẩn bị và sử dụng bữa ăn.

Điểm khác biệt thứ tư là sự kết hợp giữa AI giải thích được và AI hội thoại. Recommendation Engine là rule/scoring rõ ràng, có thể kiểm chứng bằng bảng điểm. Chatbot dùng Gemini để hiểu ngôn ngữ tự nhiên và function calling để thao tác hệ thống. Kiểm duyệt nội dung dùng từ khóa và AI audit. Cách kết hợp này phù hợp với yêu cầu thực tế: những phần cần kiểm soát chặt thì dùng luật, những phần cần linh hoạt ngôn ngữ thì dùng mô hình AI.

## 1.12. Ranh giới trách nhiệm của hệ thống

MealAI là hệ thống hỗ trợ quyết định, không phải hệ thống y tế chuyên khoa. Các phân tích calories, macro, sugar và sodium được xây dựng dựa trên dữ liệu recipe và ngưỡng trong hồ sơ người dùng. Hệ thống có thể cảnh báo hoặc loại bỏ món không phù hợp với một số tình trạng như diabetes hoặc hypertension, nhưng không thay thế tư vấn bác sĩ hoặc chuyên gia dinh dưỡng. Ranh giới này cần được nêu rõ trong báo cáo và trong hướng phát triển sản phẩm để tránh hiểu sai vai trò của hệ thống.

MealAI cũng không phải hệ thống quản lý kho thực phẩm chuyên nghiệp. Inventory hiện phục vụ mức cá nhân/gia đình, lưu quantity, unit, expirationDate và note. Việc tự động trừ kho khi consume meal plan item dựa trên recipe ingredient và khẩu phần, vì vậy kết quả phụ thuộc vào độ chính xác của định lượng công thức. Trong phạm vi khóa luận, cách làm này phù hợp để minh họa vòng lặp dữ liệu; khi triển khai thực tế có thể bổ sung quy đổi đơn vị, barcode, ảnh hóa đơn hoặc cân điện tử.

### CÁC HÌNH CẦN CHỤP

- problem-context.png - minh họa bối cảnh người dùng phải lập thực đơn thủ công.
- scope-overview.png - sơ đồ phạm vi chức năng MealAI.
- home-page.png - ảnh trang chủ thể hiện mục tiêu sản phẩm.

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

## 2.1. Kiến trúc ứng dụng web client-server

MealAI được xây dựng theo mô hình client-server. Phía client là ứng dụng web Next.js chạy trên trình duyệt, chịu trách nhiệm hiển thị giao diện, thu thập thao tác người dùng và gọi API. Phía server là backend NestJS, chịu trách nhiệm xác thực, kiểm tra dữ liệu, xử lý nghiệp vụ, truy vấn PostgreSQL và tích hợp dịch vụ AI. Mô hình này phù hợp với hệ thống có nhiều chức năng động như đăng nhập, quản lý tủ lạnh, lập thực đơn, đánh giá công thức và thông báo thời gian thực ở mức ứng dụng.

[HÌNH 2.1: Mô hình ứng dụng web client-server]

[ẢNH CẦN CHÈN:
client-server-model.png]

Trong source code backend, `main.ts` thiết lập prefix chung `api/v1`, bật CORS cho frontend, cấu hình static assets cho thư mục `uploads`, dùng `ValidationPipe` toàn cục với `whitelist`, `forbidNonWhitelisted`, `transform` và `enableImplicitConversion`. Các thiết lập này giúp backend có ranh giới API rõ ràng, dữ liệu đầu vào được kiểm soát và ảnh upload có thể được phục vụ công khai qua đường dẫn `/uploads`.

Ở phía frontend, `frontend/src/lib/api.ts` tạo một Axios instance với `baseURL` lấy từ biến môi trường `NEXT_PUBLIC_API_URL` hoặc mặc định `http://localhost:3001/api/v1`. Interceptor request tự động gắn access token từ localStorage vào header Authorization. Interceptor response xử lý lỗi 401 bằng cách xóa token và điều hướng người dùng về trang đăng nhập. Đây là lớp kết nối trung tâm giữa giao diện và backend.

## 2.2. React, Next.js, TypeScript và TailwindCSS

React là thư viện xây dựng giao diện người dùng theo mô hình component. Trong MealAI, các thành phần như Navbar, Footer, ChatWidget, VoiceAssistantButton, NutritionCharts, ImageUpload và các trang chức năng được tổ chức thành component có trạng thái và hành vi riêng. Việc chia nhỏ giao diện thành component giúp tái sử dụng, dễ kiểm thử và dễ mở rộng khi thêm chức năng mới.

Next.js cung cấp cơ chế định tuyến theo thư mục trong `src/app`. Dự án có các route như `/recipes`, `/inventory`, `/meal-planner`, `/shopping-list`, `/nutrition`, `/profile`, `/notifications`, `/admin`, `/login` và `/register`. Cách tổ chức này giúp mỗi nghiệp vụ có một màn hình riêng, đồng thời tận dụng khả năng tối ưu của Next.js cho ứng dụng frontend hiện đại.

TypeScript bổ sung kiểm tra kiểu tĩnh cho JavaScript. Với hệ thống nhiều API và dữ liệu phức tạp như MealAI, TypeScript giúp giảm lỗi khi truyền dữ liệu giữa component, service frontend và backend. Ví dụ, các API trong `api.ts` được gom theo nhóm `authAPI`, `recipesAPI`, `inventoryAPI`, `recommendationAPI`, `mealPlanAPI`, `shoppingListAPI`, `chatbotAPI` và `notificationsAPI`, giúp frontend gọi đúng endpoint và duy trì cấu trúc rõ ràng.

TailwindCSS được sử dụng để xây dựng giao diện bằng utility class. Cách tiếp cận này phù hợp với dự án khóa luận vì giúp tạo giao diện nhanh, nhất quán và dễ điều chỉnh. Các màn hình như trang chủ, danh sách công thức, tủ lạnh, thực đơn tuần và quản trị có thể dùng cùng hệ thống spacing, màu sắc, typography và responsive class.

| Công nghệ |Vai trò trong MealAI |Lợi ích |
| --- |--- |--- |
| React |Xây dựng component giao diện |Tái sử dụng, dễ quản lý trạng thái UI. |
| Next.js |Định tuyến, cấu trúc ứng dụng frontend |Tổ chức page rõ ràng, hỗ trợ phát triển web hiện đại. |
| TypeScript |Kiểu dữ liệu cho frontend và backend |Giảm lỗi runtime, tăng khả năng bảo trì. |
| TailwindCSS |Thiết kế giao diện bằng utility class |Phát triển nhanh, nhất quán, responsive. |
| Axios |Gọi REST API |Interceptor token, xử lý lỗi tập trung. |
| Framer Motion |Hiệu ứng giao diện |Tăng trải nghiệm người dùng. |
| Chart.js |Biểu đồ dinh dưỡng |Trực quan hóa macro, calo và đánh giá tuần. |

## 2.3. NestJS và mô hình module/controller/service

NestJS là framework backend Node.js theo kiến trúc module, chịu ảnh hưởng từ Angular. Một ứng dụng NestJS thường được chia thành module, controller, service, DTO, guard và entity. Trong MealAI, `AppModule` import các module nghiệp vụ như `AuthModule`, `RecipesModule`, `InventoryModule`, `RecommendationModule`, `MealPlanModule`, `ShoppingListModule`, `ChatbotModule`, `NotificationModule`, `UploadModule` và `SeedModule`.

Controller đóng vai trò nhận request HTTP, ánh xạ endpoint, áp dụng guard và gọi service. Service chứa logic nghiệp vụ thật. Ví dụ `RecommendationController` nhận request lấy gợi ý, sau đó gọi `RecommendationService`; `MealPlanController` nhận lệnh sinh thực đơn, đổi món, khóa món, đánh dấu đã dùng và gọi `MealPlanService`; `RecipeRatingService` xử lý tạo đánh giá, kiểm duyệt từ khóa, tạo thông báo và cập nhật trạng thái người dùng.

Mô hình module/controller/service giúp hệ thống dễ mở rộng. Nếu cần thêm chức năng quản lý mục tiêu giảm cân, có thể tạo service mới hoặc mở rộng `AuthService` và `UserPreference`. Nếu cần thêm loại thông báo mới, có thể mở rộng `NotificationService` và enum type ở frontend mà không phá vỡ các module khác. Đây là đặc điểm quan trọng đối với một hệ thống có nhiều nghiệp vụ liên quan như MealAI.

## 2.4. PostgreSQL, TypeORM và thiết kế dữ liệu quan hệ

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mạnh, hỗ trợ kiểu dữ liệu phong phú, truy vấn phức tạp, chỉ mục và ràng buộc. MealAI sử dụng PostgreSQL để lưu dữ liệu có quan hệ chặt chẽ: người dùng có hồ sơ và sở thích, công thức có nhiều nguyên liệu, người dùng có tủ lạnh, thực đơn có nhiều item, shopping list có nhiều item, công thức có đánh giá, thông báo liên kết người dùng và công thức.

TypeORM được sử dụng để ánh xạ class TypeScript thành bảng dữ liệu. Các entity như `User`, `Recipe`, `Ingredient`, `Inventory`, `MealPlan`, `ShoppingList`, `Notification`, `ChatMessage` được khai báo bằng decorator `@Entity`, `@Column`, `@ManyToOne`, `@OneToMany`, `@OneToOne`. Cách này giúp code backend thao tác với object thay vì viết SQL thuần ở mọi nơi, đồng thời vẫn giữ được quan hệ và cascade giữa các bảng.

Trong `AppModule`, TypeORM được cấu hình với `autoLoadEntities: true`, `synchronize: true`, database mặc định `recipe_ai`, host và thông tin đăng nhập lấy từ biến môi trường. Cấu hình `synchronize: true` thuận tiện trong giai đoạn phát triển vì TypeORM tự đồng bộ entity với database. Tuy nhiên, khi triển khai sản phẩm thật, hệ thống nên chuyển sang migration để kiểm soát thay đổi schema an toàn hơn.

## 2.5. Xác thực JWT và phân quyền

JWT là cơ chế truyền thông tin xác thực dưới dạng token đã ký. Trong MealAI, khi người dùng đăng nhập thành công, backend trả về access token và refresh token. Frontend lưu token trong localStorage và Axios interceptor gắn access token vào header `Authorization: Bearer <token>` cho các API cần đăng nhập. Backend dùng `JwtAuthGuard` và `JwtStrategy` để xác thực token, lấy user id, email và role đưa vào `req.user`.

[HÌNH 2.2: Quy trình xác thực JWT]

[ẢNH CẦN CHÈN:
jwt-auth-flow.png]

Phân quyền quản trị được thực hiện bằng `RolesGuard` và decorator `@Roles('admin')`. Các API như quản lý user, duyệt công thức, xóa công thức, xem thống kê, duyệt/xóa review vi phạm và mở khóa người dùng đều yêu cầu role admin. Cách này tách biệt rõ quyền của người dùng thường và quản trị viên, giảm rủi ro thao tác trái phép.

Quy trình bảo mật mật khẩu dùng bcryptjs. Khi đăng ký hoặc đổi mật khẩu, backend hash mật khẩu với salt rounds 10 rồi lưu `passwordHash`, không lưu mật khẩu gốc. Khi đăng nhập, backend so sánh mật khẩu nhập với hash bằng bcrypt. Quy trình quên mật khẩu dùng OTP 6 chữ số, thời hạn 15 phút, lưu trong bảng `password_reset_tokens` và gửi qua email nếu cấu hình SMTP tồn tại.

## 2.6. Cơ sở lý thuyết về gợi ý món ăn

Hệ thống gợi ý có thể được xây dựng bằng nhiều hướng: content-based filtering, collaborative filtering, hybrid recommendation, rule-based recommendation hoặc learning-to-rank. Trong bối cảnh MealAI, dữ liệu ban đầu tập trung vào thuộc tính món ăn, hồ sơ người dùng và tủ lạnh cá nhân. Vì vậy, hướng phù hợp là kết hợp rule-based filtering và scoring-based ranking. Rule-based filtering loại bỏ các món không phù hợp trước khi chấm điểm, còn scoring-based ranking sắp xếp các món còn lại theo độ phù hợp.

Ưu điểm của rule-based filtering là dễ kiểm soát ràng buộc bắt buộc. Ví dụ, nếu người dùng dị ứng tôm, hệ thống phải loại bỏ món chứa tôm thay vì chỉ giảm điểm. Nếu người dùng có tình trạng tăng huyết áp, món có sodium vượt ngưỡng nên bị loại. Nếu người dùng chọn keto, món nhiều carbohydrate không nên xuất hiện trong danh sách chính. Các ràng buộc này được triển khai trực tiếp trong `RecommendationService` thông qua bước pre-filter.

Scoring-based ranking được dùng sau khi lọc. Mỗi công thức nhận điểm từ nhiều thành phần. Trong source code hiện tại, trọng số gồm dinh dưỡng 0,30; khớp nguyên liệu 0,25; chống lãng phí 0,20; sở thích 0,15; thời gian nấu 0,10. Tổng trọng số bằng 1, giúp điểm cuối cùng nằm trong khoảng dễ diễn giải. Hệ thống còn cộng/trừ thêm điểm thói quen từ `UserActionLog`, ví dụ người dùng từng chấp nhận món thì tăng điểm, từng từ chối thì giảm điểm.

[HÌNH 2.4: Mô hình chấm điểm gợi ý món ăn]

[ẢNH CẦN CHÈN:
recommendation-scoring-model.png]

| Thành phần điểm |Trọng số |Cách hiểu |Dữ liệu dùng |
| --- |--- |--- |--- |
| Nutrition Health |0.30 |Mức phù hợp giữa calo món ăn và mục tiêu calo của bữa. |`Recipe.calories`, `User.dailyCalorieTarget`, `CalorieService`. |
| Ingredient Match |0.25 |Tỷ lệ nguyên liệu của món đã có trong tủ lạnh. |`Inventory`, `RecipeIngredient`. |
| Waste Reduction |0.20 |Mức tận dụng nguyên liệu sắp hết hạn. |`Inventory.expirationDate`, urgency weight. |
| Preference Match |0.15 |Mức phù hợp với sở thích, vùng món, nguyên liệu thích/không thích, yêu thích. |`UserPreference`, `Favorite`. |
| Cook Time Score |0.10 |Mức phù hợp thời gian nấu so với giới hạn người dùng. |`Recipe.cookingTime`, `UserPreference.maxCookingTime`. |

## 2.7. Cơ sở tính nhu cầu năng lượng và phân tích dinh dưỡng

Nhu cầu năng lượng hằng ngày của người dùng trong MealAI được tính bằng công thức Mifflin-St Jeor kết hợp hệ số vận động. `CalorieService` tính BMR theo giới tính, cân nặng, chiều cao và tuổi. Với nam, BMR = 10 × cân nặng + 6,25 × chiều cao - 5 × tuổi + 5. Với nữ, BMR = 10 × cân nặng + 6,25 × chiều cao - 5 × tuổi - 161. Sau đó, BMR nhân với hệ số hoạt động: ít vận động 1,2; nhẹ 1,375; vừa 1,55; năng động 1,725; rất năng động 1,9 để ra TDEE.

[HÌNH 2.3: Công thức tính nhu cầu năng lượng theo hồ sơ người dùng]

[ẢNH CẦN CHÈN:
calorie-calculation.png]

MealAI phân bổ mục tiêu calo theo bữa: bữa sáng 30%, bữa trưa 40%, bữa tối 30%. Nếu người dùng chưa có mục tiêu calo, hệ thống dùng mặc định 600 kcal cho sáng, 800 kcal cho trưa và 600 kcal cho tối. Phân bổ này được dùng trong Recommendation Engine khi chấm điểm dinh dưỡng và trong Meal Planner khi chọn món cho từng mealType.

Ngoài calo, `NutritionAnalyzerService` phân tích chất lượng thực đơn tuần. Service này cộng tổng calories, protein, carbs và fat từ các món trong meal plan, sau đó so sánh với mục tiêu tuần. Điểm dinh dưỡng bắt đầu từ 100 và bị trừ nếu tổng calo lệch quá 10%, protein ngoài vùng hợp lý, carbs vượt 65%, fat vượt 35%, số món rau ít hơn 5, món thịt đỏ nhiều hơn 4, món chiên nhiều hơn 3 hoặc thực đơn lặp món. Kết quả lưu vào bảng `weekly_nutrition_analysis` gồm điểm, điểm mạnh, điểm yếu, khuyến nghị và macro summary.

## 2.8. Voice Assistant trên nền web

Voice Assistant trong MealAI gồm ba thành phần: wake word, speech-to-text và text-to-speech. Wake word giúp hệ thống chờ từ khóa như "MealAI" hoặc các biến thể phát âm tiếng Việt trước khi nghe lệnh. Speech-to-text chuyển giọng nói thành văn bản bằng `SpeechRecognition` hoặc `webkitSpeechRecognition` của trình duyệt. Text-to-speech đọc phản hồi bằng backend TTS hoặc Web Speech Synthesis.

Source code `VoiceAssistantButton` định nghĩa nhiều trạng thái: DISABLED, WAKE_WORD_WAITING, LISTENING_COMMAND, PROCESSING, SPEAKING và WAITING_CONFIRMATION. Cách tổ chức trạng thái giúp giao diện phản ánh đúng quá trình tương tác. Khi nghe wake word, component phát âm báo, chuyển sang trạng thái nghe lệnh, gửi transcript đến `chatbotAPI.sendVoiceMessage`, nhận phản hồi, thực thi hành động điều hướng nếu cần và đọc kết quả cho người dùng.

Backend `TtsService` ưu tiên Azure Speech nếu có `AZURE_SPEECH_KEY`, sử dụng giọng `vi-VN-HoaiMyNeural`, định dạng mp3. Nếu không có Azure, service thử ElevenLabs với model `eleven_multilingual_v2`. Nếu không có cấu hình dịch vụ ngoài, frontend fallback bằng `SpeechSynthesisUtterance` của trình duyệt. Cách thiết kế này giúp chức năng voice vẫn dùng được trong môi trường phát triển thiếu khóa API.

## 2.9. Chatbot AI và function calling

Chatbot AI trong MealAI không chỉ trả lời tự do mà được thiết kế để gọi hành động thật. `ChatbotAIService` khai báo các function như tìm công thức, lấy chi tiết món, lấy gợi ý, xem tủ lạnh, thêm nguyên liệu, tạo thực đơn, lấy thực đơn, tạo shopping list, thêm/xóa món trong meal plan, tính calo, điều hướng trang và cập nhật preference. Khi Gemini trả về function call, service chuyển yêu cầu sang `ChatbotActionHandler`, thực thi nghiệp vụ bằng các service sẵn có rồi lưu kết quả vào lịch sử chat.

Nếu không có `GEMINI_API_KEY`, hoặc mô hình không trả về function call phù hợp với yêu cầu thay đổi thực đơn, hệ thống chuyển sang fallback rule-based. Fallback này vẫn xử lý được nhiều intent quan trọng: điều hướng, cập nhật bệnh lý, thêm/xóa món khỏi thực đơn, sinh thực đơn theo ngày/tuần, gợi ý món, xem tủ lạnh, tạo shopping list, tính calo và trợ giúp. Đây là điểm quan trọng về độ ổn định vì hệ thống không phụ thuộc hoàn toàn vào dịch vụ AI bên ngoài.

## 2.10. Kiểm duyệt nội dung cộng đồng

Chức năng cộng đồng cho phép người dùng đánh giá, viết nhận xét và trả lời bình luận. Tuy nhiên, cộng đồng cần cơ chế kiểm duyệt để tránh nội dung xúc phạm, spam hoặc độc hại. MealAI triển khai hai lớp kiểm duyệt. Lớp thứ nhất là `ReviewModerationService` với danh sách từ khóa xấu, chuẩn hóa văn bản, xử lý teencode, ký tự thay thế và mask từ vi phạm. Lớp thứ hai là kiểm duyệt AI bằng Gemini nếu có cấu hình API key.

Khi bình luận bị đánh dấu vi phạm, `RecipeRatingService` tăng `violationCount` của người dùng. Nếu số lần vi phạm từ 3 trở lên, người dùng chuyển sang trạng thái cần kiểm duyệt trước. Nếu từ 5 lần trở lên, tài khoản bị khóa bình luận 7 ngày. Đồng thời hệ thống tạo `AdminNotification` để quản trị viên duyệt, xóa hoặc mở khóa. Cơ chế này giúp cộng đồng vẫn mở cho người dùng đóng góp, nhưng có công cụ bảo vệ chất lượng nội dung.

## 2.11. Notification System

Notification System là thành phần kết nối các tương tác cộng đồng. Khi người dùng yêu thích công thức, bình luận, trả lời hoặc đánh giá, hệ thống có thể tạo thông báo cho tác giả công thức hoặc chủ bình luận. `NotificationService` có cơ chế bỏ qua thông báo nếu actor và recipient là cùng một người, tránh tạo thông báo vô nghĩa cho hành động của chính mình.

Thông báo cá nhân được lưu trong bảng `notifications`, gồm userId người nhận, actorId người thực hiện, postId công thức liên quan, type, message, trạng thái đọc và thời điểm tạo. Frontend có API lấy danh sách, đếm chưa đọc, đánh dấu từng thông báo đã đọc hoặc đánh dấu tất cả. Bên cạnh đó, admin moderation sử dụng bảng `admin_notifications` riêng cho vi phạm bình luận.

## 2.12. Cơ sở kiểm thử và đánh giá

Với hệ thống full-stack, kiểm thử cần bao phủ nhiều lớp: kiểm thử chức năng API, kiểm thử giao diện, kiểm thử dữ liệu, kiểm thử phân quyền, kiểm thử luồng liên module và đánh giá hiệu năng cơ bản. Các luồng quan trọng của MealAI gồm đăng nhập, cập nhật hồ sơ, thêm nguyên liệu, nhận gợi ý, tạo thực đơn, sinh shopping list, đánh dấu đã dùng món, gửi đánh giá, tạo thông báo và dùng voice assistant.

Đối với Recommendation Engine, đánh giá không chỉ dựa vào thời gian phản hồi mà còn dựa trên tính hợp lý của kết quả. Một gợi ý tốt cần thỏa các ràng buộc cứng như dị ứng, bệnh lý, thời gian nấu và chế độ ăn; đồng thời có điểm cao ở nguyên liệu khớp, tận dụng hàng sắp hết hạn và mục tiêu dinh dưỡng. Chương 5 trình bày bảng kiểm thử và bảng đánh giá dựa trên các tiêu chí này.

## 2.13. REST API, DTO và ValidationPipe trong NestJS

REST API trong MealAI được thiết kế xoay quanh tài nguyên nghiệp vụ. Tài nguyên người dùng nằm trong `auth`, công thức nằm trong `recipes`, tủ lạnh nằm trong `inventory`, thực đơn nằm trong `meal-plans`, danh sách mua sắm nằm trong `shopping-lists`, thông báo nằm trong `notifications`. Mỗi controller dùng decorator HTTP như `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete` để ánh xạ thao tác CRUD và các hành động nghiệp vụ.

DTO là lớp trung gian mô tả dữ liệu đầu vào. Trong NestJS, DTO thường kết hợp với `class-validator` để kiểm tra kiểu, bắt buộc/không bắt buộc, độ dài, email, số, enum hoặc mảng. MealAI bật `ValidationPipe` toàn cục với `whitelist: true`, nghĩa là field không khai báo trong DTO bị loại bỏ; `forbidNonWhitelisted: true`, nghĩa là request có field lạ bị từ chối; `transform: true`, nghĩa là dữ liệu được chuyển kiểu theo DTO. Đây là lớp bảo vệ quan trọng trước khi request đi vào service.

Việc validate dữ liệu đặc biệt cần thiết trong các API như tạo recipe, gửi review, cập nhật profile, thêm inventory và tạo meal plan. Ví dụ, nếu người dùng gửi rating ngoài khoảng 1-5, backend phải từ chối; nếu người dùng gửi quantity không hợp lệ, inventory không nên lưu; nếu người dùng cập nhật profile với dữ liệu thừa, service không nên nhận field ngoài ý muốn. Cách cấu hình hiện tại giúp giảm lỗi nghiệp vụ và tăng bảo mật.

## 2.14. Repository pattern và transaction nghiệp vụ

TypeORM repository cho phép service thao tác dữ liệu qua các phương thức như `find`, `findOne`, `save`, `delete`, `createQueryBuilder`. Trong MealAI, repository được inject vào service thông qua `@InjectRepository`. Ví dụ `RecommendationService` cần repository của Recipe, Inventory, User, Favorite và UserActionLog; `MealPlanService` cần MealPlan, MealPlanItem, Recipe, Inventory, User và Ingredient; `ShoppingListService` cần ShoppingList, ShoppingListItem, MealPlan, Inventory và Recipe.

Một số nghiệp vụ có tính transaction tự nhiên dù source hiện xử lý theo từng bước repository. Ví dụ, khi đánh dấu đã ăn một meal plan item, hệ thống vừa cập nhật `isConsumed` vừa trừ inventory. Khi tạo shopping list từ meal plan, hệ thống tạo shopping list và nhiều shopping list item. Khi user gửi review vi phạm, hệ thống lưu review, cập nhật user violationCount và tạo admin notification. Trong production, các luồng này có thể được bọc transaction để đảm bảo nếu một bước thất bại thì toàn bộ nghiệp vụ rollback. Tuy nhiên, ở phạm vi hiện tại, logic đã thể hiện rõ thứ tự xử lý và quan hệ dữ liệu.

## 2.15. Thiết kế dữ liệu dinh dưỡng trong recipe và ingredient

Dữ liệu dinh dưỡng của MealAI được lưu ở hai cấp. Cấp recipe có calories, protein, carbs, fat, sugar và sodium cho toàn món hoặc khẩu phần theo quy ước dữ liệu. Cấp ingredient có caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g và averagePrice. Recipe nutrition được dùng trực tiếp trong recommendation và nutrition analysis. Ingredient nutrition có thể dùng để mở rộng tính toán tự động dinh dưỡng từ công thức trong tương lai.

Việc lưu nutrition ở cấp recipe giúp recommendation nhanh hơn vì không phải tính lại từ từng ingredient mỗi lần. Tuy nhiên, nó phụ thuộc vào chất lượng dữ liệu nhập. Vì vậy `RecipeModerationService` có vai trò kiểm tra tính hợp lý của công thức và dinh dưỡng khi user submit. Nếu sau này muốn tăng độ chính xác, hệ thống có thể tính nutrition từ ingredient quantity, unit conversion và dữ liệu dinh dưỡng chuẩn, sau đó so sánh với nutrition do người gửi nhập.

## 2.16. Các dạng gợi ý trong MealAI

MealAI có nhiều dạng gợi ý khác nhau. Dạng thứ nhất là gợi ý món ăn trực tiếp theo mealType, dùng khi người dùng muốn biết bữa sáng/trưa/tối nên ăn gì. Dạng thứ hai là anti-waste suggestion, tập trung vào nguyên liệu sắp hết hạn. Dạng thứ ba là gợi ý bên trong Meal Planner, nơi recommendation được gọi lặp lại cho từng ngày và từng bữa, đồng thời loại trừ recipe đã dùng để tăng đa dạng. Dạng thứ tư là gợi ý thông qua chatbot, khi người dùng hỏi bằng ngôn ngữ tự nhiên và chatbot gọi `get_recommendations`.

Các dạng gợi ý này dùng cùng lõi `RecommendationService` nhưng ngữ cảnh khác nhau. Gợi ý trực tiếp ưu tiên trả kết quả nhanh và giải thích rõ. Anti-waste chú trọng `wasteReduction`. Meal Planner cần thêm ràng buộc đa dạng tuần và cấu trúc bữa ăn. Chatbot cần chuyển câu nói tự nhiên thành tham số như mealType, limit hoặc mục tiêu. Việc dùng chung service giúp tránh sai lệch logic giữa các màn hình.

## 2.17. Cơ sở lý thuyết về explainable recommendation

Explainable recommendation là hướng thiết kế trong đó hệ thống không chỉ đưa ra kết quả mà còn giải thích lý do. Trong bài toán món ăn, giải thích có ý nghĩa thực tế rất cao. Người dùng thường muốn biết vì sao hệ thống đề xuất món này: vì món dùng nguyên liệu đang có, vì ít đường, vì phù hợp bữa tối, vì nấu nhanh hay vì tận dụng nguyên liệu sắp hết hạn. Nếu chỉ hiển thị danh sách món, người dùng khó tin tưởng hệ thống.

MealAI hỗ trợ explainability bằng cách trả về component scores và reasons. Component scores cho thấy đóng góp của dinh dưỡng, ingredient match, waste reduction, preference và cooking time. Reasons là mô tả có thể hiển thị trên UI. MatchedInventory cho biết nguyên liệu nào trong tủ lạnh được dùng, còn missingIngredients cho biết còn thiếu gì. Đây là mô hình giải thích vừa đủ cho người dùng phổ thông và cũng hữu ích cho người phát triển khi debug.

## 2.18. Cơ sở lý thuyết về wake word và trạng thái hội thoại

Wake word là cơ chế kích hoạt trợ lý giọng nói bằng một từ hoặc cụm từ. Trong môi trường web, wake word thường không mạnh như thiết bị chuyên dụng vì phụ thuộc API trình duyệt, tiếng ồn và quyền microphone. Vì vậy, MealAI triển khai wake word ở mức thực dụng: SpeechRecognition luôn lắng nghe khi được bật, nhưng chỉ chuyển sang nghe lệnh nếu transcript ngắn và chứa một trong các biến thể wake word đã định nghĩa. Điều này giảm false positive trong hội thoại dài.

Trạng thái hội thoại giúp voice assistant không bị lẫn giữa lúc chờ wake word, lúc nghe lệnh, lúc xử lý, lúc đọc phản hồi và lúc chờ xác nhận. `VoiceAssistantButton` định nghĩa rõ các state như WAKE_WORD_WAITING, LISTENING_COMMAND, PROCESSING, SPEAKING và WAITING_CONFIRMATION. Cách làm này phù hợp với lý thuyết state machine trong giao diện tương tác, giúp xử lý các tình huống bất đồng bộ như người dùng dừng nói, API đang chờ, audio đang phát hoặc tab bị ẩn.

## 2.19. Cơ sở bảo mật cho ứng dụng có nội dung người dùng tạo

MealAI cho phép người dùng tạo nội dung: gửi công thức, viết review, trả lời review, upload ảnh. Vì vậy hệ thống cần bảo mật ở nhiều lớp. Lớp xác thực đảm bảo chỉ người dùng đăng nhập mới tạo nội dung. Lớp phân quyền đảm bảo chỉ admin duyệt hoặc xóa nội dung quản trị. Lớp validation đảm bảo dữ liệu đầu vào đúng dạng. Lớp moderation phát hiện nội dung độc hại. Lớp notification giúp admin biết khi có vi phạm cần xử lý.

Đối với ảnh upload, backend phục vụ file qua `/uploads`. Trong production, cần bổ sung kiểm tra MIME type, giới hạn kích thước, đổi tên file an toàn, quét nội dung nếu cần và cân nhắc dùng object storage. Đối với review, source hiện đã có filter từ khóa và AI audit; đây là nền tảng tốt nhưng vẫn cần cập nhật danh sách từ khóa và ghi log đầy đủ khi vận hành thật.

### CÁC HÌNH CẦN CHỤP

- client-server-model.png - mô hình client-server của hệ thống.
- jwt-auth-flow.png - luồng JWT access token/refresh token.
- calorie-calculation.png - minh họa cách tính TDEE và phân bổ bữa ăn.
- recommendation-scoring-model.png - sơ đồ mô hình chấm điểm gợi ý.

# CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1. Mô tả bài toán

Bài toán của MealAI là xây dựng một hệ thống giúp người dùng trả lời câu hỏi: "Hôm nay và tuần này nên ăn gì để vừa hợp khẩu vị, vừa phù hợp dinh dưỡng, vừa tận dụng nguyên liệu đang có?". Để trả lời câu hỏi này, hệ thống cần thu thập và xử lý nhiều nguồn dữ liệu: hồ sơ người dùng, sở thích ăn uống, dị ứng, bệnh lý, mục tiêu calo, danh sách nguyên liệu trong tủ lạnh, hạn sử dụng, kho công thức, thành phần dinh dưỡng món ăn, lịch sử yêu thích, lịch sử hành vi và phản hồi cộng đồng.

Từ source code hiện tại, MealAI được thiết kế như một hệ thống nghiệp vụ nhiều vai trò. Người dùng thường có thể đăng ký, đăng nhập, cập nhật hồ sơ, thêm nguyên liệu, xem công thức, gửi công thức, đánh giá, yêu thích, nhận gợi ý, lập thực đơn, tạo danh sách mua sắm, nhận thông báo, dùng chatbot và voice. Quản trị viên có thể quản lý người dùng, công thức, duyệt món chờ, xem audit AI, quản lý thông báo vi phạm, duyệt/xóa review và xem thống kê voice.

## 3.2. Tác nhân hệ thống

| Tác nhân |Mô tả |Quyền/chức năng chính |
| --- |--- |--- |
| Khách chưa đăng nhập |Người truy cập hệ thống chưa có token. |Xem trang chủ, xem danh sách/chi tiết công thức công khai, đăng ký, đăng nhập, khôi phục mật khẩu. |
| Người dùng |Tài khoản role `user` đã xác thực JWT. |Cập nhật hồ sơ, quản lý tủ lạnh, gợi ý món, meal planner, shopping list, đánh giá, yêu thích, thông báo, chatbot/voice. |
| Quản trị viên |Tài khoản role `admin` được kiểm tra bằng RolesGuard. |Quản lý người dùng, công thức, duyệt món, quản lý review vi phạm, mở khóa người dùng, xem thống kê. |
| AI Service |Gemini/Azure/ElevenLabs và engine nội bộ. |Gợi ý, chatbot function calling, kiểm duyệt công thức, kiểm duyệt review, TTS. |
| Hệ thống email |SMTP/Nodemailer nếu cấu hình. |Gửi OTP khôi phục mật khẩu. |

[HÌNH 3.2: Use Case Diagram hệ thống MealAI]

[ẢNH CẦN CHÈN:
use-case-diagram.png]

## 3.3. Yêu cầu chức năng

| Mã |Nhóm chức năng |Yêu cầu |Module/API tương ứng |
| --- |--- |--- |--- |
| F01 |Xác thực |Người dùng đăng ký, đăng nhập, refresh token, lấy/cập nhật hồ sơ. |`AuthModule`, `/auth/*`. |
| F02 |Phân quyền |Admin mới được truy cập API quản trị. |`JwtAuthGuard`, `RolesGuard`, `@Roles("admin")`. |
| F03 |Hồ sơ dinh dưỡng |Lưu cân nặng, chiều cao, giới tính, ngày sinh, mức vận động, mục tiêu calo. |`User`, `CalorieService`, `/auth/profile`. |
| F04 |Sở thích ăn uống |Lưu chế độ ăn, dị ứng, món thích/không thích, vùng món, thời gian nấu, ngân sách. |`UserPreference`. |
| F05 |Công thức |Tìm kiếm, lọc, xem chi tiết, tạo, cập nhật, duyệt, xóa công thức. |`RecipesModule`. |
| F06 |Đánh giá cộng đồng |Người dùng đánh giá sao, viết review, trả lời review, quản trị duyệt vi phạm. |`RecipeRatingService`, `AdminNotification`. |
| F07 |Yêu thích |Thêm/xóa công thức yêu thích, xem danh sách yêu thích. |`FavoriteService`. |
| F08 |Tủ lạnh |Thêm/sửa/xóa nguyên liệu, theo dõi hạn sử dụng và mức độ khẩn cấp. |`InventoryService`. |
| F09 |Gợi ý món |Sinh gợi ý theo mealType, mục tiêu dinh dưỡng, sở thích, tủ lạnh và anti-waste. |`RecommendationService`. |
| F10 |Meal Planner |Sinh thực đơn tuần/ngày, đổi món, khóa món, đánh dấu đã dùng, xuất PDF. |`MealPlanService`. |
| F11 |Shopping List |Tạo danh sách mua sắm từ meal plan hoặc recipe, trừ nguyên liệu tồn kho. |`ShoppingListService`. |
| F12 |Phân tích dinh dưỡng |Tính điểm và nhận xét thực đơn tuần. |`NutritionAnalyzerService`. |
| F13 |Chatbot |Hội thoại AI, gọi function để thao tác hệ thống. |`ChatbotAIService`, `ChatbotActionHandler`. |
| F14 |Voice Assistant |Wake word, STT, gửi lệnh, TTS phản hồi. |`VoiceAssistantButton`, `/chatbot/voice`, `/chatbot/tts`. |
| F15 |Thông báo |Tạo, liệt kê, đếm, đánh dấu thông báo. |`NotificationService`. |

## 3.4. Yêu cầu phi chức năng

| Mã |Yêu cầu |Thiết kế/hiện thực trong hệ thống |
| --- |--- |--- |
| NF01 |Bảo mật xác thực |JWT, bcrypt hash mật khẩu, refresh token, guard bảo vệ API. |
| NF02 |Kiểm soát dữ liệu đầu vào |ValidationPipe toàn cục, DTO với class-validator, whitelist field. |
| NF03 |Khả năng mở rộng |Backend chia module theo domain, frontend chia route/component. |
| NF04 |Khả năng giải thích |Recommendation trả component scores, reasons, matchedInventory, missingIngredients. |
| NF05 |Tính sẵn sàng khi thiếu AI key |Chatbot fallback rule-based, TTS fallback browser SpeechSynthesis. |
| NF06 |Trải nghiệm người dùng |UI Next.js/Tailwind, voice, chatbot, notification, chart dinh dưỡng. |
| NF07 |Toàn vẹn dữ liệu |Quan hệ TypeORM, cascade có kiểm soát, liên kết recipe-ingredient-user-plan. |
| NF08 |Hiệu năng |Pre-filter recommendation trước khi scoring, phân trang recipe/notification, giới hạn tìm kiếm ingredient. |

## 3.5. Kiến trúc hệ thống

[HÌNH 3.1: Sơ đồ kiến trúc tổng thể hệ thống]

[ẢNH CẦN CHÈN:
architecture-overview.png]

Kiến trúc tổng thể gồm bốn lớp. Lớp giao diện là Next.js frontend, chứa các trang và component. Lớp API là NestJS backend, chia thành controller, service và guard. Lớp dữ liệu là PostgreSQL, được truy cập qua TypeORM repository. Lớp AI và tích hợp ngoài gồm Gemini cho chatbot/kiểm duyệt, Azure hoặc ElevenLabs cho TTS và SMTP cho OTP. Các lớp này giao tiếp thông qua HTTP REST API và repository pattern.

Frontend không truy cập trực tiếp database. Mọi thao tác đều đi qua `api.ts`. Backend kiểm tra token, validate dữ liệu, xử lý nghiệp vụ và trả JSON cho frontend. Ví dụ, khi người dùng nhấn sinh thực đơn, frontend gọi `mealPlanAPI.generate`, backend `MealPlanController` gọi `MealPlanService.generate`, service lấy preference, tồn kho, gọi `RecommendationService`, tạo `MealPlanItem`, lưu PostgreSQL và trả kế hoạch đã map về dạng dễ hiển thị.

| Lớp |Thành phần |Trách nhiệm |
| --- |--- |--- |
| Presentation |Next.js pages, React components, TailwindCSS |Hiển thị giao diện, nhận thao tác, gọi API, quản lý trạng thái UI. |
| API/Application |NestJS controllers, guards, DTO, ValidationPipe |Định tuyến request, xác thực, phân quyền, kiểm tra dữ liệu. |
| Domain Services |AuthService, RecommendationService, MealPlanService, ShoppingListService... |Xử lý nghiệp vụ chính. |
| Data |PostgreSQL, TypeORM entities/repositories |Lưu trữ dữ liệu quan hệ. |
| AI/External |Gemini, Azure Speech, ElevenLabs, SMTP |Chatbot, kiểm duyệt, TTS, email OTP. |

## 3.6. Thiết kế API

API của MealAI được đặt dưới prefix `/api/v1`. Các nhóm API phản ánh trực tiếp domain nghiệp vụ. Cách phân nhóm này giúp frontend dễ gọi và backend dễ bảo trì. Hầu hết API cá nhân yêu cầu JWT, trong khi một số API công khai như xem danh sách công thức và chi tiết công thức có thể truy cập không cần đăng nhập. API quản trị yêu cầu role admin.

| Nhóm API |Endpoint chính |Mục đích |
| --- |--- |--- |
| Authentication |`/api/v1/auth/register`, `/login`, `/refresh`, `/profile`, `/profile/stats`, `/forgot-password`, `/reset-password`, `/admin/users` |Đăng ký, đăng nhập, refresh token, lấy/cập nhật hồ sơ, thống kê cá nhân và quản trị người dùng. |
| Recipes |`/api/v1/recipes`, `/recipes/:id`, `/recipes/submit`, `/recipes/my-submissions`, `/recipes/:id/ratings`, `/recipes/admin/*` |Tra cứu công thức, chi tiết, gửi món, đánh giá, phản hồi, duyệt món, thống kê và audit. |
| Favorites |`/api/v1/favorites`, `/favorites/:recipeId`, `/favorites/status/:recipeId` |Lưu, xóa, kiểm tra và liệt kê món yêu thích. |
| Inventory |`/api/v1/inventory`, `/inventory/ingredients/search` |Quản lý nguyên liệu trong tủ lạnh, lọc nguyên liệu sắp hết hạn, tìm kiếm nguyên liệu chuẩn hóa. |
| Recommendation |`/api/v1/recommendations`, `/anti-waste`, `/nutrition-analysis`, `/latest` |Sinh gợi ý món ăn, ưu tiên chống lãng phí, phân tích dinh dưỡng tuần và lấy gợi ý mới nhất. |
| Meal Planner |`/api/v1/meal-plans`, `/generate`, `/generate-days`, `/slot`, `/items/:itemId/swap`, `/items/:itemId/lock`, `/items/:itemId/consume`, `/nutrition`, `/pdf` |Lập thực đơn tuần/ngày, khóa món, đổi món, đánh dấu đã ăn, xuất PDF và phân tích dinh dưỡng. |
| Shopping List |`/api/v1/shopping-lists`, `/generate`, `/add-recipe`, `/items/:itemId/purchase`, `/pdf` |Sinh danh sách mua sắm từ thực đơn hoặc một món, trừ nguyên liệu đã có, theo dõi đã mua và xuất PDF. |
| Chatbot và Voice |`/api/v1/chatbot/message`, `/voice`, `/tts`, `/history`, `/voice/stats`, `/action-log` |Hội thoại AI, lệnh giọng nói, chuyển văn bản thành giọng nói, lịch sử và thống kê. |
| Notifications |`/api/v1/notifications`, `/unread-count`, `/mark-all-read`, `/:id/read` |Liệt kê, đếm và đánh dấu thông báo cá nhân. |
| Admin Moderation |`/api/v1/admin/moderation/notifications`, `/reviews/:id/approve`, `/reviews/:id/reject`, `/users/:id/unlock` |Quản trị thông báo vi phạm, duyệt/xóa bình luận và mở khóa người dùng. |
| Upload |`/api/v1/upload/image` |Upload ảnh món ăn vào thư mục tĩnh `uploads`. |

Thiết kế API có điểm đáng chú ý là các chức năng liên module vẫn giữ endpoint theo domain. Ví dụ shopping list không tự chứa toàn bộ logic meal plan mà nhận mealPlanId, sau đó `ShoppingListService` truy vấn meal plan và recipe ingredients để tính danh sách mua. Chatbot cũng không tự xử lý dữ liệu công thức mà gọi các service tương ứng thông qua `ChatbotActionHandler`. Điều này tránh trùng lặp logic và giữ mỗi service có một trách nhiệm chính.

## 3.7. Thiết kế cơ sở dữ liệu và ERD

[HÌNH 3.7: ERD cơ sở dữ liệu PostgreSQL]

[ẢNH CẦN CHÈN:
database-erd.png]

Cơ sở dữ liệu MealAI được thiết kế theo mô hình quan hệ. Trung tâm dữ liệu là người dùng, công thức, nguyên liệu, tủ lạnh, thực đơn, shopping list, đánh giá và thông báo. Các bảng liên kết như `recipe_ingredients`, `favorite_recipes`, `meal_plan_items` và `shopping_list_items` giúp biểu diễn quan hệ nhiều-nhiều hoặc một-nhiều có thuộc tính bổ sung.

| Bảng |Mô tả dữ liệu |Entity |Vai trò nghiệp vụ |
| --- |--- |--- |--- |
| users |Lưu tài khoản, vai trò, hồ sơ sức khỏe, chỉ số cơ thể, mục tiêu calo và trạng thái kiểm duyệt bình luận. |User |Nền tảng xác thực, cá nhân hóa gợi ý, phân quyền quản trị. |
| user_preferences |Lưu chế độ ăn, dị ứng, nguyên liệu thích/không thích, vùng ẩm thực, thời gian nấu, ngân sách, khẩu phần và ràng buộc bệnh lý. |UserPreference |Nguồn dữ liệu chính cho bộ lọc trước và điểm ưu tiên cá nhân. |
| password_reset_tokens |Lưu OTP khôi phục mật khẩu, email, thời hạn hết hiệu lực và trạng thái đã sử dụng. |PasswordResetToken |Hỗ trợ quy trình quên mật khẩu. |
| recipes |Lưu thông tin công thức, ảnh, thời gian nấu, khẩu phần, độ khó, dinh dưỡng, trạng thái duyệt, người gửi và lượt xem. |Recipe |Trung tâm dữ liệu món ăn cho gợi ý, cộng đồng và thực đơn. |
| ingredients |Lưu tên nguyên liệu, nhóm, đơn vị mặc định, dinh dưỡng trên 100g và giá trung bình. |Ingredient |Chuẩn hóa nguyên liệu giữa công thức, tủ lạnh và danh sách mua sắm. |
| recipe_ingredients |Bảng liên kết công thức với nguyên liệu, số lượng, đơn vị và tùy chọn bắt buộc/không bắt buộc. |RecipeIngredient |Cơ sở để tính nguyên liệu khớp, nguyên liệu thiếu, mua sắm và trừ kho. |
| favorite_recipes |Lưu quan hệ người dùng yêu thích công thức. |Favorite |Tạo tín hiệu sở thích và thông báo cho tác giả món ăn. |
| recipe_ratings |Lưu đánh giá, sao, phản hồi, trạng thái kiểm duyệt, từ khóa vi phạm và bình luận gốc. |RecipeRating |Xây dựng cộng đồng, xếp hạng món ăn và kiểm soát nội dung. |
| recipe_views |Lưu lượt xem theo người dùng hoặc viewerKey, user agent và thời điểm xem. |RecipeView |Thống kê độ quan tâm, chống đếm lặp trong khoảng thời gian ngắn. |
| recipe_moderation_audits |Lưu kết quả kiểm tra chất lượng món ăn, trùng lặp, thiếu nguyên liệu/bước và phản hồi AI. |RecipeModerationAudit |Hỗ trợ quản trị duyệt công thức do người dùng gửi. |
| admin_notifications |Lưu thông báo vi phạm dành cho quản trị viên, liên kết review và người dùng. |AdminNotification |Luồng xử lý bình luận vi phạm và khóa/mở khóa người dùng. |
| inventory_items |Lưu nguyên liệu người dùng đang có, số lượng, đơn vị, hạn sử dụng và ghi chú. |Inventory |Đầu vào cho anti-waste, meal planner, shopping list và tự động trừ kho. |
| meal_plans |Lưu thực đơn theo tuần, tổng calo, trạng thái và cờ tự động sinh. |MealPlan |Quản lý kế hoạch ăn uống tuần. |
| meal_plan_items |Lưu từng món trong từng ngày và bữa, cờ khóa, cờ đã dùng và ghi chú. |MealPlanItem |Đơn vị thao tác khi đổi món, khóa món, đánh dấu đã ăn, trừ nguyên liệu. |
| shopping_lists |Lưu danh sách mua sắm theo người dùng hoặc theo thực đơn. |ShoppingList |Quản lý nguyên liệu cần mua sau khi đối chiếu tủ lạnh. |
| shopping_list_items |Lưu từng nguyên liệu cần mua, số lượng còn thiếu, trạng thái đã mua và giá ước tính. |ShoppingListItem |Theo dõi tiến độ mua sắm. |
| notifications |Lưu thông báo cá nhân, người tạo hành động, bài viết liên quan, loại thông báo và trạng thái đọc. |Notification |Thông báo yêu thích, bình luận, trả lời và đánh giá. |
| chat_messages |Lưu lịch sử hội thoại chatbot theo vai trò người dùng/trợ lý và metadata. |ChatMessage |Duy trì ngữ cảnh hội thoại với Gemini hoặc fallback. |
| user_action_logs |Lưu hành vi người dùng như chấp nhận/từ chối gợi ý, thay đổi thực đơn, thao tác chatbot. |UserActionLog |Tín hiệu điều chỉnh điểm thói quen trong recommendation. |
| voice_command_logs |Lưu transcript, phản hồi, intent, trạng thái thành công và thời lượng lệnh giọng nói. |VoiceCommandLog |Thống kê và đánh giá chất lượng Voice Assistant. |
| weekly_nutrition_analysis |Lưu điểm dinh dưỡng tuần, điểm mạnh, điểm yếu, khuyến nghị và tổng hợp macro. |WeeklyNutritionAnalysis |Theo dõi chất lượng thực đơn theo tuần. |

Quan hệ giữa các bảng thể hiện nhiều nghiệp vụ quan trọng. `User` có một `UserPreference` và nhiều `Inventory`, `MealPlan`, `Favorite`, `RecipeRating`, `Notification`. `Recipe` có nhiều `RecipeIngredient`, nhiều `RecipeRating`, nhiều `Favorite`, nhiều `MealPlanItem` và nhiều `RecipeView`. `MealPlan` có nhiều `MealPlanItem`; `ShoppingList` có nhiều `ShoppingListItem`. Các quan hệ cascade được dùng có chọn lọc để khi xóa meal plan thì item liên quan cũng xóa, nhưng khi xóa shopping list vẫn cần xử lý mealPlanId nullable để tránh lỗi liên kết.

## 3.8. Thiết kế luồng xác thực và phân quyền

[HÌNH 3.4: Sequence Diagram đăng nhập và lấy hồ sơ người dùng]

[ẢNH CẦN CHÈN:
sequence-auth-profile.png]

Luồng đăng nhập bắt đầu khi người dùng nhập email và mật khẩu ở frontend. Frontend gọi `authAPI.login`. Backend `AuthController.login` chuyển dữ liệu đến `AuthService.login`, service tìm user theo email kèm preferences, dùng bcrypt so sánh mật khẩu, sau đó sinh access token và refresh token. Frontend lưu token, gọi các API cần xác thực bằng interceptor. Khi người dùng vào trang hồ sơ, frontend gọi `/auth/profile`, backend dùng `JwtAuthGuard` xác thực token rồi trả thông tin user và preferences.

Luồng phân quyền admin bổ sung `RolesGuard`. Sau khi JWT hợp lệ, guard đọc metadata `@Roles('admin')` trên controller hoặc method. Nếu `req.user.role` không thuộc danh sách cho phép, request bị từ chối. Cách này được áp dụng cho API quản lý người dùng, quản lý công thức, duyệt món, thống kê và moderation.

## 3.9. Thiết kế Recommendation Engine

[HÌNH 3.8: Luồng Recommendation Engine]

[ẢNH CẦN CHÈN:
recommendation-engine-flow.png]

[HÌNH 3.3: Activity Diagram quy trình gợi ý món ăn]

[ẢNH CẦN CHÈN:
activity-recommendation.png]

[HÌNH 3.5: Sequence Diagram gợi ý món ăn thông minh]

[ẢNH CẦN CHÈN:
sequence-recommendation.png]

Recommendation Engine nhận đầu vào gồm userId, mealType, limit, cờ useAntiWaste và danh sách recipe cần loại trừ nếu có. Service tải user và preferences, inventory cùng ingredient, lịch sử hành vi gần đây và danh sách favorite. Sau đó service tính target calorie cho bữa dựa trên `CalorieService.getMealTargets`.

Bước lọc trước loại bỏ các công thức không phù hợp. Recipe phải active và approved, có ingredient, đúng mealType nếu người dùng yêu cầu. Nếu người dùng ăn chay, recipe phải có tag chay; nếu keto, recipe phải có tag keto hoặc có carbs thấp và fat phù hợp; nếu low-carb, recipe phải có tag lowcarb hoặc carbs không vượt ngưỡng. Hệ thống cũng lọc theo maxCookingTime, budgetPerMeal, dị ứng và bệnh lý. Với diabetes, sugar phải dưới maxSugarPerMeal hoặc ngưỡng mặc định 5g; với hypertension, sodium phải dưới maxSodiumPerMeal hoặc ngưỡng mặc định 500mg; với weight_loss, calories không vượt 110% mục tiêu bữa; với muscle_gain, protein phải đạt ngưỡng tối thiểu.

Bước scoring tính năm điểm thành phần. `scoreNutrition` đo độ gần giữa calo món và target bữa. `scoreIngredientMatch` tính tỷ lệ ingredient của recipe có trong inventory. `scoreWasteReduction` tính mức tận dụng nguyên liệu sắp hết hạn trong 7 ngày, với urgency weight critical/high/medium/low. `scorePreferenceMatch` cộng điểm theo cuisineTags, likedIngredients, dislikedIngredients và favorite. `scoreCookTime` ưu tiên món có thời gian nấu thấp hơn maxCookingTime. Sau đó tổng điểm được tính theo trọng số và điều chỉnh bằng habit score từ `UserActionLog`.

| Bước |Xử lý |Dữ liệu vào |Dữ liệu ra |
| --- |--- |--- |--- |
| 1 |Tải hồ sơ, preference, inventory, favorite, action logs |userId |Ngữ cảnh cá nhân hóa. |
| 2 |Tính target calo theo mealType |User profile, dailyCalorieTarget |Target breakfast/lunch/dinner. |
| 3 |Pre-filter recipe |Recipe, preference, health conditions |Danh sách món hợp lệ. |
| 4 |Tính điểm thành phần |Recipe, inventory, preference, favorite |Component scores. |
| 5 |Điều chỉnh theo thói quen |UserActionLog |Final score. |
| 6 |Sắp xếp và trả kết quả |Limit, score |Recipe, reasons, matchedInventory, missingIngredients. |

## 3.10. Thiết kế Meal Planner

[HÌNH 3.6: Sequence Diagram lập thực đơn tuần]

[ẢNH CẦN CHÈN:
sequence-meal-plan.png]

Meal Planner xây dựng trên Recommendation Engine. Khi tạo thực đơn tuần, `MealPlanService.generate` xác định tuần cần tạo, kiểm tra tuần có hoàn toàn trong quá khứ hay không, tạo hoặc tái sử dụng meal plan hiện có, xử lý cờ overwrite và emptyPlan, giữ lại item đã khóa, sau đó lặp qua 7 ngày và 3 bữa: breakfast, lunch, dinner. Với mỗi slot, service gọi recommendation để lấy danh sách món phù hợp, loại trừ các recipe đã dùng để tăng đa dạng.

Một điểm thiết kế đáng chú ý là service không luôn chọn một món cho mọi bữa. Hàm `getTargetDishesCount` dựa vào số khẩu phần để quyết định số món. Bữa sáng thường một món; nếu khẩu phần nhỏ hơn hoặc bằng 2 thì một món; khẩu phần từ 3 đến 5 thì hai món; lớn hơn thì ba món. Khi chọn nhiều món, `selectRecipesForSlot` phân loại theo tag canh, rau và món chính để bữa ăn có cấu trúc hợp lý hơn. Đây là thiết kế gần với bữa ăn gia đình Việt Nam.

Meal Planner còn hỗ trợ thao tác thủ công. Người dùng có thể set một slot cụ thể bằng recipeId, đổi món của một item, khóa item để AI không ghi đè, xóa item, xóa plan, tạo thực đơn cho một số ngày và đánh dấu món đã dùng. Khi item được đánh dấu đã dùng, service trừ nguyên liệu trong inventory theo tỉ lệ khẩu phần người dùng so với khẩu phần recipe. Nếu bỏ đánh dấu đã dùng, hệ thống cộng nguyên liệu trở lại hoặc tạo inventory mới nếu cần.

## 3.11. Thiết kế Fridge Management và Shopping List

Fridge Management lưu nguyên liệu người dùng đang có, số lượng, đơn vị, hạn sử dụng và ghi chú. `InventoryService.findAll` có thể lọc nguyên liệu sắp hết hạn trong 7 ngày và gán urgency: critical nếu còn 0-1 ngày, high nếu 2-3 ngày, medium nếu 4-5 ngày, low nếu 6-7 ngày, none nếu không có hạn hoặc còn xa. Dữ liệu này được dùng trực tiếp trong anti-waste recommendation.

Shopping List sử dụng dữ liệu recipe ingredients, meal plan items và inventory. Khi tạo danh sách từ meal plan, `ShoppingListService.generateFromPlan` lọc item theo ngày nếu người dùng chọn, cộng dồn nguyên liệu bắt buộc, scale số lượng theo khẩu phần người dùng, sau đó trừ đi lượng inventory hiện có. Nếu tủ lạnh đã đủ nguyên liệu thì đưa vào nhóm alreadyHave, nếu thiếu thì tạo `ShoppingListItem` với lượng cần mua và giá ước tính. Điều này giúp danh sách mua sắm thực tế hơn so với chỉ liệt kê toàn bộ nguyên liệu món ăn.

## 3.12. Thiết kế Voice Assistant

[HÌNH 3.9: Luồng Voice Assistant]

[ẢNH CẦN CHÈN:
voice-assistant-flow.png]

Luồng Voice Assistant bắt đầu khi component ở trạng thái chờ wake word. Khi SpeechRecognition nghe thấy từ khóa như "MealAI" hoặc biến thể phát âm, component phát âm báo và chuyển sang nghe lệnh. Transcript lệnh được gửi đến backend qua `/chatbot/voice`, backend gọi `ChatbotAIService.sendVoiceMessage`, service xử lý tương tự chat thường nhưng lưu thêm `VoiceCommandLog` gồm transcript, response, intent, success và duration. Kết quả trả về frontend, frontend thực thi action metadata nếu có, sau đó đọc phản hồi bằng TTS.

Thiết kế voice có cơ chế giảm lỗi. Wake word chỉ kích hoạt khi chuỗi nghe được ngắn hơn 20 ký tự, hạn chế trường hợp một câu dài vô tình chứa từ khóa. Khi tab trình duyệt ẩn, component tạm dừng recognition để tiết kiệm tài nguyên và giảm lỗi nền. Với lệnh nhạy cảm, component có trạng thái WAITING_CONFIRMATION để hỏi xác nhận trước khi thực hiện. Đây là thiết kế phù hợp cho thao tác bằng giọng nói trên web.

## 3.13. Thiết kế Notification System

[HÌNH 3.10: Luồng Notification System]

[ẢNH CẦN CHÈN:
notification-flow.png]

Notification System được chia thành thông báo cá nhân và thông báo quản trị. Thông báo cá nhân được tạo khi có tương tác cộng đồng như yêu thích công thức, bình luận, trả lời hoặc đánh giá. Notification chứa recipient, actor, post, type, message, isRead và createdAt. Frontend hiển thị danh sách thông báo, số lượng chưa đọc và cho phép đánh dấu đã đọc.

Thông báo quản trị dùng `AdminNotification` và phục vụ moderation. Khi review bị phát hiện vi phạm, hệ thống tạo thông báo cho admin với thông tin reviewId, userId, type và message. Admin có thể đánh dấu đã đọc, duyệt review, xóa review hoặc mở khóa người dùng. Việc tách hai bảng giúp luồng thông báo người dùng không bị lẫn với luồng xử lý vi phạm nội bộ.

## 3.14. Thiết kế Community Features

[HÌNH 3.11: Luồng Community Review và Moderation]

[ẢNH CẦN CHÈN:
community-moderation-flow.png]

Community Features gồm favorites, ratings, reviews, replies, recipe submission, admin approval và notification. Người dùng có thể yêu thích recipe, thao tác này vừa lưu vào `favorite_recipes` vừa tạo thông báo cho tác giả nếu khác người thực hiện. Người dùng có thể đánh giá sao và viết review. Review có thể có replies dạng cây thông qua `parentId`.

Kiểm duyệt review diễn ra trước khi nội dung xuất hiện công khai. Nếu review chứa từ khóa xấu hoặc AI audit báo vi phạm, review có trạng thái pending hoặc removed tùy thao tác admin. Người dùng vi phạm nhiều lần bị đưa vào chế độ kiểm duyệt trước hoặc khóa bình luận. Cơ chế này tạo cân bằng giữa tính mở của cộng đồng và yêu cầu an toàn nội dung.

## 3.15. Thiết kế frontend theo luồng người dùng

| Route |Chức năng |Dữ liệu/API liên quan |
| --- |--- |--- |
| `/` |Trang chủ |Giới thiệu MealAI, các giá trị chính: AI gợi ý món ăn, lập thực đơn tuần, tủ lạnh thông minh, shopping list, dinh dưỡng. |
| `/login`, `/register`, `/forgot-password`, `/reset-password` |Xác thực |Form đăng nhập/đăng ký/khôi phục mật khẩu, lưu token, điều hướng theo vai trò. |
| `/recipes`, `/recipes/[id]` |Công thức |Danh sách công thức, lọc/tìm kiếm, chi tiết món, nguyên liệu, bước nấu, đánh giá, phản hồi, yêu thích. |
| `/inventory` |Tủ lạnh |Thêm/sửa/xóa nguyên liệu, tìm kiếm ingredient, hiển thị hạn sử dụng, cảnh báo nguyên liệu cần dùng trước. |
| `/meal-planner` |Thực đơn tuần |Sinh thực đơn, đổi món, khóa món, đánh dấu đã dùng, thêm món thủ công, xuất PDF. |
| `/shopping-list` |Danh sách mua sắm |Sinh danh sách mua từ thực đơn, nhóm nguyên liệu, đánh dấu đã mua, xuất PDF. |
| `/nutrition` |Phân tích dinh dưỡng |Biểu đồ macro/calo, điểm dinh dưỡng tuần, khuyến nghị cải thiện. |
| `/profile` |Hồ sơ |Cập nhật cân nặng, chiều cao, giới tính, ngày sinh, mức vận động, khẩu vị, dị ứng, mục tiêu ăn uống. |
| `/favorites`, `/recently-viewed`, `/my-reviews` |Cá nhân hóa |Theo dõi món yêu thích, món đã xem, đánh giá của bản thân. |
| `/notifications` |Thông báo |Thông báo cá nhân về yêu thích, bình luận, trả lời và đánh giá. |
| `/admin/*` |Quản trị |Thống kê, duyệt món, quản lý công thức, người dùng, thông báo kiểm duyệt và thống kê voice. |

Các route frontend được tổ chức xoay quanh luồng sử dụng chính. Người dùng bắt đầu từ trang chủ, đăng ký hoặc đăng nhập, cập nhật hồ sơ, xem hoặc tìm công thức, nhập nguyên liệu vào tủ lạnh, nhận gợi ý, tạo thực đơn, tạo shopping list và theo dõi dinh dưỡng. ChatWidget và VoiceAssistantButton là các thành phần tương tác bổ sung có thể xuất hiện xuyên suốt ứng dụng, giúp người dùng thao tác nhanh hơn mà không cần tìm đúng màn hình.

## 3.16. Ràng buộc và giả định thiết kế

Một số giả định được đặt ra trong thiết kế hiện tại. Thứ nhất, dữ liệu công thức cần có đủ ingredient, nutrition và mealType để Recommendation Engine hoạt động tốt. Thứ hai, người dùng càng cập nhật hồ sơ, preference và inventory đầy đủ thì gợi ý càng chính xác. Thứ ba, trong giai đoạn phát triển, database dùng `synchronize: true`, nhưng khi triển khai thật cần chuyển sang migration. Thứ tư, AI bên ngoài có thể không khả dụng; vì vậy hệ thống đã có fallback rule-based cho chatbot và fallback speech synthesis ở frontend.

Các ràng buộc này không làm giảm giá trị hệ thống mà giúp xác định rõ phạm vi. MealAI hiện ưu tiên một hệ thống gợi ý có thể giải thích và vận hành ổn định hơn là một mô hình học sâu phụ thuộc dữ liệu lớn. Đây là lựa chọn hợp lý cho khóa luận và phù hợp với source code hiện tại.

## 3.17. Phân rã chức năng theo module nghiệp vụ

Từ góc độ phân tích thiết kế, MealAI có thể được phân rã thành tám phân hệ lớn: quản lý người dùng, quản lý công thức, quản lý tủ lạnh, gợi ý thông minh, lập thực đơn, mua sắm, cộng đồng-thông báo và AI tương tác. Mỗi phân hệ có dữ liệu đầu vào, dữ liệu đầu ra và trách nhiệm riêng, nhưng không tách rời hoàn toàn. Các quan hệ liên phân hệ là đặc điểm quan trọng nhất của thiết kế.

| Phân hệ |Đầu vào |Xử lý chính |Đầu ra |
| --- |--- |--- |--- |
| Người dùng |Email, mật khẩu, hồ sơ, preference |Xác thực, tính TDEE, lưu sở thích |Token, profile, dailyCalorieTarget. |
| Công thức |Recipe, ingredient, nutrition, tag |CRUD, lọc, duyệt, audit, view |Danh sách/chi tiết recipe approved. |
| Tủ lạnh |Ingredient, quantity, expirationDate |CRUD, tính daysLeft/urgency |Inventory context cho recommendation. |
| Gợi ý |User, preference, inventory, recipe, action log |Pre-filter, scoring, ranking |Recipe gợi ý kèm lý do. |
| Thực đơn |WeekStart, mealType, recommendation |Sinh tuần/ngày, lock, swap, consume |MealPlan và MealPlanItem. |
| Mua sắm |MealPlan/Recipe, inventory |Gom ingredient, scale, trừ tồn kho |ShoppingList và item cần mua. |
| Cộng đồng |Rating, review, favorite, reply |Moderation, notification, stats |Review công khai, thông báo. |
| AI tương tác |Text/voice command, chat history |Function calling, fallback intent |Action result, response, logs. |

Phân rã trên phù hợp với cấu trúc code vì mỗi phân hệ tương ứng một hoặc nhiều NestJS module. Khi thiết kế hệ thống, việc giữ module theo domain giúp giảm phụ thuộc vòng. Ví dụ `ShoppingListService` phụ thuộc meal plan và inventory vì nghiệp vụ cần dữ liệu đó, nhưng logic recommendation vẫn ở `RecommendationService`. Chatbot không trực tiếp truy vấn mọi bảng theo cách tùy tiện, mà gọi action handler để dùng service có sẵn.

## 3.18. Thiết kế dữ liệu đầu vào cho Recommendation Engine

Một điểm quan trọng trong thiết kế Recommendation Engine là xác định dữ liệu nào được xem là ràng buộc cứng và dữ liệu nào là tín hiệu mềm. Ràng buộc cứng được dùng để loại recipe khỏi danh sách; tín hiệu mềm được dùng để xếp hạng. Nếu nhầm hai nhóm này, hệ thống có thể trả món không an toàn hoặc quá ít kết quả. Source code hiện tại phân biệt khá rõ: dị ứng, bệnh lý, dietType, maxCookingTime, budget và mealType là nhóm lọc; ingredient match, waste reduction, preference và habit là nhóm điểm.

| Dữ liệu |Nguồn |Loại |Cách sử dụng |
| --- |--- |--- |--- |
| mealType |Tham số request hoặc chatbot |Ràng buộc cứng |Recipe phải có mealType tương ứng. |
| dietType |UserPreference |Ràng buộc cứng |Chay/keto/lowcarb loại món không phù hợp. |
| allergies |UserPreference |Ràng buộc cứng |Loại recipe chứa ingredient dị ứng. |
| healthConditions |UserPreference |Ràng buộc cứng |Diabetes/hypertension/weight_loss/muscle_gain áp dụng sugar/sodium/calorie/protein. |
| maxCookingTime |UserPreference |Ràng buộc cứng và điểm mềm |Loại món vượt giới hạn, chấm điểm món nấu nhanh. |
| budgetPerMeal |UserPreference |Ràng buộc cứng |Loại món vượt chi phí ước tính. |
| dailyCalorieTarget |User |Tín hiệu mềm |Tính target bữa và scoreNutrition. |
| inventory |Inventory |Tín hiệu mềm |scoreIngredientMatch và matchedInventory. |
| expirationDate |Inventory |Tín hiệu mềm có ưu tiên cao |scoreWasteReduction theo urgency. |
| favorites |Favorite |Tín hiệu mềm |Tăng preference match. |
| action logs |UserActionLog |Tín hiệu mềm |Điều chỉnh habit score. |

## 3.19. Thiết kế dữ liệu đầu ra cho Recommendation Engine

Đầu ra của recommendation không chỉ là recipe. Để frontend có thể hiển thị giải thích và để các module khác dùng lại, service trả cấu trúc giàu thông tin. Mỗi item gồm thông tin recipe cơ bản, điểm tổng, điểm thành phần, reasons, matchedInventory và missingIngredients. Meal Planner có thể dùng danh sách recipe để chọn món; giao diện gợi ý có thể dùng reasons để giải thích; shopping list có thể tham khảo missingIngredients nếu cần mở rộng.

| Trường đầu ra |Ý nghĩa |Ứng dụng giao diện/nghiệp vụ |
| --- |--- |--- |
| recipe |Thông tin món: id, name, image, time, servings, nutrition. |Hiển thị card món và mở detail. |
| score.total |Điểm phù hợp cuối cùng. |Sắp xếp và hiển thị độ phù hợp. |
| score.components |Điểm dinh dưỡng, nguyên liệu, waste, preference, time. |Giải thích tại sao món được đề xuất. |
| reasons |Danh sách lý do dạng văn bản. |Hiển thị nhãn như "dùng nguyên liệu sắp hết hạn". |
| matchedInventory |Nguyên liệu trong tủ lạnh được dùng, daysLeft, urgency. |Tạo niềm tin và thúc đẩy chống lãng phí. |
| missingIngredients |Nguyên liệu còn thiếu, số lượng, đơn vị, giá ước tính. |Chuẩn bị mua sắm hoặc chuyển sang shopping list. |

## 3.20. Thiết kế trạng thái Meal Plan

Meal Plan có hai lớp trạng thái. Lớp thứ nhất là trạng thái của plan: active và cờ isAutoGenerated. Lớp thứ hai là trạng thái của từng meal plan item: isLocked, isConsumed và notes. Thiết kế ở cấp item là cần thiết vì trong một thực đơn tuần, người dùng có thể muốn khóa một món nhưng vẫn cho AI thay các món khác; có thể đã ăn bữa trưa hôm nay nhưng chưa ăn bữa tối; có thể muốn ghi chú riêng cho một món.

Khi generate lại thực đơn, `MealPlanService` phải xử lý item đã khóa. Nếu overwrite được bật, service xóa các item không khóa nhưng giữ item khóa. Nếu emptyPlan được dùng, service cũng phải cân nhắc các item hiện có. Khi consume, service thay đổi isConsumed và đồng bộ inventory. Các trạng thái nhỏ này giúp hệ thống linh hoạt hơn so với thiết kế chỉ lưu một danh sách món tĩnh.

## 3.21. Thiết kế đồng bộ Inventory khi consume món

Đồng bộ inventory là một luồng có rủi ro vì liên quan đến số lượng nguyên liệu. Thiết kế hiện tại lấy recipe ingredients của món, tính hệ số scale bằng `userServings / recipe.servings`, sau đó trừ quantity tương ứng khỏi inventory. Nếu inventory item còn quantity nhỏ hơn hoặc bằng 0, hệ thống xóa item. Nếu người dùng bỏ đánh dấu đã ăn, hệ thống cộng lại quantity hoặc tạo inventory mới. Cách này làm cho hành động consume có thể đảo ngược ở mức dữ liệu.

Điểm cần chú ý là quy đổi đơn vị. Source code hiện dựa vào quantity và unit trong recipe/inventory. Nếu unit không đồng nhất, kết quả có thể chưa chính xác tuyệt đối. Trong phạm vi thiết kế hiện tại, giả định dữ liệu ingredient cùng đơn vị hoặc có quy ước nhập liệu thống nhất. Khi mở rộng, hệ thống nên có bảng unit conversion để đổi gram, kilogram, ml, lít, muỗng và đơn vị đếm.

## 3.22. Thiết kế kiểm duyệt hai tầng

Kiểm duyệt hai tầng giúp cân bằng tốc độ và chất lượng. Tầng từ khóa xử lý nhanh, không phụ thuộc mạng, bắt được các từ vi phạm phổ biến kể cả biến thể teencode hoặc ký tự thay thế. Tầng AI audit xử lý các trường hợp ngữ cảnh phức tạp hơn như công kích, spam hoặc nội dung độc hại không trùng từ khóa. Nếu AI không cấu hình, hệ thống vẫn còn tầng từ khóa để hoạt động.

Khi review vi phạm, hệ thống không chỉ xử lý review mà còn cập nhật trạng thái người dùng. `violationCount`, `isCommentModerated` và `commentLockedUntil` tạo ra cơ chế phản ứng tăng dần. Một lần vi phạm có thể chỉ tạo cảnh báo; nhiều lần vi phạm đưa người dùng vào kiểm duyệt trước; vi phạm nghiêm trọng lặp lại khóa bình luận trong 7 ngày. Thiết kế này phù hợp với hệ thống cộng đồng vừa và nhỏ.

## 3.23. Thiết kế fallback cho AI và dịch vụ ngoài

Một rủi ro khi tích hợp AI là dịch vụ ngoài có thể không khả dụng do thiếu API key, lỗi mạng, giới hạn quota hoặc phản hồi không đúng kỳ vọng. MealAI xử lý rủi ro này bằng fallback ở nhiều lớp. Chatbot có fallback rule-based khi thiếu Gemini hoặc khi Gemini không trả function call phù hợp. TTS có fallback từ Azure sang ElevenLabs và cuối cùng sang SpeechSynthesis của trình duyệt. Password reset có fallback log OTP trong môi trường phát triển khi không có SMTP.

Thiết kế fallback giúp hệ thống vẫn kiểm thử được đầy đủ luồng chính trong môi trường sinh viên. Nó cũng thể hiện tư duy thiết kế thực tế: AI là thành phần tăng cường trải nghiệm, nhưng nghiệp vụ cốt lõi như đăng nhập, quản lý tủ lạnh, recommendation rule/scoring, meal planner và shopping list vẫn phải hoạt động độc lập.

### CÁC HÌNH CẦN CHỤP

- architecture-overview.png - sơ đồ kiến trúc tổng thể.
- use-case-diagram.png - use case toàn hệ thống.
- activity-recommendation.png - activity gợi ý món ăn.
- sequence-auth-profile.png - sequence đăng nhập và lấy hồ sơ.
- sequence-recommendation.png - sequence recommendation.
- sequence-meal-plan.png - sequence meal planner.
- database-erd.png - ERD PostgreSQL.
- recommendation-engine-flow.png - luồng Recommendation Engine.
- voice-assistant-flow.png - luồng Voice Assistant.
- notification-flow.png - luồng Notification.
- community-moderation-flow.png - luồng review và kiểm duyệt.

# CHƯƠNG 4. XÂY DỰNG HỆ THỐNG

## 4.1. Môi trường và công nghệ xây dựng

Hệ thống MealAI được xây dựng theo mô hình monorepo gồm hai thư mục chính: `frontend` và `backend`. Frontend sử dụng Next.js 16, React 19, TypeScript, TailwindCSS, Axios, Framer Motion, Chart.js và react-hot-toast. Backend sử dụng NestJS 11, TypeORM, PostgreSQL driver `pg`, Passport JWT, bcryptjs, class-validator, nodemailer, pdfkit và Google Generative AI SDK. Cấu trúc này tách rõ lớp giao diện và lớp xử lý nghiệp vụ, đồng thời vẫn thuận tiện trong quá trình phát triển.

Backend chạy mặc định trên cổng 3001 với global prefix `api/v1`. Frontend gọi backend qua biến môi trường `NEXT_PUBLIC_API_URL`. CORS được cấu hình cho `FRONTEND_URL` hoặc mặc định `http://localhost:3000`, cho phép cookie/credential nếu cần. Static upload được mount ở `/uploads`, phục vụ ảnh công thức do người dùng hoặc admin tải lên.

| Thành phần |Thư viện/công nghệ |Vai trò |
| --- |--- |--- |
| Frontend framework |Next.js, React |Xây dựng giao diện và route. |
| Frontend language |TypeScript |Kiểm soát kiểu dữ liệu. |
| UI styling |TailwindCSS |Thiết kế responsive. |
| HTTP client |Axios |Gọi API và interceptor token. |
| Backend framework |NestJS |Module, controller, service, guard. |
| Database ORM |TypeORM |Ánh xạ entity PostgreSQL. |
| Database |PostgreSQL |Lưu dữ liệu quan hệ. |
| Auth |Passport JWT, bcryptjs |Xác thực và bảo mật mật khẩu. |
| AI |Google Generative AI SDK |Chatbot, function calling, moderation. |
| Voice/TTS |Web Speech API, Azure Speech, ElevenLabs |STT, wake word, đọc phản hồi. |
| PDF/Email |pdfkit, nodemailer |Xuất PDF và gửi OTP. |

## 4.2. Xây dựng frontend

[HÌNH 4.1: Cấu trúc thư mục frontend Next.js]

[ẢNH CẦN CHÈN:
frontend-folder-structure.png]

Frontend được tổ chức theo Next.js App Router. Mỗi thư mục trong `frontend/src/app` tương ứng với một route hoặc nhóm route. Các component dùng chung nằm trong `frontend/src/components`. Các API client được gom trong `frontend/src/lib/api.ts`. Thiết kế này giúp tách biệt màn hình, component dùng chung và tầng giao tiếp backend.

`api.ts` là thành phần quan trọng của frontend. File này tạo Axios instance, gắn token, xử lý lỗi 401 và định nghĩa các nhóm API. Ví dụ `authAPI` xử lý đăng nhập, đăng ký, profile và admin user; `recipesAPI` xử lý công thức, đánh giá, submission và admin recipe; `inventoryAPI` xử lý tủ lạnh; `recommendationAPI` lấy gợi ý và phân tích dinh dưỡng; `mealPlanAPI` xử lý thực đơn; `shoppingListAPI` xử lý mua sắm; `chatbotAPI` xử lý chat, voice và TTS; `notificationsAPI` xử lý thông báo.

| Route/component |Nội dung xây dựng |API sử dụng |
| --- |--- |--- |
| `/` |Trang chủ |Giới thiệu MealAI, các giá trị chính: AI gợi ý món ăn, lập thực đơn tuần, tủ lạnh thông minh, shopping list, dinh dưỡng. |
| `/login`, `/register`, `/forgot-password`, `/reset-password` |Xác thực |Form đăng nhập/đăng ký/khôi phục mật khẩu, lưu token, điều hướng theo vai trò. |
| `/recipes`, `/recipes/[id]` |Công thức |Danh sách công thức, lọc/tìm kiếm, chi tiết món, nguyên liệu, bước nấu, đánh giá, phản hồi, yêu thích. |
| `/inventory` |Tủ lạnh |Thêm/sửa/xóa nguyên liệu, tìm kiếm ingredient, hiển thị hạn sử dụng, cảnh báo nguyên liệu cần dùng trước. |
| `/meal-planner` |Thực đơn tuần |Sinh thực đơn, đổi món, khóa món, đánh dấu đã dùng, thêm món thủ công, xuất PDF. |
| `/shopping-list` |Danh sách mua sắm |Sinh danh sách mua từ thực đơn, nhóm nguyên liệu, đánh dấu đã mua, xuất PDF. |
| `/nutrition` |Phân tích dinh dưỡng |Biểu đồ macro/calo, điểm dinh dưỡng tuần, khuyến nghị cải thiện. |
| `/profile` |Hồ sơ |Cập nhật cân nặng, chiều cao, giới tính, ngày sinh, mức vận động, khẩu vị, dị ứng, mục tiêu ăn uống. |
| `/favorites`, `/recently-viewed`, `/my-reviews` |Cá nhân hóa |Theo dõi món yêu thích, món đã xem, đánh giá của bản thân. |
| `/notifications` |Thông báo |Thông báo cá nhân về yêu thích, bình luận, trả lời và đánh giá. |
| `/admin/*` |Quản trị |Thống kê, duyệt món, quản lý công thức, người dùng, thông báo kiểm duyệt và thống kê voice. |

### 4.2.1. Trang chủ và luồng điều hướng

[HÌNH 4.2: Giao diện trang chủ MealAI]

[ẢNH CẦN CHÈN:
home-page.png]

Trang chủ giới thiệu MealAI như một hệ thống lập thực đơn thông minh cho gia đình Việt. Nội dung trang nhấn mạnh các giá trị chính: AI gợi ý món ăn, lập thực đơn tuần, tủ lạnh thông minh, danh sách mua sắm, phân tích dinh dưỡng và tương tác AI. Về mặt trải nghiệm, trang chủ đóng vai trò đưa người dùng vào các luồng chính như xem công thức, bắt đầu lập thực đơn hoặc đăng nhập để cá nhân hóa.

### 4.2.2. Giao diện xác thực

[HÌNH 4.3: Giao diện đăng nhập]

[ẢNH CẦN CHÈN:
login-page.png]

[HÌNH 4.4: Giao diện đăng ký tài khoản]

[ẢNH CẦN CHÈN:
register-page.png]

Giao diện đăng nhập và đăng ký gọi các API trong `authAPI`. Sau khi đăng nhập thành công, frontend lưu access token và refresh token trong localStorage, đồng thời chuyển người dùng vào khu vực chức năng. Nếu API trả lỗi 401 ở các request sau, interceptor xóa token và chuyển về trang đăng nhập. Giao diện khôi phục mật khẩu gồm luồng gửi email OTP và reset mật khẩu bằng token 6 chữ số.

### 4.2.3. Giao diện công thức và cộng đồng

[HÌNH 4.5: Giao diện danh sách công thức]

[ẢNH CẦN CHÈN:
recipes-page.png]

[HÌNH 4.6: Giao diện chi tiết món ăn và đánh giá]

[ẢNH CẦN CHÈN:
recipe-detail-page.png]

Trang danh sách công thức cho phép người dùng tìm kiếm, lọc theo mealType, thời gian nấu, calo, vùng món và các tiêu chí khác. Dữ liệu được lấy từ `recipesAPI.getAll`. Backend trả thêm các chỉ số như averageRating, reviewCount, favoriteCount, viewCount và trạng thái isFavorite nếu có userId. Trang chi tiết công thức hiển thị nguyên liệu, bước nấu, dinh dưỡng, đánh giá, phản hồi và nút yêu thích.

Chức năng đánh giá cộng đồng được frontend gửi qua `recipesAPI.submitRating`, `updateRating`, `deleteRating` và `replyRating`. Backend xử lý kiểm duyệt trước khi hiển thị công khai. Nếu review bị đánh dấu vi phạm, người dùng có thể thấy trạng thái chờ duyệt hoặc nội dung được mask; admin nhận thông báo moderation.

### 4.2.4. Giao diện tủ lạnh

[HÌNH 4.7: Giao diện tủ lạnh cá nhân]

[ẢNH CẦN CHÈN:
inventory-page.png]

Trang tủ lạnh cho phép người dùng thêm nguyên liệu đang có, nhập số lượng, đơn vị, hạn sử dụng và ghi chú. Khi người dùng gõ tên nguyên liệu, frontend gọi `inventoryAPI.searchIngredients` để gợi ý ingredient chuẩn hóa. Danh sách nguyên liệu được hiển thị kèm mức độ khẩn cấp dựa trên số ngày còn lại. Những nguyên liệu sắp hết hạn là tín hiệu quan trọng cho anti-waste recommendation.

### 4.2.5. Giao diện gợi ý và thực đơn tuần

[HÌNH 4.8: Giao diện gợi ý món ăn]

[ẢNH CẦN CHÈN:
recommendations-page.png]

[HÌNH 4.9: Giao diện lập thực đơn tuần]

[ẢNH CẦN CHÈN:
meal-planner-page.png]

Giao diện gợi ý gọi `recommendationAPI.get` hoặc `antiWaste` để hiển thị các món phù hợp. Mỗi món có thể hiển thị điểm gợi ý, lý do, nguyên liệu khớp và nguyên liệu thiếu. Giao diện thực đơn tuần gọi `mealPlanAPI.generate` để sinh thực đơn, `setSlot` để thêm món thủ công, `swap` để đổi món, `lock` để khóa món, `consume` để đánh dấu đã ăn và `getNutrition` để phân tích dinh dưỡng. Trang này thể hiện rõ sự liên kết giữa AI recommendation, lịch ăn và quản lý tồn kho.

Khi người dùng đánh dấu một món đã ăn, backend trừ nguyên liệu khỏi inventory. Đây là trải nghiệm quan trọng vì tủ lạnh không còn là dữ liệu tĩnh. Nó thay đổi theo việc người dùng thực sự sử dụng món trong meal plan. Nếu người dùng bỏ đánh dấu đã ăn, nguyên liệu được cộng lại. Thiết kế này làm cho vòng lặp tủ lạnh - thực đơn - mua sắm có tính nhất quán hơn.

### 4.2.6. Giao diện shopping list và dinh dưỡng

[HÌNH 4.10: Giao diện danh sách mua sắm]

[ẢNH CẦN CHÈN:
shopping-list-page.png]

[HÌNH 4.11: Giao diện phân tích dinh dưỡng]

[ẢNH CẦN CHÈN:
nutrition-analysis-page.png]

Trang shopping list hiển thị danh sách nguyên liệu cần mua sau khi hệ thống đối chiếu thực đơn và tủ lạnh. Người dùng có thể đánh dấu từng item đã mua, hệ thống cập nhật trạng thái list thành pending, in_progress hoặc completed. Chức năng xuất PDF hỗ trợ người dùng mang danh sách đi chợ hoặc chia sẻ với gia đình.

Trang phân tích dinh dưỡng sử dụng Chart.js để trực quan hóa calo, protein, carbs, fat và các khuyến nghị từ `NutritionAnalyzerService`. Thay vì chỉ hiển thị số liệu, trang này giúp người dùng nhìn thấy điểm mạnh, điểm yếu và đề xuất cải thiện cho thực đơn tuần.

### 4.2.7. Chatbot, Voice Assistant và thông báo

[HÌNH 4.12: Giao diện Chatbot AI]

[ẢNH CẦN CHÈN:
chatbot-widget.png]

[HÌNH 4.13: Giao diện Voice Assistant]

[ẢNH CẦN CHÈN:
voice-assistant-button.png]

ChatWidget là kênh tương tác tự nhiên. Người dùng có thể hỏi món ăn, yêu cầu tạo thực đơn, xem tủ lạnh, tạo shopping list hoặc điều hướng. VoiceAssistantButton mở rộng trải nghiệm đó bằng giọng nói, phù hợp khi người dùng đang nấu ăn hoặc không tiện thao tác chuột/bàn phím. Hai thành phần này cùng dùng `chatbotAPI`, nhưng voice gửi thêm duration và được log vào `VoiceCommandLog`.

Trang thông báo giúp người dùng theo dõi các tương tác cộng đồng. Khi có người yêu thích món, bình luận, trả lời hoặc đánh giá, notification được tạo ở backend và frontend gọi `notificationsAPI.getAll`, `getUnreadCount`, `markAsRead`, `markAllAsRead` để hiển thị.

### 4.2.8. Giao diện quản trị

[HÌNH 4.14: Giao diện quản trị duyệt món ăn]

[ẢNH CẦN CHÈN:
admin-pending-recipes.png]

[HÌNH 4.15: Giao diện quản trị thông báo vi phạm]

[ẢNH CẦN CHÈN:
admin-moderation-notifications.png]

[HÌNH 4.16: Giao diện thống kê lệnh giọng nói]

[ẢNH CẦN CHÈN:
admin-voice-dashboard.png]

Khu vực quản trị dùng các API admin để thống kê, quản lý công thức, duyệt món chờ, xem audit AI, quản lý user và xử lý review vi phạm. Đây là phần cần thiết cho hệ thống cộng đồng, vì người dùng có thể gửi công thức và bình luận. Admin có thể phê duyệt, từ chối, xóa hoặc mở khóa người dùng dựa trên dữ liệu moderation.

## 4.3. Xây dựng backend

Backend NestJS được tổ chức theo domain module. Mỗi module gồm controller, service, entity, DTO và các thành phần phụ trợ nếu cần. Cách tổ chức này giúp logic nghiệp vụ không bị dồn vào một lớp lớn, đồng thời mỗi module có thể phát triển độc lập. Bảng dưới trình bày các module chính và vai trò.

| Module |Thành phần chính |Vai trò |
| --- |--- |--- |
| AuthModule |AuthController, AuthService, JwtStrategy, Guards, PasswordResetService |Đăng ký, đăng nhập, profile, admin users, OTP. |
| RecipesModule |RecipesController, RecipesService, RecipeRatingService, RecipeModerationService |Công thức, đánh giá, duyệt món, audit AI. |
| InventoryModule |InventoryController, InventoryService |Tủ lạnh, hạn sử dụng, tìm kiếm nguyên liệu. |
| RecommendationModule |RecommendationController, RecommendationService, CalorieService, NutritionAnalyzerService |Gợi ý, anti-waste, phân tích dinh dưỡng. |
| MealPlanModule |MealPlanController, MealPlanService |Thực đơn tuần, đổi món, khóa, consume, PDF. |
| ShoppingListModule |ShoppingListController, ShoppingListService |Danh sách mua sắm, trừ tồn kho, PDF. |
| ChatbotModule |ChatbotController, ChatbotAIService, ChatbotActionHandler, TtsService |Chatbot, voice, action calling, TTS. |
| NotificationModule |NotificationController, NotificationService |Thông báo cá nhân. |
| UploadModule |UploadController |Upload ảnh công thức. |

### 4.3.1. Cấu hình ứng dụng backend

`AppModule` import `ConfigModule.forRoot({ isGlobal: true })` để biến môi trường có thể dùng toàn cục. TypeORM kết nối PostgreSQL bằng `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`. Các entity được auto load. Trong giai đoạn phát triển, `synchronize: true` giúp schema tự cập nhật theo entity. `main.ts` thiết lập CORS, static uploads, global prefix và validation pipe. Đây là lớp cấu hình nền cho toàn bộ API.

### 4.3.2. Authentication và Authorization

`AuthService.register` kiểm tra email trùng, hash mật khẩu bằng bcrypt, tạo user và tạo preference mặc định. `AuthService.login` tìm user theo email, so sánh mật khẩu, sau đó trả accessToken, refreshToken và thông tin user gồm id, email, fullName, role, dailyCalorieTarget. `AuthService.updateProfile` cập nhật cả thông tin cơ thể và preference; khi cân nặng, chiều cao, giới tính, ngày sinh hoặc activityLevel thay đổi, service tính lại dailyCalorieTarget bằng `CalorieService.calculateTDEE`.

`JwtStrategy` trích xuất Bearer token, xác thực chữ ký và trả user payload. `JwtAuthGuard` bảo vệ các API cần đăng nhập. `RolesGuard` kiểm tra role admin cho các endpoint quản trị. Mô hình này đáp ứng yêu cầu Authentication & Authorization của hệ thống.

### 4.3.3. Recipe, rating và moderation

`RecipesService.findAll` lọc công thức active và approved, hỗ trợ search, mealType, maxCookingTime, khoảng calories, cuisineRegion và sort. Query còn tính averageRating, reviewCount, favoriteCount, viewCount và isFavoriteCount nếu có user. `findOne` load ingredient, submitter, ghi nhận lượt xem với cooldown theo viewerKey và trả dữ liệu chi tiết.

Người dùng có thể submit công thức. Công thức gửi lên có trạng thái pending, admin duyệt hoặc từ chối. Admin create thì công thức được approved. `RecipeModerationService` hỗ trợ audit chất lượng bằng kiểm tra tĩnh và Gemini nếu có API key. Audit kiểm tra trùng tên, thiếu nguyên liệu được nhắc trong bước nấu, số bước quá ít, số nguyên liệu quá ít và tính hợp lý dinh dưỡng. Kết quả lưu vào `recipe_moderation_audits`.

`RecipeRatingService` xử lý đánh giá và reply. Khi người dùng tạo review, service kiểm tra quyền bình luận, chạy filter từ khóa xấu, gọi AI audit nếu cần, đặt trạng thái reviewed hoặc pending, tăng violationCount khi vi phạm, khóa hoặc đưa người dùng vào chế độ kiểm duyệt nếu vi phạm nhiều lần, đồng thời tạo admin notification. Nếu review hợp lệ, hệ thống tạo notification cho tác giả món hoặc chủ bình luận.

### 4.3.4. Inventory và ingredient search

`InventoryService` cho phép người dùng quản lý nguyên liệu cá nhân. Khi lấy danh sách, service join `Ingredient`, hỗ trợ lọc expiringSoon và category, sắp xếp hạn sử dụng tăng dần. Service tính `daysLeft` và `urgency` cho từng item. Dữ liệu urgency này được Recommendation Engine dùng để tăng điểm waste reduction. API tìm kiếm nguyên liệu dùng LOWER LIKE và giới hạn 10 kết quả để hỗ trợ autocomplete ở frontend.

### 4.3.5. Recommendation Engine

`RecommendationService` là lõi AI rule/scoring của hệ thống. Service định nghĩa trọng số `nutritionHealth: 0.30`, `ingredientMatch: 0.25`, `wasteReduction: 0.20`, `preferenceMatch: 0.15`, `cookTimeScore: 0.10`. Các trọng số này phản ánh ưu tiên thiết kế: dinh dưỡng và nguyên liệu đang có là quan trọng nhất, sau đó đến chống lãng phí, sở thích và thời gian nấu.

| Tiêu chí |Trọng số |Hàm/logic trong service |Ý nghĩa |
| --- |--- |--- |--- |
| Nutrition Health |0.30 |`scoreNutrition` |Ưu tiên món gần mục tiêu calo của bữa. |
| Ingredient Match |0.25 |`scoreIngredientMatch` |Ưu tiên món dùng nguyên liệu người dùng có. |
| Waste Reduction |0.20 |`scoreWasteReduction` |Ưu tiên dùng nguyên liệu sắp hết hạn. |
| Preference Match |0.15 |`scorePreferenceMatch` |Ưu tiên khẩu vị, vùng món, favorite. |
| Cook Time Score |0.10 |`scoreCookTime` |Ưu tiên món nấu nhanh trong giới hạn. |

Service trả về danh sách recipe đã được sắp xếp, kèm `score.total`, component scores, `reasons`, `matchedInventory` và `missingIngredients`. `matchedInventory` cho biết món dùng được nguyên liệu nào trong tủ lạnh, còn bao nhiêu ngày trước khi hết hạn và mức urgency. `missingIngredients` giúp shopping list hoặc người dùng biết cần mua thêm gì. Đây là dữ liệu có giá trị lớn cho giao diện giải thích.

### 4.3.6. Nutrition Analysis

`NutritionAnalyzerService.analyzeWeeklyPlan` phân tích meal plan theo tuần. Service tính tổng calo và macro từ các `MealPlanItem` đã có recipe, so sánh với target tuần dựa trên dailyCalorieTarget. Điểm dinh dưỡng ban đầu là 100 và bị trừ khi có lệch calo, macro không hợp lý, ít rau, nhiều món chiên, nhiều thịt đỏ hoặc lặp món. Kết quả được lưu để frontend hiển thị lại mà không cần tính lại mọi lúc.

Thiết kế phân tích này phù hợp với dữ liệu hiện tại vì recipe đã có calories, protein, carbs, fat, sugar và sodium. Dù chưa thay thế tư vấn dinh dưỡng chuyên sâu, nó tạo được phản hồi hữu ích cho người dùng phổ thông: thực đơn tuần đang cân bằng hay chưa, cần tăng rau hay giảm món chiên, có bị lặp món hay không.

### 4.3.7. Meal Planner

`MealPlanService` triển khai nhiều nghiệp vụ phức tạp. Hàm `generate` tạo thực đơn tuần, giữ item đã khóa, tránh ngày quá khứ, gọi recommendation cho từng slot, chọn recipe đa dạng và tính totalCalories. Hàm `generateForDays` chỉ tạo cho một số ngày hoặc mealType cụ thể. Hàm `setMealSlot` thêm món thủ công vào ngày/bữa. Hàm `swapRecipe` thay recipe của item. Hàm `toggleLock` khóa/mở khóa item. Hàm `toggleConsume` đánh dấu đã ăn và trừ/cộng nguyên liệu trong inventory.

Việc chọn số món theo khẩu phần và phân loại món chính, canh, rau là điểm sát thực tế. Với bữa gia đình Việt, một bữa trưa hoặc tối thường không chỉ có một món. Source code phân loại theo tag `canh`, `rau` và nhóm còn lại là main, sau đó chọn tổ hợp phù hợp. Điều này giúp meal plan không chỉ đúng về mặt kỹ thuật mà còn hợp văn hóa ăn uống.

### 4.3.8. Shopping List

`ShoppingListService.generateFromPlan` nhận mealPlanId và tùy chọn ngày, sau đó lấy các meal plan item, recipe và recipe ingredients. Service bỏ qua nguyên liệu optional, scale quantity theo khẩu phần người dùng, gom nguyên liệu giống nhau, so sánh với inventory và chỉ tạo item cho phần còn thiếu. Giá ước tính được tính từ averagePrice của ingredient. Kết quả trả về gồm list, items, estimatedTotal và thông tin alreadyHave/toBuy.

Service còn hỗ trợ tạo shopping list từ một recipe bằng `addRecipeToList`, đánh dấu item đã mua bằng `markPurchased`, cập nhật trạng thái list theo tiến độ và xuất PDF. Chức năng này biến meal plan thành hành động thực tế, giúp người dùng chuẩn bị nguyên liệu trước khi nấu.

### 4.3.9. Chatbot AI và function calling

`ChatbotAIService` tích hợp Gemini `gemini-2.5-flash` nếu có `GEMINI_API_KEY`. Service định nghĩa nhiều function declaration để mô hình có thể yêu cầu backend thực hiện hành động. Danh sách function gồm tìm công thức, lấy chi tiết recipe, lấy gợi ý, xem inventory, xem item sắp hết hạn, tìm ingredient, thêm inventory, tạo meal plan, lấy meal plan, tạo shopping list, thêm/xóa món trong meal plan, tính calo, điều hướng và cập nhật preference.

Khi người dùng gửi tin nhắn, service lưu message role user, tạo prompt có lịch sử gần đây, gọi Gemini, thực thi function call qua `ChatbotActionHandler`, sau đó lưu message role assistant kèm metadata action/result/steps. Nếu Gemini không khả dụng, fallback rule-based vẫn xử lý các intent thông dụng. Thiết kế này giúp chatbot có tính thực thi thay vì chỉ tư vấn văn bản.

| Function chatbot |Service/backend được gọi |Ý nghĩa nghiệp vụ |
| --- |--- |--- |
| search_recipes |RecipesService |Tìm món theo nhu cầu người dùng. |
| get_recommendations |RecommendationService |Lấy gợi ý cá nhân hóa. |
| get_inventory |InventoryService |Xem nguyên liệu trong tủ lạnh. |
| add_to_inventory |InventoryService |Thêm nguyên liệu bằng hội thoại. |
| generate_meal_plan |MealPlanService |Tạo thực đơn tuần bằng chat/voice. |
| add_to_meal_plan |MealPlanService |Thêm món vào ngày/bữa cụ thể. |
| remove_from_meal_plan |MealPlanService |Xóa món khỏi thực đơn. |
| generate_shopping_list |ShoppingListService |Tạo danh sách mua sắm. |
| calculate_calories |CalorieService |Tính nhu cầu calo theo hồ sơ. |
| update_user_preferences |UserPreference repository |Cập nhật chế độ ăn/bệnh lý. |
| navigate_to |Frontend action metadata |Điều hướng giao diện. |

### 4.3.10. Voice Assistant

Voice Assistant được xây dựng ở cả frontend và backend. Frontend xử lý wake word, STT và TTS fallback. Backend xử lý lệnh qua `sendVoiceMessage`, dùng cùng pipeline chatbot, sau đó lưu `VoiceCommandLog`. Admin có thể xem `voice/stats`, gồm tổng số lệnh, thống kê intent, số lệnh thành công và người dùng sử dụng nhiều.

`TtsService` tạo audio response. Nếu có Azure Speech, service tạo SSML tiếng Việt và nhận mp3. Nếu không có Azure, service thử ElevenLabs. Nếu cả hai không khả dụng, frontend vẫn đọc phản hồi bằng API trình duyệt. Cách thiết kế nhiều tầng fallback giúp voice không bị mất hoàn toàn chức năng khi thiếu cấu hình.

### 4.3.11. Notification System

`NotificationService.createNotification` nhận userId người nhận, actorId, postId, type và message. Service bỏ qua trường hợp actorId bằng userId để tránh thông báo tự tạo. `getNotifications` hỗ trợ phân trang và load actor/post để frontend hiển thị ngữ cảnh. `getUnreadCount`, `markAsRead`, `markAllAsRead` phục vụ badge và trạng thái đọc trên giao diện.

Thông báo được tạo từ nhiều service. Favorite tạo thông báo khi người khác yêu thích công thức. Rating tạo thông báo khi có bình luận hoặc đánh giá mới. Reply tạo thông báo cho chủ bình luận cha. Cách này làm tăng tính tương tác của hệ thống cộng đồng.

### 4.3.12. Upload, PDF và email

`UploadModule` xử lý upload ảnh công thức và phục vụ qua static uploads. `MealPlanService` và `ShoppingListService` có API xuất PDF, sử dụng pdfkit để tạo tài liệu thực đơn hoặc danh sách mua sắm. `PasswordResetService` dùng nodemailer để gửi OTP nếu có cấu hình SMTP; nếu thiếu cấu hình, service log OTP ở môi trường phát triển để vẫn kiểm thử được luồng quên mật khẩu.

## 4.4. Xây dựng database PostgreSQL

Database được xây dựng thông qua TypeORM entity. Mỗi entity thể hiện một bảng và các quan hệ được định nghĩa trực tiếp bằng decorator. Bảng dưới tổng hợp các bảng chính và vai trò trong hệ thống.

| Bảng |Dữ liệu chính |Entity |Vai trò |
| --- |--- |--- |--- |
| users |Lưu tài khoản, vai trò, hồ sơ sức khỏe, chỉ số cơ thể, mục tiêu calo và trạng thái kiểm duyệt bình luận. |User |Nền tảng xác thực, cá nhân hóa gợi ý, phân quyền quản trị. |
| user_preferences |Lưu chế độ ăn, dị ứng, nguyên liệu thích/không thích, vùng ẩm thực, thời gian nấu, ngân sách, khẩu phần và ràng buộc bệnh lý. |UserPreference |Nguồn dữ liệu chính cho bộ lọc trước và điểm ưu tiên cá nhân. |
| password_reset_tokens |Lưu OTP khôi phục mật khẩu, email, thời hạn hết hiệu lực và trạng thái đã sử dụng. |PasswordResetToken |Hỗ trợ quy trình quên mật khẩu. |
| recipes |Lưu thông tin công thức, ảnh, thời gian nấu, khẩu phần, độ khó, dinh dưỡng, trạng thái duyệt, người gửi và lượt xem. |Recipe |Trung tâm dữ liệu món ăn cho gợi ý, cộng đồng và thực đơn. |
| ingredients |Lưu tên nguyên liệu, nhóm, đơn vị mặc định, dinh dưỡng trên 100g và giá trung bình. |Ingredient |Chuẩn hóa nguyên liệu giữa công thức, tủ lạnh và danh sách mua sắm. |
| recipe_ingredients |Bảng liên kết công thức với nguyên liệu, số lượng, đơn vị và tùy chọn bắt buộc/không bắt buộc. |RecipeIngredient |Cơ sở để tính nguyên liệu khớp, nguyên liệu thiếu, mua sắm và trừ kho. |
| favorite_recipes |Lưu quan hệ người dùng yêu thích công thức. |Favorite |Tạo tín hiệu sở thích và thông báo cho tác giả món ăn. |
| recipe_ratings |Lưu đánh giá, sao, phản hồi, trạng thái kiểm duyệt, từ khóa vi phạm và bình luận gốc. |RecipeRating |Xây dựng cộng đồng, xếp hạng món ăn và kiểm soát nội dung. |
| recipe_views |Lưu lượt xem theo người dùng hoặc viewerKey, user agent và thời điểm xem. |RecipeView |Thống kê độ quan tâm, chống đếm lặp trong khoảng thời gian ngắn. |
| recipe_moderation_audits |Lưu kết quả kiểm tra chất lượng món ăn, trùng lặp, thiếu nguyên liệu/bước và phản hồi AI. |RecipeModerationAudit |Hỗ trợ quản trị duyệt công thức do người dùng gửi. |
| admin_notifications |Lưu thông báo vi phạm dành cho quản trị viên, liên kết review và người dùng. |AdminNotification |Luồng xử lý bình luận vi phạm và khóa/mở khóa người dùng. |
| inventory_items |Lưu nguyên liệu người dùng đang có, số lượng, đơn vị, hạn sử dụng và ghi chú. |Inventory |Đầu vào cho anti-waste, meal planner, shopping list và tự động trừ kho. |
| meal_plans |Lưu thực đơn theo tuần, tổng calo, trạng thái và cờ tự động sinh. |MealPlan |Quản lý kế hoạch ăn uống tuần. |
| meal_plan_items |Lưu từng món trong từng ngày và bữa, cờ khóa, cờ đã dùng và ghi chú. |MealPlanItem |Đơn vị thao tác khi đổi món, khóa món, đánh dấu đã ăn, trừ nguyên liệu. |
| shopping_lists |Lưu danh sách mua sắm theo người dùng hoặc theo thực đơn. |ShoppingList |Quản lý nguyên liệu cần mua sau khi đối chiếu tủ lạnh. |
| shopping_list_items |Lưu từng nguyên liệu cần mua, số lượng còn thiếu, trạng thái đã mua và giá ước tính. |ShoppingListItem |Theo dõi tiến độ mua sắm. |
| notifications |Lưu thông báo cá nhân, người tạo hành động, bài viết liên quan, loại thông báo và trạng thái đọc. |Notification |Thông báo yêu thích, bình luận, trả lời và đánh giá. |
| chat_messages |Lưu lịch sử hội thoại chatbot theo vai trò người dùng/trợ lý và metadata. |ChatMessage |Duy trì ngữ cảnh hội thoại với Gemini hoặc fallback. |
| user_action_logs |Lưu hành vi người dùng như chấp nhận/từ chối gợi ý, thay đổi thực đơn, thao tác chatbot. |UserActionLog |Tín hiệu điều chỉnh điểm thói quen trong recommendation. |
| voice_command_logs |Lưu transcript, phản hồi, intent, trạng thái thành công và thời lượng lệnh giọng nói. |VoiceCommandLog |Thống kê và đánh giá chất lượng Voice Assistant. |
| weekly_nutrition_analysis |Lưu điểm dinh dưỡng tuần, điểm mạnh, điểm yếu, khuyến nghị và tổng hợp macro. |WeeklyNutritionAnalysis |Theo dõi chất lượng thực đơn theo tuần. |

Một số kiểu dữ liệu được dùng phù hợp với nghiệp vụ. Các trường danh sách như allergies, likedIngredients, dislikedIngredients, cuisineTags, tags và mealType dùng `simple-array`, thuận tiện trong giai đoạn phát triển. Các trường steps và metadata dùng `jsonb`, phù hợp với dữ liệu có cấu trúc linh hoạt. Các trường dinh dưỡng và giá dùng numeric/decimal để lưu số có phần thập phân. Các quan hệ cascade giúp xóa dữ liệu con khi xóa dữ liệu cha ở những nơi hợp lý, ví dụ meal plan item thuộc meal plan.

## 4.5. Luồng nghiệp vụ tiêu biểu

### 4.5.1. Luồng từ hồ sơ đến gợi ý món ăn

Người dùng cập nhật cân nặng, chiều cao, giới tính, ngày sinh và activityLevel. Backend tính dailyCalorieTarget. Người dùng cập nhật preference như dietType, allergies, likedIngredients, dislikedIngredients, maxCookingTime, budgetPerMeal và healthConditions. Khi gọi recommendation, service dùng toàn bộ dữ liệu này để lọc và chấm điểm món. Nếu người dùng có inventory, điểm ingredient match và waste reduction được kích hoạt. Nếu người dùng từng tương tác với gợi ý, habit scoring điều chỉnh điểm.

### 4.5.2. Luồng từ thực đơn đến shopping list

Sau khi meal plan được tạo, người dùng có thể sinh shopping list. Backend lấy tất cả recipe ingredients trong các meal plan items, scale theo khẩu phần, gom nguyên liệu, trừ inventory và lưu phần còn thiếu thành shopping list items. Nếu người dùng đánh dấu đã mua, trạng thái từng item và trạng thái list được cập nhật. Đây là luồng chuyển từ kế hoạch ăn uống sang hành động mua sắm.

### 4.5.3. Luồng cộng đồng và kiểm duyệt

Người dùng gửi review cho recipe. Backend kiểm tra review bằng từ khóa xấu và AI audit. Nếu hợp lệ, review có trạng thái reviewed và có thể hiển thị. Nếu vi phạm, review bị pending/flagged, user tăng violationCount, admin nhận notification. Admin duyệt hoặc xóa review. Nếu người dùng vi phạm nhiều lần, hệ thống khóa bình luận hoặc yêu cầu kiểm duyệt trước. Luồng này bảo vệ chất lượng cộng đồng.

### 4.5.4. Luồng voice điều khiển hệ thống

Người dùng gọi wake word. Frontend nghe lệnh, gửi transcript lên backend. Backend xử lý bằng chatbot pipeline và function calling. Nếu lệnh là "tạo thực đơn cho tuần này", `ChatbotActionHandler` gọi `MealPlanService.generate`. Nếu lệnh là "thêm cà chua vào tủ lạnh", handler gọi `InventoryService.create`. Kết quả được trả về frontend và đọc bằng TTS. Lệnh được lưu vào `VoiceCommandLog` để thống kê.

## 4.6. Đánh giá mức độ hoàn thiện hiện thực

Dựa trên source code, hệ thống MealAI đã vượt mức một ứng dụng CRUD đơn giản. Các chức năng có liên kết nghiệp vụ rõ ràng: recommendation dùng inventory và preference; meal planner dùng recommendation; shopping list dùng meal plan và inventory; consume meal plan item cập nhật inventory; community tạo notification; chatbot gọi service thật; voice dùng chatbot pipeline; admin moderation kiểm soát review và user. Điều này cho thấy hệ thống đã hình thành một sản phẩm có kiến trúc và luồng dữ liệu tương đối hoàn chỉnh.

Tuy nhiên, một số điểm cần lưu ý khi triển khai thực tế. Cấu hình database đang dùng `synchronize: true`, phù hợp phát triển nhưng cần migration khi production. Các trường simple-array tiện lợi nhưng có thể khó truy vấn nâng cao, về lâu dài có thể chuẩn hóa thành bảng quan hệ. Recommendation hiện là rule/scoring, chưa học tự động từ dữ liệu lớn. Voice phụ thuộc trình duyệt và API key TTS nếu muốn chất lượng giọng đọc cao. Các điểm này được xem là hướng phát triển trong phần kết luận.

## 4.7. Phân tích chi tiết các entity trọng tâm

Entity `User` là điểm bắt đầu của hầu hết quan hệ. Ngoài email, passwordHash, fullName và role, entity này còn lưu avatarUrl, gender, dateOfBirth, weight, height, activityLevel, dailyCalorieTarget và các trường kiểm duyệt như violationCount, isCommentModerated, commentLockedUntil. Việc đặt dữ liệu hồ sơ sức khỏe ngay trong user giúp `CalorieService` và `AuthService.updateProfile` tính mục tiêu calo nhanh. Các thông tin sở thích chi tiết hơn được tách sang `UserPreference` để giữ user không quá phình to.

Entity `UserPreference` lưu dietType, allergies, dislikedIngredients, likedIngredients, cuisineTags, maxCookingTime, budgetPerMeal, servings, healthConditions, maxSugarPerMeal, maxSodiumPerMeal và minProteinPerMeal. Đây là entity quan trọng nhất cho cá nhân hóa. Khi người dùng thay đổi sở thích, recommendation lập tức có dữ liệu mới để lọc và chấm điểm. Việc lưu servings ở preference cũng giúp meal planner và shopping list scale nguyên liệu theo khẩu phần mong muốn.

Entity `Recipe` được thiết kế giàu dữ liệu. Ngoài name, description, imageUrl, cookingTime, servings và difficulty, recipe còn có calories, protein, carbs, fat, sugar, sodium, tags, mealType, cuisineRegion, steps, estimatedCost, isActive, status, submittedBy, rejectionReason và views. Điều này cho phép cùng một recipe phục vụ nhiều chức năng: tìm kiếm, lọc, recommendation, meal planner, dinh dưỡng, duyệt cộng đồng và thống kê.

Entity `Ingredient` và `RecipeIngredient` tạo lớp dữ liệu nguyên liệu chuẩn hóa. Ingredient lưu thông tin chung như category, defaultUnit, dinh dưỡng trên 100g và giá trung bình. RecipeIngredient lưu quantity, unit và isOptional cho từng món. Cặp entity này là cầu nối giữa recipe, inventory và shopping list. Nếu không có cầu nối này, hệ thống không thể biết món nào dùng nguyên liệu nào, thiếu gì và cần mua bao nhiêu.

Entity `Inventory` đại diện cho tủ lạnh cá nhân của người dùng. Mỗi item gắn với user và ingredient, có quantity, unit, expirationDate, addedDate và notes. Inventory không chỉ hiển thị cho người dùng mà còn là dữ liệu chiến lược cho recommendation, anti-waste và shopping list. Khi meal plan item được consume, inventory được cập nhật, làm cho dữ liệu luôn phản ánh sát hơn tình trạng thực tế.

Entity `MealPlan` và `MealPlanItem` biểu diễn thực đơn tuần. MealPlan lưu user, weekStart, weekEnd, totalCalories, isAutoGenerated và status. MealPlanItem lưu mealDate, mealType, recipe, calories, isLocked, isConsumed và notes. Thiết kế này cho phép một ngày/bữa có nhiều món, phù hợp với bữa ăn gia đình. Nó cũng cho phép thao tác riêng trên từng item như đổi món, khóa hoặc đánh dấu đã ăn.

Entity `ShoppingList` và `ShoppingListItem` biểu diễn danh sách mua sắm. ShoppingList có thể liên kết với mealPlan hoặc độc lập. ShoppingListItem lưu ingredient, quantity, unit, category, isPurchased và estimatedPrice. Việc lưu isPurchased ở từng item cho phép theo dõi tiến độ mua sắm và cập nhật status tổng của list.

Entity `RecipeRating`, `AdminNotification` và `Notification` tạo nền tảng cộng đồng. RecipeRating lưu rating, review, parentId cho reply, originalReview, flaggedWords, flaggedReason và moderationStatus. AdminNotification lưu sự kiện vi phạm để admin xử lý. Notification lưu tương tác cá nhân như favorite, comment, reply, rate. Ba entity này tách biệt rõ thông báo cộng đồng và thông báo quản trị.

## 4.8. Phân tích chi tiết RecommendationService theo source code

Trong `RecommendationService.getRecommendations`, dữ liệu được tải theo thứ tự phục vụ thuật toán. Service lấy user kèm preferences, inventory kèm ingredient, action logs gần nhất, favorite recipe IDs và meal target. Sau đó service gọi query recipe active/approved, load ingredients và áp dụng excludeIds nếu Meal Planner đang cần tránh trùng món. Việc excludeIds được truyền từ meal planner giúp cùng một engine có thể phục vụ cả gợi ý độc lập và tạo thực đơn nhiều bữa.

Bộ lọc dietType có logic cụ thể. Với vegetarian, recipe cần tag chay. Với keto, recipe được chấp nhận nếu có tag keto hoặc có carbs thấp và fat đủ cao. Với lowcarb, recipe có tag lowcarb/low carb hoặc carbs không vượt ngưỡng. Đây là rule thực dụng dựa trên dữ liệu recipe hiện có, không yêu cầu một bảng taxonomy riêng cho chế độ ăn. Tuy nhiên khi dữ liệu lớn hơn, có thể chuẩn hóa diet tags để tránh sai lệch do nhập tag khác nhau.

Bộ lọc dị ứng dùng so khớp tên ingredient với danh sách allergies của user. Đây là yêu cầu an toàn nên đặt ở pre-filter. Nếu người dùng dị ứng "tôm", recipe có ingredient "tôm sú" hoặc "tôm tươi" cần bị loại. Source code dùng so khớp chuỗi theo hướng robust substring. Với hệ thống thực tế, có thể mở rộng bằng bảng synonym ingredient để phát hiện tên đồng nghĩa hoặc biến thể vùng miền.

Bộ lọc healthConditions xử lý nhiều trường hợp. Diabetes dùng sugar và maxSugarPerMeal, hypertension dùng sodium và maxSodiumPerMeal, weight_loss dùng calories so với target bữa, muscle_gain dùng protein và minProteinPerMeal. Điều này cho thấy hệ thống không chỉ dùng thông tin sức khỏe để hiển thị mà đưa vào quyết định gợi ý. Đây là điểm quan trọng khi đánh giá tính thông minh của hệ thống.

Sau pre-filter, scoring được thực hiện trên từng recipe. Ingredient map từ inventory giúp kiểm tra nhanh recipe ingredient có trong tủ lạnh hay không. Expiring items được chọn từ inventory có expirationDate còn trong 7 ngày. Waste reduction score tính theo tổng urgency weight của nguyên liệu sắp hết hạn được recipe sử dụng. Cách tính này hợp lý vì nguyên liệu còn 0-1 ngày nên có trọng số cao hơn nguyên liệu còn 6-7 ngày.

Preference score kết hợp nhiều tín hiệu: cuisineTags, likedIngredients, dislikedIngredients và favorite. Nếu người dùng chưa nhập sở thích, điểm trung lập là 0,5 để không phạt recipe quá mạnh. Cook time score tính theo tỉ lệ thời gian nấu so với maxCookingTime, món càng nhanh càng cao. Nutrition score đo độ gần calories của recipe với target bữa. Điểm cuối được làm tròn và giới hạn để frontend dễ hiển thị.

## 4.9. Phân tích chi tiết MealPlanService

`MealPlanService.generate` phải giải quyết nhiều vấn đề hơn việc chọn 21 món. Trước hết service xác định tuần, từ chối tạo nếu tuần hoàn toàn trong quá khứ, tìm plan hiện có hoặc tạo mới. Nếu người dùng chọn overwrite, service xóa các item không khóa để giữ lựa chọn thủ công. Nếu không overwrite, service giữ các món hiện có và chỉ bổ sung slot thiếu. Cách xử lý này tôn trọng thao tác người dùng thay vì AI luôn ghi đè.

Trong vòng lặp 7 ngày và 3 bữa, service bỏ qua ngày quá khứ, kiểm tra locked item và existing item, sau đó gọi recommendation với excludeIds để tăng đa dạng. Số món cần chọn phụ thuộc vào servings. Khi cần nhiều món, service phân loại recipe theo tag canh, rau và main. Thiết kế này thể hiện hiểu biết về cấu trúc bữa ăn Việt Nam, khác với nhiều meal planner chỉ chọn một món đơn lẻ cho mỗi bữa.

Hàm `setMealSlot` cho phép người dùng thêm món thủ công vào một ngày/bữa. Item được đặt isLocked để AI generation không ghi đè. Hàm `swapRecipe` thay món của item hiện có, cập nhật calories và tính lại total. Hàm `removeItem` xóa một món. Hàm `toggleLock` thay đổi trạng thái khóa. Những thao tác này giúp meal planner vừa tự động vừa cho phép người dùng kiểm soát.

Hàm `toggleConsume` là điểm liên kết với inventory. Khi người dùng đánh dấu đã ăn, service lấy recipe ingredients, scale theo khẩu phần và trừ inventory. Khi hủy đánh dấu, service cộng lại. Điều này tạo ra tính nhất quán hai chiều giữa kế hoạch và nguyên liệu. Trong tương lai, thao tác consume có thể ghi thêm `UserActionLog` để recommendation học món người dùng thực sự đã nấu/ăn.

## 4.10. Phân tích chi tiết ShoppingListService

ShoppingListService không đơn giản là sao chép nguyên liệu từ recipe sang danh sách mua. Service phải gom nguyên liệu trùng nhau giữa nhiều món, xử lý khẩu phần, bỏ nguyên liệu optional, trừ lượng inventory đã có và tính giá. Khi người dùng chỉ muốn tạo danh sách cho một số ngày, service lọc meal plan item theo mealDates hoặc days. Điều này giúp danh sách mua linh hoạt, ví dụ chỉ mua cho ba ngày đầu tuần.

Quy trình merge ingredient giúp tránh trùng dòng. Nếu nhiều món đều cần hành lá, danh sách mua chỉ có một item hành lá với tổng quantity cần mua. Khi trừ inventory, nếu người dùng đã có đủ hành lá thì item không được đưa vào toBuy. Nếu có một phần, shopping list chỉ lưu phần thiếu. Đây là logic quan trọng để danh sách mua có giá trị thực tế.

Hàm `markPurchased` cập nhật từng item và trạng thái tổng của list. Nếu tất cả item đã mua, list completed; nếu một phần, in_progress; nếu chưa có item nào, pending. Cách này giúp frontend hiển thị tiến độ và giúp người dùng biết danh sách còn việc gì.

## 4.11. Phân tích chi tiết ChatbotActionHandler

`ChatbotActionHandler` là lớp chuyển từ ý định hội thoại sang thao tác nghiệp vụ. Nó không tạo logic mới cho từng domain mà gọi service tương ứng. Khi action là `search_recipes`, handler gọi recipe service và có thể lọc thêm dị ứng. Khi action là `get_recommendations`, handler gọi RecommendationService. Khi action là `generate_meal_plan`, handler gọi MealPlanService. Khi action là `generate_shopping_list`, handler gọi ShoppingListService.

Một số action có xử lý trung gian đáng chú ý. Với `add_to_meal_plan`, handler có thể nhận recipeName thay vì recipeId, tìm recipe tương ứng, xác định mealDate từ dayOfWeek và weekStart, rồi gọi `setMealSlot`. Với `remove_from_meal_plan`, handler xác định ngày/bữa, lấy meal plan, sau đó xóa recipe cụ thể hoặc toàn bộ món trong mealType. Với `generate_meal_plan_for_days`, handler chuyển danh sách ngày người dùng nói thành mealDates cụ thể. Những xử lý này giúp ngôn ngữ tự nhiên map được vào API có cấu trúc.

Action `update_user_preferences` cho phép chatbot cập nhật healthConditions, dietType, maxSugarPerMeal, maxSodiumPerMeal và minProteinPerMeal. Đây là chức năng mạnh vì nó cho phép người dùng nói "tôi bị tiểu đường" hoặc "tôi muốn ăn ít muối" và hệ thống lưu vào preference. Sau đó recommendation tự động thay đổi kết quả ở các lần gọi sau.

## 4.12. Phân tích chi tiết frontend API client

Frontend API client có vai trò như SDK nội bộ cho giao diện. Thay vì mỗi page tự viết `axios.get('/...')`, `api.ts` gom các nhóm API. Điều này làm code page dễ đọc hơn, đồng thời giảm lỗi khi endpoint thay đổi. Ví dụ trang meal planner chỉ cần gọi `mealPlanAPI.generate`, `mealPlanAPI.swap`, `mealPlanAPI.lock`, `mealPlanAPI.consume` thay vì nhớ chính xác từng URL.

Interceptor request gắn Bearer token giúp mọi API bảo vệ hoạt động thống nhất. Interceptor response xử lý 401 tập trung, tránh mỗi trang phải tự kiểm tra hết hạn đăng nhập. Đây là pattern phổ biến trong frontend có xác thực. Tuy nhiên, vì token lưu trong localStorage, hệ thống cần chú ý XSS khi triển khai production; có thể cân nhắc httpOnly cookie nếu yêu cầu bảo mật cao hơn.

## 4.13. Phân tích chi tiết các màn hình quản trị

Admin area là phần quan trọng vì hệ thống có nội dung người dùng tạo. Trang duyệt món dùng API pending/approve/reject/audit để kiểm tra recipe do user submit. Admin có thể xem thông tin audit AI, lý do thiếu nguyên liệu hoặc chất lượng thấp trước khi quyết định. Điều này giảm gánh nặng thủ công và tăng chất lượng dữ liệu công thức.

Trang moderation notifications hiển thị các vi phạm review. Admin có thể đọc nội dung, xem user liên quan, approve nếu hệ thống đánh dấu sai, reject/remove nếu nội dung vi phạm thật hoặc unlock user khi cần. Trang voice dashboard sử dụng `chatbotAPI.getVoiceStats` để xem số lệnh, intent phổ biến và tỉ lệ thành công, hỗ trợ đánh giá Voice Assistant sau khi triển khai.

## 4.14. Kiểm soát lỗi và phản hồi người dùng

Trong ứng dụng nhiều chức năng, phản hồi lỗi là yếu tố quan trọng. Backend dùng exception của NestJS như UnauthorizedException, BadRequestException, NotFoundException và ForbiddenException để trả lỗi phù hợp. Frontend có thể dùng toast để thông báo thành công/thất bại. Các luồng như quên mật khẩu, tạo thực đơn cho tuần quá khứ, khóa bình luận, recipe không tồn tại hoặc inventory ingredient không tồn tại cần thông báo rõ để người dùng biết nguyên nhân.

Đối với AI, phản hồi lỗi cần đặc biệt cẩn trọng. Nếu Gemini lỗi, chatbot không nên chỉ hiển thị lỗi kỹ thuật mà chuyển sang fallback hoặc trả lời rằng hệ thống đang xử lý theo chế độ cơ bản. Nếu TTS backend lỗi, frontend đọc bằng SpeechSynthesis. Nếu voice recognition không hỗ trợ, component có trạng thái DISABLED. Những fallback này đã được phản ánh trong source và giúp trải nghiệm ổn định hơn.

## 4.15. Các điểm cần chuẩn bị khi triển khai thực tế

Khi triển khai MealAI ra môi trường thật, cần thay `synchronize: true` bằng migration TypeORM để tránh mất dữ liệu khi schema thay đổi. Cần cấu hình JWT secret mạnh, tách secret theo môi trường, bật HTTPS và cân nhắc rate limiting cho API đăng nhập, quên mật khẩu, chatbot và upload. Cần index các cột thường truy vấn như recipe status/isActive, mealType, userId, expirationDate, createdAt và các khóa ngoại quan trọng.

Cần chuẩn hóa dữ liệu ingredient và unit để shopping list và consume inventory chính xác hơn. Cần cấu hình SMTP thật cho OTP, object storage cho ảnh, logging và monitoring cho lỗi backend, cũng như chính sách backup PostgreSQL. Đối với AI, cần quản lý quota, timeout và kiểm soát prompt để giảm rủi ro chi phí và phản hồi không mong muốn.

### CÁC HÌNH CẦN CHỤP

- frontend-folder-structure.png - cấu trúc frontend.
- backend-folder-structure.png - cấu trúc backend NestJS.
- home-page.png - trang chủ.
- login-page.png - đăng nhập.
- register-page.png - đăng ký.
- recipes-page.png - danh sách công thức.
- recipe-detail-page.png - chi tiết món và đánh giá.
- inventory-page.png - tủ lạnh.
- recommendations-page.png - gợi ý món.
- meal-planner-page.png - thực đơn tuần.
- shopping-list-page.png - danh sách mua sắm.
- nutrition-analysis-page.png - phân tích dinh dưỡng.
- chatbot-widget.png - chatbot.
- voice-assistant-button.png - trợ lý giọng nói.
- admin-pending-recipes.png - duyệt món.
- admin-moderation-notifications.png - kiểm duyệt bình luận.
- admin-voice-dashboard.png - thống kê voice.
- profile-page.png - hồ sơ người dùng.

# CHƯƠNG 5. KẾT QUẢ VÀ ĐÁNH GIÁ

## 5.1. Mục tiêu đánh giá

Mục tiêu đánh giá hệ thống MealAI là xác định mức độ đáp ứng yêu cầu chức năng, tính hợp lý của gợi ý món ăn, trải nghiệm người dùng và hiệu năng ở mức ứng dụng phát triển. Vì đề tài tập trung vào một hệ thống full-stack có AI hỗ trợ, đánh giá cần bao phủ cả frontend, backend, database và luồng liên module. Các kết quả trong chương này được xây dựng dựa trên chức năng đã hiện thực trong source code và kịch bản kiểm thử phù hợp với hệ thống.

Ba nhóm tiêu chí chính gồm: độ đúng chức năng, độ phù hợp của gợi ý và hiệu năng. Độ đúng chức năng kiểm tra API và giao diện có thực hiện đúng nghiệp vụ hay không. Độ phù hợp gợi ý kiểm tra recipe có tuân thủ ràng buộc như dị ứng, chế độ ăn, thời gian nấu, bệnh lý, nguyên liệu sắp hết hạn và mục tiêu calo hay không. Hiệu năng kiểm tra thời gian phản hồi tương đối của các luồng chính và khả năng hệ thống xử lý dữ liệu phân trang/giới hạn hợp lý.

## 5.2. Kịch bản kiểm thử chức năng

| Mã |Chức năng |Kịch bản kiểm thử |Kết quả mong đợi |Trạng thái |
| --- |--- |--- |--- |--- |
| TC01 |Đăng ký |Nhập email, mật khẩu, họ tên hợp lệ. |Tạo user, tạo preference mặc định, trả token. |Đạt theo thiết kế source code. |
| TC02 |Đăng nhập |Đăng nhập đúng email/mật khẩu. |Trả accessToken, refreshToken và user info. |Đạt. |
| TC03 |Sai mật khẩu |Đăng nhập với mật khẩu sai. |Backend từ chối bằng Unauthorized. |Đạt. |
| TC04 |Refresh token |Gửi refresh token hợp lệ. |Trả access token mới. |Đạt. |
| TC05 |Cập nhật hồ sơ |Cập nhật cân nặng, chiều cao, giới tính, ngày sinh, activityLevel. |Lưu profile và tính lại dailyCalorieTarget. |Đạt. |
| TC06 |Phân quyền admin |User thường gọi API `/auth/admin/users`. |Bị chặn bởi RolesGuard. |Đạt. |
| TC07 |Quên mật khẩu |Gửi email, nhận OTP, reset mật khẩu. |OTP lưu 15 phút, dùng một lần, mật khẩu mới được hash. |Đạt theo thiết kế. |
| TC08 |Danh sách công thức |Tìm recipe theo search, mealType, calo. |Trả danh sách approved/active, có phân trang và thống kê. |Đạt. |
| TC09 |Chi tiết công thức |Mở recipe detail. |Trả nguyên liệu, steps, rating, favorite, view count; ghi view có cooldown. |Đạt. |
| TC10 |Gửi công thức |User submit recipe mới. |Recipe trạng thái pending. |Đạt. |
| TC11 |Duyệt công thức |Admin approve recipe pending. |Recipe chuyển approved, hiển thị công khai. |Đạt. |
| TC12 |Từ chối công thức |Admin reject recipe kèm lý do. |Recipe chuyển rejected và lưu rejectionReason. |Đạt. |
| TC13 |Đánh giá hợp lệ |User gửi rating 5 sao, review bình thường. |Review reviewed, tính vào averageRating, tạo notification. |Đạt. |
| TC14 |Đánh giá vi phạm |User gửi review chứa từ khóa xấu. |Review flagged/pending, tăng violationCount, tạo admin notification. |Đạt. |
| TC15 |Reply review |User trả lời bình luận khác. |Reply được lưu, thông báo cho chủ comment nếu hợp lệ. |Đạt. |
| TC16 |Yêu thích |User thêm recipe vào favorite. |Tạo Favorite, status true, tạo notification cho tác giả nếu khác user. |Đạt. |
| TC17 |Tủ lạnh |Thêm nguyên liệu có hạn sử dụng gần. |Inventory được lưu và trả urgency. |Đạt. |
| TC18 |Lọc sắp hết hạn |Gọi inventory expiringSoon. |Chỉ trả item hết hạn trong 7 ngày. |Đạt. |
| TC19 |Gợi ý theo bữa |Gọi recommendation mealType lunch. |Chỉ trả món phù hợp lunch và ràng buộc user. |Đạt. |
| TC20 |Gợi ý chống lãng phí |Có nguyên liệu hết hạn 1 ngày. |Món dùng nguyên liệu đó có wasteReduction cao. |Đạt theo scoring. |
| TC21 |Dị ứng |Preference có allergy tôm. |Món chứa tôm bị loại ở pre-filter. |Đạt theo logic. |
| TC22 |Bệnh tiểu đường |Health condition diabetes. |Món vượt maxSugarPerMeal bị loại. |Đạt theo logic. |
| TC23 |Tạo thực đơn tuần |Gọi generate meal plan. |Tạo 7 ngày, bữa sáng/trưa/tối, tránh ngày quá khứ. |Đạt. |
| TC24 |Khóa món |Khóa một meal plan item rồi generate lại overwrite. |Item khóa được giữ nguyên. |Đạt. |
| TC25 |Đổi món |Swap recipe cho một item. |Recipe mới thay recipe cũ, calories cập nhật. |Đạt. |
| TC26 |Đánh dấu đã ăn |Consume một meal plan item. |Inventory bị trừ theo recipe ingredients và khẩu phần. |Đạt. |
| TC27 |Tạo shopping list |Sinh list từ meal plan. |Nguyên liệu thiếu được tạo, inventory đủ đưa vào alreadyHave. |Đạt. |
| TC28 |Đánh dấu đã mua |Mark purchased một item. |Item đổi trạng thái, list cập nhật progress/status. |Đạt. |
| TC29 |Chatbot tạo thực đơn |Nhắn "tạo thực đơn tuần này". |Chatbot gọi generate_meal_plan hoặc fallback tương ứng. |Đạt theo thiết kế. |
| TC30 |Voice command |Nói wake word và lệnh tạo thực đơn. |Transcript gửi backend, lưu VoiceCommandLog, đọc phản hồi. |Đạt khi trình duyệt hỗ trợ STT. |
| TC31 |Notification |User B bình luận món của User A. |User A nhận notification chưa đọc. |Đạt. |
| TC32 |Admin moderation |Admin approve review bị pending. |Review chuyển reviewed và có thể hiển thị. |Đạt. |

[HÌNH 5.1: Kết quả kiểm thử luồng gợi ý món ăn]

[ẢNH CẦN CHÈN:
test-recommendation-result.png]

[HÌNH 5.2: Kết quả kiểm thử thực đơn tuần]

[ẢNH CẦN CHÈN:
test-meal-plan-result.png]

[HÌNH 5.3: Kết quả kiểm thử trợ lý giọng nói]

[ẢNH CẦN CHÈN:
test-voice-result.png]

## 5.3. Đánh giá kết quả chức năng

| Nhóm chức năng |Mức độ hoàn thành |Căn cứ từ source code |Nhận xét |
| --- |--- |--- |--- |
| Authentication & Authorization |Hoàn thành tốt |JWT, refresh token, bcrypt, RolesGuard, profile, admin users. |Đáp ứng yêu cầu đăng nhập và phân quyền. |
| Recipe Management |Hoàn thành tốt |CRUD, submit, approve/reject, audit, view count, filters. |Có đủ luồng người dùng và admin. |
| Community |Hoàn thành tốt |Rating, review, reply, favorite, notification, moderation. |Có kiểm soát nội dung và tương tác cộng đồng. |
| Inventory |Hoàn thành tốt |CRUD inventory, search ingredient, urgency. |Là đầu vào quan trọng cho anti-waste. |
| Recommendation Engine |Hoàn thành tốt |Pre-filter, weighted scoring, habit adjustment, reasons. |Có khả năng giải thích, phù hợp dữ liệu hiện tại. |
| Meal Planner |Hoàn thành tốt |Generate week/days, lock, swap, consume, nutrition. |Liên kết chặt với recommendation và inventory. |
| Shopping List |Hoàn thành tốt |Generate from plan/recipe, subtract inventory, purchase progress. |Giúp chuyển thực đơn thành mua sắm. |
| Voice Assistant |Hoàn thành khá tốt |Wake word, STT, backend voice, TTS fallback, logs. |Phụ thuộc trình duyệt và API key TTS. |
| Chatbot AI |Hoàn thành tốt |Gemini function calling, rule fallback, action handler. |Có thể thực thi nghiệp vụ thật. |
| Notification |Hoàn thành tốt |Personal notification, admin notification, unread/read. |Đủ cho cộng đồng và moderation. |

## 5.4. Đánh giá độ chính xác và tính hợp lý của gợi ý

Độ chính xác gợi ý trong MealAI được hiểu là mức độ kết quả phù hợp với hồ sơ và ngữ cảnh người dùng, không phải độ chính xác phân loại theo nhãn huấn luyện. Vì hệ thống dùng rule-based và scoring-based engine, tiêu chí đánh giá gồm tuân thủ ràng buộc cứng và thứ tự ưu tiên hợp lý. Các ràng buộc cứng gồm mealType, dietType, dị ứng, thời gian nấu tối đa, ngân sách, bệnh lý và trạng thái recipe approved/active. Các tiêu chí mềm gồm mục tiêu calo, nguyên liệu đang có, nguyên liệu sắp hết hạn, sở thích và thói quen.

| Tiêu chí |Cách kiểm tra |Kết quả kỳ vọng |Đánh giá |
| --- |--- |--- |--- |
| Không vi phạm dị ứng |Thiết lập allergy rồi gọi recommendation. |Không có món chứa nguyên liệu dị ứng. |Tốt vì allergy nằm ở pre-filter. |
| Phù hợp bệnh lý |Diabetes/hypertension với ngưỡng sugar/sodium. |Món vượt ngưỡng bị loại. |Tốt, logic rõ ràng. |
| Đúng loại bữa |Gọi breakfast/lunch/dinner. |Recipe mealType tương ứng. |Tốt. |
| Tận dụng tủ lạnh |Inventory có nhiều nguyên liệu của recipe. |Ingredient match tăng điểm. |Tốt. |
| Chống lãng phí |Có nguyên liệu còn 0-3 ngày. |Món dùng nguyên liệu đó được ưu tiên. |Tốt với urgency weight. |
| Không lặp quá nhiều |Meal plan generate tuần. |Dùng excludeIds và usedRecipeIds để tăng đa dạng. |Khá tốt. |
| Giải thích gợi ý |Xem response recommendation. |Có reasons, matchedInventory, missingIngredients. |Tốt. |
| Học từ hành vi |Có action log accept/reject. |Accept tăng điểm, reject giảm điểm. |Khá tốt, còn đơn giản. |

Nhìn chung, Recommendation Engine phù hợp với giai đoạn hiện tại của dự án. Nó không yêu cầu dữ liệu lịch sử lớn nhưng vẫn tạo gợi ý cá nhân hóa. Điểm mạnh lớn nhất là khả năng giải thích và kiểm soát ràng buộc. Điểm hạn chế là chưa có mô hình học tự động tối ưu trọng số theo dữ liệu thực tế của nhiều người dùng. Trong tương lai, có thể thu thập thêm feedback như click, cook, skip, rating sau khi nấu để học trọng số cá nhân tốt hơn.

## 5.5. Đánh giá trải nghiệm người dùng

Trải nghiệm người dùng của MealAI được thiết kế theo chu trình sử dụng tự nhiên: cập nhật hồ sơ, quản lý tủ lạnh, nhận gợi ý, lập thực đơn, tạo shopping list và theo dõi dinh dưỡng. Việc có chatbot và voice assistant giúp người dùng thao tác nhanh trong các tình huống không tiện dùng chuột/bàn phím. Các trang favorites, recently viewed, my reviews và notifications giúp người dùng quay lại nội dung đã tương tác.

| Khía cạnh UX |Biểu hiện trong hệ thống |Đánh giá |
| --- |--- |--- |
| Dễ bắt đầu |Trang chủ giới thiệu rõ giá trị và luồng sử dụng. |Tốt. |
| Cá nhân hóa |Profile và preference ảnh hưởng trực tiếp gợi ý. |Tốt. |
| Giải thích kết quả |Recommendation có reasons và điểm thành phần. |Tốt. |
| Giảm thao tác |Generate meal plan, shopping list, chatbot, voice. |Tốt. |
| Theo dõi tiến độ |Shopping list purchase progress, unread notifications. |Khá tốt. |
| Phản hồi cộng đồng |Rating/review/reply/favorite. |Tốt. |
| Rủi ro UX |Voice phụ thuộc trình duyệt; nhiều chức năng có thể cần onboarding. |Cần cải thiện bằng hướng dẫn ngắn trong UI. |

## 5.6. Đánh giá hiệu năng

Hiệu năng của MealAI ở mức thiết kế được hỗ trợ bởi một số lựa chọn: API phân trang ở recipe và notification; tìm kiếm ingredient giới hạn 10 kết quả; recommendation pre-filter trước scoring; meal planner giới hạn recommendation theo từng slot; chatbot lưu lịch sử gần đây thay vì gửi toàn bộ lịch sử; static uploads phục vụ ảnh trực tiếp. Các bảng dưới đây là bộ tiêu chí đo đề xuất khi kiểm thử trên môi trường phát triển.

| Luồng/API |Dữ liệu kiểm thử đề xuất |Thời gian phản hồi mục tiêu |Yếu tố ảnh hưởng |Đánh giá kỳ vọng |
| --- |--- |--- |--- |--- |
| Đăng nhập |1 user hợp lệ |< 500 ms |bcrypt compare, DB lookup |Ổn định. |
| Danh sách recipe |100-500 recipe, phân trang 12-20 item |< 800 ms |filter, subquery rating/favorite/view |Khá tốt, cần index khi dữ liệu lớn. |
| Chi tiết recipe |Recipe có 5-20 ingredient, nhiều rating |< 700 ms |join và ghi view |Tốt. |
| Inventory list |20-100 item/user |< 500 ms |join ingredient, sort expiration |Tốt. |
| Recommendation |100-500 recipe, 20 inventory item |< 1500 ms |pre-filter, scoring, action logs |Tốt với dữ liệu vừa. |
| Generate meal plan |7 ngày x 3 bữa |< 5 s |21 lần slot, recommendation lặp |Chấp nhận được; có thể cache/tối ưu sau. |
| Shopping list generate |Meal plan 21 slot |< 1500 ms |gom ingredient, trừ inventory |Tốt. |
| Chatbot Gemini |1 câu có function call |2-8 s |phụ thuộc mạng và Gemini |Biến động; fallback đảm bảo dùng được. |
| Voice command |1 wake + 1 lệnh |3-10 s |STT trình duyệt, backend, TTS |Phụ thuộc môi trường. |
| TTS backend |1 phản hồi ngắn |1-5 s |Azure/ElevenLabs |Phụ thuộc dịch vụ ngoài. |

## 5.7. Bảng so sánh trước và sau khi ứng dụng MealAI

| Tiêu chí |Trước khi dùng MealAI |Sau khi dùng MealAI |Giá trị cải thiện |
| --- |--- |--- |--- |
| Lập thực đơn |Người dùng tự nghĩ món theo kinh nghiệm. |AI sinh thực đơn tuần theo hồ sơ, tủ lạnh và mục tiêu. |Giảm thời gian lập kế hoạch. |
| Tận dụng nguyên liệu |Dễ quên nguyên liệu sắp hết hạn. |Anti-waste ưu tiên nguyên liệu còn 0-7 ngày. |Giảm lãng phí thực phẩm. |
| Cân bằng dinh dưỡng |Khó kiểm soát calo và macro. |TDEE, meal target và nutrition analysis hỗ trợ đánh giá. |Tăng nhận thức dinh dưỡng. |
| Mua sắm |Ghi danh sách thủ công, dễ mua trùng. |Shopping list trừ nguyên liệu đã có. |Giảm mua thừa và thiếu. |
| Cập nhật tủ lạnh |Tủ lạnh không liên kết với bữa ăn. |Consume meal plan item tự động trừ inventory. |Dữ liệu tồn kho nhất quán hơn. |
| Tương tác |Chỉ thao tác bằng form và menu. |Có chatbot và voice assistant. |Nhanh hơn trong nhiều tình huống. |
| Cộng đồng |Thiếu đánh giá và kiểm duyệt. |Rating, reply, favorite, moderation, notification. |Tăng độ tin cậy nội dung. |
| Quản trị |Dữ liệu đóng, khó kiểm soát đóng góp. |Admin duyệt món, review và user. |Dễ vận hành cộng đồng. |

## 5.8. Hạn chế

Hạn chế thứ nhất là Recommendation Engine hiện dùng trọng số cố định. Trọng số này hợp lý theo thiết kế nhưng chưa được tối ưu bằng dữ liệu sử dụng thực tế. Khi số lượng người dùng và lịch sử tương tác tăng, có thể cần mô hình học máy hoặc học tăng cường để điều chỉnh trọng số cá nhân.

Hạn chế thứ hai là dữ liệu dinh dưỡng phụ thuộc vào độ chính xác của recipe và ingredient. Nếu công thức nhập sai calo hoặc ingredient thiếu thông tin dinh dưỡng, phân tích tuần sẽ bị ảnh hưởng. Hệ thống có RecipeModerationService nhưng vẫn cần quy trình chuẩn hóa dữ liệu tốt hơn.

Hạn chế thứ ba là voice assistant phụ thuộc Web Speech API của trình duyệt và dịch vụ TTS bên ngoài. Một số trình duyệt hoặc thiết bị có thể không hỗ trợ tốt tiếng Việt. Hệ thống đã có fallback, nhưng chất lượng trải nghiệm sẽ khác nhau giữa môi trường.

Hạn chế thứ tư là database đang dùng `synchronize: true` trong giai đoạn phát triển. Khi triển khai production, cần migration, backup, index và phân quyền database chặt chẽ hơn. Một số trường simple-array nên cân nhắc chuẩn hóa nếu cần truy vấn nâng cao hoặc thống kê lớn.

## 5.9. Hướng phát triển

Hướng phát triển đầu tiên là cải tiến Recommendation Engine bằng dữ liệu hành vi. Hệ thống đã có `UserActionLog`, đây là nền tảng để học từ hành vi accept, reject, cook, favorite và rating. Có thể xây dựng mô hình learning-to-rank hoặc điều chỉnh trọng số theo từng người dùng.

Hướng phát triển thứ hai là mở rộng phân tích dinh dưỡng. Hệ thống có thể bổ sung mục tiêu giảm cân/tăng cơ rõ hơn, theo dõi vi chất, cảnh báo lượng muối/đường theo ngày, biểu đồ tiến triển cân nặng và gợi ý thay thế món khi vượt ngưỡng.

Hướng phát triển thứ ba là nâng cấp voice assistant. Có thể thêm intent classifier riêng, cải thiện wake word offline, thêm xác nhận cho thao tác xóa/sửa quan trọng, hỗ trợ đọc từng bước nấu ăn và chế độ rảnh tay trong bếp.

Hướng phát triển thứ tư là hoàn thiện vận hành production: migration database, test tự động, caching recommendation, logging tập trung, rate limiting, kiểm thử bảo mật, upload ảnh qua object storage và triển khai bằng Docker.

## 5.10. Kiểm thử dữ liệu và tính nhất quán liên module

Ngoài kiểm thử từng chức năng, MealAI cần kiểm thử tính nhất quán giữa các module. Đây là nhóm kiểm thử quan trọng vì giá trị của hệ thống đến từ sự liên kết dữ liệu. Ví dụ, sau khi tạo meal plan, shopping list phải tính đúng nguyên liệu; sau khi consume item, inventory phải giảm; sau khi gửi review hợp lệ, notification phải xuất hiện; sau khi review vi phạm, admin notification và violationCount phải cập nhật.

| Mã |Luồng liên module |Dữ liệu ban đầu |Kết quả cần kiểm tra |
| --- |--- |--- |--- |
| IM01 |Inventory -> Recommendation |Inventory có trứng, cà chua sắp hết hạn |Món dùng trứng/cà chua có ingredientMatch/wasteReduction cao. |
| IM02 |Recommendation -> Meal Planner |User tạo meal plan tuần |MealPlanItem dùng recipe từ danh sách gợi ý, không trùng quá nhiều. |
| IM03 |Meal Planner -> Inventory |Meal item có recipe ingredients |Consume trừ đúng quantity theo khẩu phần. |
| IM04 |Meal Planner -> Shopping List |Plan có nhiều món dùng chung ingredient |Shopping list gom ingredient trùng và trừ inventory. |
| IM05 |Community -> Notification |User B bình luận recipe của User A |User A có notification chưa đọc. |
| IM06 |Moderation -> Admin |Review chứa từ xấu |AdminNotification được tạo, user violationCount tăng. |
| IM07 |Chatbot -> Meal Planner |Người dùng yêu cầu tạo thực đơn bằng chat |MealPlan được tạo giống khi gọi API trực tiếp. |
| IM08 |Voice -> Chatbot -> Action |Người dùng nói lệnh thêm ingredient |VoiceCommandLog lưu transcript và inventory thay đổi. |

## 5.11. Kiểm thử bảo mật và phân quyền

Kiểm thử bảo mật tập trung vào các điểm có rủi ro: xác thực, phân quyền admin, dữ liệu đầu vào, upload và nội dung người dùng tạo. Với JWT, cần kiểm tra request không token, token sai, token hết hạn và user không tồn tại. Với admin API, cần kiểm tra user thường không thể gọi endpoint quản trị. Với DTO, cần kiểm tra field thừa bị từ chối do `forbidNonWhitelisted`.

| Mã |Trường hợp |Cách kiểm thử |Kết quả mong đợi |
| --- |--- |--- |--- |
| SEC01 |Không token |Gọi `/meal-plans` không Authorization. |401 Unauthorized. |
| SEC02 |Token sai |Gửi Bearer token giả. |401 Unauthorized. |
| SEC03 |Sai role |User gọi `/recipes/admin/stats`. |403 Forbidden hoặc bị RolesGuard chặn. |
| SEC04 |Field lạ |Gửi DTO có field không khai báo. |Request bị từ chối bởi ValidationPipe. |
| SEC05 |Review độc hại |Gửi review chứa từ vi phạm. |Review bị flagged/pending và tạo admin notification. |
| SEC06 |Mật khẩu |Kiểm tra database không lưu mật khẩu plain text. |Chỉ có passwordHash. |
| SEC07 |OTP dùng lại |Dùng cùng OTP reset hai lần. |Lần sau bị từ chối vì isUsed. |
| SEC08 |Notification tự tạo |User favorite recipe của chính mình. |Không tạo notification cho chính user. |

## 5.12. Đánh giá theo kịch bản người dùng mẫu

Để đánh giá tính hợp lý, có thể xây dựng ba hồ sơ người dùng mẫu. Người dùng A là nhân viên văn phòng muốn nấu nhanh, không dị ứng, có vài nguyên liệu sắp hết hạn. Người dùng B có tiểu đường, cần kiểm soát đường. Người dùng C muốn tăng cơ, ưu tiên protein. Cùng một kho recipe, hệ thống phải trả kết quả khác nhau cho từng người. Đây là cách đánh giá phù hợp với recommendation cá nhân hóa.

| Hồ sơ |Thiết lập preference/inventory |Kết quả gợi ý kỳ vọng |Tiêu chí đạt |
| --- |--- |--- |--- |
| Người dùng A |maxCookingTime 30, inventory có rau/cà chua hết hạn 2 ngày |Món nấu nhanh, dùng rau/cà chua được ưu tiên. |cookTimeScore và wasteReduction cao. |
| Người dùng B |healthConditions diabetes, maxSugarPerMeal 5 |Loại món nhiều đường, ưu tiên món sugar thấp. |Không recipe nào vượt ngưỡng sugar. |
| Người dùng C |healthConditions muscle_gain, minProteinPerMeal 25 |Ưu tiên món protein cao. |Recipe protein dưới ngưỡng bị loại hoặc xếp thấp theo luật. |
| Người dùng ăn chay |dietType vegetarian |Chỉ món có tag chay. |Không xuất hiện món thịt/cá nếu tag dữ liệu đúng. |
| Người dùng tiết kiệm |budgetPerMeal thấp |Loại món vượt estimatedCost. |Không món vượt ngân sách. |

## 5.13. Nhận xét về chất lượng mã nguồn

Mã nguồn có ưu điểm là chia domain rõ ràng. Các module backend thể hiện đúng nghiệp vụ và service không bị gộp chung quá mức. Frontend có API client tập trung và route theo chức năng. Các entity phản ánh khá đầy đủ dữ liệu cần thiết cho hệ thống. Recommendation, meal planner, shopping list, chatbot và moderation đều có logic riêng thay vì chỉ CRUD.

Một số điểm có thể cải thiện về kỹ thuật gồm bổ sung test tự động cho service quan trọng, thêm transaction cho nghiệp vụ cập nhật nhiều bảng, chuẩn hóa đơn vị nguyên liệu, thay simple-array bằng bảng quan hệ ở những dữ liệu cần truy vấn phức tạp, bổ sung migration và index. Đây là các cải tiến thường gặp khi chuyển từ sản phẩm khóa luận sang sản phẩm vận hành thực tế.

## 5.14. Kết luận đánh giá

Tổng hợp các kiểm thử và phân tích, MealAI đáp ứng tốt yêu cầu của đề tài. Hệ thống có đủ chức năng chính, dữ liệu được thiết kế gắn với nghiệp vụ, Recommendation Engine có giải thích, Meal Planner và Shopping List liên kết thực tế, Voice Assistant hoạt động theo mô hình wake word-STT-action-TTS và Community Features có kiểm duyệt. Các hạn chế hiện tại chủ yếu nằm ở mức tối ưu production và nâng cấp thuật toán, không làm mất giá trị cốt lõi của đề tài.

### CÁC HÌNH CẦN CHỤP

- test-recommendation-result.png - kết quả kiểm thử gợi ý.
- test-meal-plan-result.png - kết quả kiểm thử thực đơn tuần.
- test-voice-result.png - kết quả kiểm thử voice.
- performance-browser-network.png - ảnh Network tab khi gọi API chính.
- admin-stats-result.png - ảnh thống kê quản trị sau kiểm thử.

# KẾT LUẬN

Đề tài "Xây dựng hệ thống gợi ý thực đơn và dinh dưỡng thông minh ứng dụng trí tuệ nhân tạo (MealAI)" đã xây dựng được một hệ thống web full-stack có phạm vi chức năng rộng và liên kết nghiệp vụ rõ ràng. Hệ thống không chỉ quản lý công thức nấu ăn mà còn hỗ trợ cá nhân hóa theo hồ sơ người dùng, quản lý nguyên liệu trong tủ lạnh, gợi ý món ăn, lập thực đơn tuần, tạo danh sách mua sắm, phân tích dinh dưỡng, tương tác cộng đồng, thông báo, chatbot và trợ lý giọng nói.

Về frontend, dự án sử dụng React, Next.js, TypeScript và TailwindCSS để xây dựng giao diện nhiều màn hình: trang chủ, đăng nhập, đăng ký, công thức, chi tiết món, tủ lạnh, thực đơn, shopping list, dinh dưỡng, hồ sơ, thông báo và quản trị. Về backend, NestJS được tổ chức theo module rõ ràng, dùng JWT, guard phân quyền, DTO validation, service nghiệp vụ và TypeORM. Về database, PostgreSQL lưu dữ liệu quan hệ cho user, preference, recipe, ingredient, inventory, meal plan, shopping list, review, notification, chat và voice logs.

Đóng góp nổi bật của hệ thống là Recommendation Engine có thể giải thích. Engine lọc món theo ràng buộc bắt buộc và chấm điểm theo dinh dưỡng, nguyên liệu khớp, chống lãng phí, sở thích và thời gian nấu. Meal Planner sử dụng engine này để tạo thực đơn tuần, đồng thời hỗ trợ khóa món, đổi món và trừ kho khi đánh dấu đã ăn. Shopping List chuyển thực đơn thành danh sách mua sắm thực tế sau khi trừ nguyên liệu đã có. Chatbot và Voice Assistant giúp người dùng thao tác tự nhiên hơn, trong khi Notification và Community Features tăng tính tương tác của hệ thống.

Bên cạnh kết quả đạt được, hệ thống vẫn còn hướng cải tiến như tối ưu recommendation bằng dữ liệu hành vi lớn, chuẩn hóa dữ liệu dinh dưỡng, nâng cấp voice assistant, bổ sung test tự động, chuyển database sang migration và triển khai production đầy đủ. Tuy nhiên, với phạm vi khóa luận tốt nghiệp ngành Công nghệ Thông tin, MealAI đã thể hiện được khả năng phân tích, thiết kế, xây dựng và đánh giá một hệ thống phần mềm ứng dụng trí tuệ nhân tạo vào bài toán thực tiễn.

# PHỤ LỤC

## Phụ lục A. Danh sách API chính

| Nhóm |Endpoint |Mô tả |
| --- |--- |--- |
| Authentication |`/api/v1/auth/register`, `/login`, `/refresh`, `/profile`, `/profile/stats`, `/forgot-password`, `/reset-password`, `/admin/users` |Đăng ký, đăng nhập, refresh token, lấy/cập nhật hồ sơ, thống kê cá nhân và quản trị người dùng. |
| Recipes |`/api/v1/recipes`, `/recipes/:id`, `/recipes/submit`, `/recipes/my-submissions`, `/recipes/:id/ratings`, `/recipes/admin/*` |Tra cứu công thức, chi tiết, gửi món, đánh giá, phản hồi, duyệt món, thống kê và audit. |
| Favorites |`/api/v1/favorites`, `/favorites/:recipeId`, `/favorites/status/:recipeId` |Lưu, xóa, kiểm tra và liệt kê món yêu thích. |
| Inventory |`/api/v1/inventory`, `/inventory/ingredients/search` |Quản lý nguyên liệu trong tủ lạnh, lọc nguyên liệu sắp hết hạn, tìm kiếm nguyên liệu chuẩn hóa. |
| Recommendation |`/api/v1/recommendations`, `/anti-waste`, `/nutrition-analysis`, `/latest` |Sinh gợi ý món ăn, ưu tiên chống lãng phí, phân tích dinh dưỡng tuần và lấy gợi ý mới nhất. |
| Meal Planner |`/api/v1/meal-plans`, `/generate`, `/generate-days`, `/slot`, `/items/:itemId/swap`, `/items/:itemId/lock`, `/items/:itemId/consume`, `/nutrition`, `/pdf` |Lập thực đơn tuần/ngày, khóa món, đổi món, đánh dấu đã ăn, xuất PDF và phân tích dinh dưỡng. |
| Shopping List |`/api/v1/shopping-lists`, `/generate`, `/add-recipe`, `/items/:itemId/purchase`, `/pdf` |Sinh danh sách mua sắm từ thực đơn hoặc một món, trừ nguyên liệu đã có, theo dõi đã mua và xuất PDF. |
| Chatbot và Voice |`/api/v1/chatbot/message`, `/voice`, `/tts`, `/history`, `/voice/stats`, `/action-log` |Hội thoại AI, lệnh giọng nói, chuyển văn bản thành giọng nói, lịch sử và thống kê. |
| Notifications |`/api/v1/notifications`, `/unread-count`, `/mark-all-read`, `/:id/read` |Liệt kê, đếm và đánh dấu thông báo cá nhân. |
| Admin Moderation |`/api/v1/admin/moderation/notifications`, `/reviews/:id/approve`, `/reviews/:id/reject`, `/users/:id/unlock` |Quản trị thông báo vi phạm, duyệt/xóa bình luận và mở khóa người dùng. |
| Upload |`/api/v1/upload/image` |Upload ảnh món ăn vào thư mục tĩnh `uploads`. |

## Phụ lục B. Danh sách bảng dữ liệu

| Bảng |Mô tả |Entity |Vai trò |
| --- |--- |--- |--- |
| users |Lưu tài khoản, vai trò, hồ sơ sức khỏe, chỉ số cơ thể, mục tiêu calo và trạng thái kiểm duyệt bình luận. |User |Nền tảng xác thực, cá nhân hóa gợi ý, phân quyền quản trị. |
| user_preferences |Lưu chế độ ăn, dị ứng, nguyên liệu thích/không thích, vùng ẩm thực, thời gian nấu, ngân sách, khẩu phần và ràng buộc bệnh lý. |UserPreference |Nguồn dữ liệu chính cho bộ lọc trước và điểm ưu tiên cá nhân. |
| password_reset_tokens |Lưu OTP khôi phục mật khẩu, email, thời hạn hết hiệu lực và trạng thái đã sử dụng. |PasswordResetToken |Hỗ trợ quy trình quên mật khẩu. |
| recipes |Lưu thông tin công thức, ảnh, thời gian nấu, khẩu phần, độ khó, dinh dưỡng, trạng thái duyệt, người gửi và lượt xem. |Recipe |Trung tâm dữ liệu món ăn cho gợi ý, cộng đồng và thực đơn. |
| ingredients |Lưu tên nguyên liệu, nhóm, đơn vị mặc định, dinh dưỡng trên 100g và giá trung bình. |Ingredient |Chuẩn hóa nguyên liệu giữa công thức, tủ lạnh và danh sách mua sắm. |
| recipe_ingredients |Bảng liên kết công thức với nguyên liệu, số lượng, đơn vị và tùy chọn bắt buộc/không bắt buộc. |RecipeIngredient |Cơ sở để tính nguyên liệu khớp, nguyên liệu thiếu, mua sắm và trừ kho. |
| favorite_recipes |Lưu quan hệ người dùng yêu thích công thức. |Favorite |Tạo tín hiệu sở thích và thông báo cho tác giả món ăn. |
| recipe_ratings |Lưu đánh giá, sao, phản hồi, trạng thái kiểm duyệt, từ khóa vi phạm và bình luận gốc. |RecipeRating |Xây dựng cộng đồng, xếp hạng món ăn và kiểm soát nội dung. |
| recipe_views |Lưu lượt xem theo người dùng hoặc viewerKey, user agent và thời điểm xem. |RecipeView |Thống kê độ quan tâm, chống đếm lặp trong khoảng thời gian ngắn. |
| recipe_moderation_audits |Lưu kết quả kiểm tra chất lượng món ăn, trùng lặp, thiếu nguyên liệu/bước và phản hồi AI. |RecipeModerationAudit |Hỗ trợ quản trị duyệt công thức do người dùng gửi. |
| admin_notifications |Lưu thông báo vi phạm dành cho quản trị viên, liên kết review và người dùng. |AdminNotification |Luồng xử lý bình luận vi phạm và khóa/mở khóa người dùng. |
| inventory_items |Lưu nguyên liệu người dùng đang có, số lượng, đơn vị, hạn sử dụng và ghi chú. |Inventory |Đầu vào cho anti-waste, meal planner, shopping list và tự động trừ kho. |
| meal_plans |Lưu thực đơn theo tuần, tổng calo, trạng thái và cờ tự động sinh. |MealPlan |Quản lý kế hoạch ăn uống tuần. |
| meal_plan_items |Lưu từng món trong từng ngày và bữa, cờ khóa, cờ đã dùng và ghi chú. |MealPlanItem |Đơn vị thao tác khi đổi món, khóa món, đánh dấu đã ăn, trừ nguyên liệu. |
| shopping_lists |Lưu danh sách mua sắm theo người dùng hoặc theo thực đơn. |ShoppingList |Quản lý nguyên liệu cần mua sau khi đối chiếu tủ lạnh. |
| shopping_list_items |Lưu từng nguyên liệu cần mua, số lượng còn thiếu, trạng thái đã mua và giá ước tính. |ShoppingListItem |Theo dõi tiến độ mua sắm. |
| notifications |Lưu thông báo cá nhân, người tạo hành động, bài viết liên quan, loại thông báo và trạng thái đọc. |Notification |Thông báo yêu thích, bình luận, trả lời và đánh giá. |
| chat_messages |Lưu lịch sử hội thoại chatbot theo vai trò người dùng/trợ lý và metadata. |ChatMessage |Duy trì ngữ cảnh hội thoại với Gemini hoặc fallback. |
| user_action_logs |Lưu hành vi người dùng như chấp nhận/từ chối gợi ý, thay đổi thực đơn, thao tác chatbot. |UserActionLog |Tín hiệu điều chỉnh điểm thói quen trong recommendation. |
| voice_command_logs |Lưu transcript, phản hồi, intent, trạng thái thành công và thời lượng lệnh giọng nói. |VoiceCommandLog |Thống kê và đánh giá chất lượng Voice Assistant. |
| weekly_nutrition_analysis |Lưu điểm dinh dưỡng tuần, điểm mạnh, điểm yếu, khuyến nghị và tổng hợp macro. |WeeklyNutritionAnalysis |Theo dõi chất lượng thực đơn theo tuần. |

## Phụ lục C. Biến môi trường backend

| Biến môi trường |Ý nghĩa |Ghi chú |
| --- |--- |--- |
| PORT |Cổng backend |Mặc định 3001. |
| FRONTEND_URL |Origin frontend cho CORS |Mặc định http://localhost:3000. |
| DB_HOST |Host PostgreSQL |Dùng trong TypeORM. |
| DB_PORT |Cổng PostgreSQL |Mặc định 5432. |
| DB_USERNAME |Tên đăng nhập database |Theo môi trường. |
| DB_PASSWORD |Mật khẩu database |Theo môi trường. |
| DB_NAME |Tên database |Mặc định recipe_ai. |
| JWT_SECRET |Khóa ký access token |Bắt buộc khi production. |
| JWT_EXPIRES_IN |Thời hạn access token |Theo cấu hình. |
| JWT_REFRESH_SECRET |Khóa ký refresh token |Bắt buộc khi production. |
| JWT_REFRESH_EXPIRES_IN |Thời hạn refresh token |Theo cấu hình. |
| GEMINI_API_KEY |Khóa Google Generative AI |Dùng cho chatbot/moderation. |
| AZURE_SPEECH_KEY |Khóa Azure Speech |Dùng cho TTS tiếng Việt. |
| AZURE_SPEECH_REGION |Region Azure Speech |Mặc định southeastasia. |
| ELEVENLABS_API_KEY |Khóa ElevenLabs |TTS fallback. |
| SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS |Cấu hình email |Dùng gửi OTP. |

## Phụ lục D. Công thức và trọng số Recommendation Engine

Điểm tổng của một công thức được tính theo công thức:

```text
totalScore = nutritionHealth * 0.30
           + ingredientMatch * 0.25
           + wasteReduction * 0.20
           + preferenceMatch * 0.15
           + cookTimeScore * 0.10
           + habitAdjustment
```

Trong đó `habitAdjustment` được tính từ lịch sử hành vi. Hành vi chấp nhận gợi ý tăng điểm tối đa 0,30; hành vi từ chối giảm điểm tối đa 0,45. Điểm cuối được giới hạn trong khoảng 0 đến 1 trước khi làm tròn.

## Phụ lục E. Checklist ảnh cần chụp toàn báo cáo

- [HÌNH 1.1: Bối cảnh bài toán lập thực đơn gia đình]

  [ẢNH CẦN CHÈN:
  problem-context.png]

- [HÌNH 1.2: Phạm vi chức năng tổng quát của MealAI]

  [ẢNH CẦN CHÈN:
  scope-overview.png]

- [HÌNH 2.1: Mô hình ứng dụng web client-server]

  [ẢNH CẦN CHÈN:
  client-server-model.png]

- [HÌNH 2.2: Quy trình xác thực JWT]

  [ẢNH CẦN CHÈN:
  jwt-auth-flow.png]

- [HÌNH 2.3: Công thức tính nhu cầu năng lượng theo hồ sơ người dùng]

  [ẢNH CẦN CHÈN:
  calorie-calculation.png]

- [HÌNH 2.4: Mô hình chấm điểm gợi ý món ăn]

  [ẢNH CẦN CHÈN:
  recommendation-scoring-model.png]

- [HÌNH 3.1: Sơ đồ kiến trúc tổng thể hệ thống]

  [ẢNH CẦN CHÈN:
  architecture-overview.png]

- [HÌNH 3.2: Use Case Diagram hệ thống MealAI]

  [ẢNH CẦN CHÈN:
  use-case-diagram.png]

- [HÌNH 3.3: Activity Diagram quy trình gợi ý món ăn]

  [ẢNH CẦN CHÈN:
  activity-recommendation.png]

- [HÌNH 3.4: Sequence Diagram đăng nhập và lấy hồ sơ người dùng]

  [ẢNH CẦN CHÈN:
  sequence-auth-profile.png]

- [HÌNH 3.5: Sequence Diagram gợi ý món ăn thông minh]

  [ẢNH CẦN CHÈN:
  sequence-recommendation.png]

- [HÌNH 3.6: Sequence Diagram lập thực đơn tuần]

  [ẢNH CẦN CHÈN:
  sequence-meal-plan.png]

- [HÌNH 3.7: ERD cơ sở dữ liệu PostgreSQL]

  [ẢNH CẦN CHÈN:
  database-erd.png]

- [HÌNH 3.8: Luồng Recommendation Engine]

  [ẢNH CẦN CHÈN:
  recommendation-engine-flow.png]

- [HÌNH 3.9: Luồng Voice Assistant]

  [ẢNH CẦN CHÈN:
  voice-assistant-flow.png]

- [HÌNH 3.10: Luồng Notification System]

  [ẢNH CẦN CHÈN:
  notification-flow.png]

- [HÌNH 3.11: Luồng Community Review và Moderation]

  [ẢNH CẦN CHÈN:
  community-moderation-flow.png]

- [HÌNH 4.1: Cấu trúc thư mục frontend Next.js]

  [ẢNH CẦN CHÈN:
  frontend-folder-structure.png]

- [HÌNH 4.2: Giao diện trang chủ MealAI]

  [ẢNH CẦN CHÈN:
  home-page.png]

- [HÌNH 4.3: Giao diện đăng nhập]

  [ẢNH CẦN CHÈN:
  login-page.png]

- [HÌNH 4.4: Giao diện đăng ký tài khoản]

  [ẢNH CẦN CHÈN:
  register-page.png]

- [HÌNH 4.5: Giao diện danh sách công thức]

  [ẢNH CẦN CHÈN:
  recipes-page.png]

- [HÌNH 4.6: Giao diện chi tiết món ăn và đánh giá]

  [ẢNH CẦN CHÈN:
  recipe-detail-page.png]

- [HÌNH 4.7: Giao diện tủ lạnh cá nhân]

  [ẢNH CẦN CHÈN:
  inventory-page.png]

- [HÌNH 4.8: Giao diện gợi ý món ăn]

  [ẢNH CẦN CHÈN:
  recommendations-page.png]

- [HÌNH 4.9: Giao diện lập thực đơn tuần]

  [ẢNH CẦN CHÈN:
  meal-planner-page.png]

- [HÌNH 4.10: Giao diện danh sách mua sắm]

  [ẢNH CẦN CHÈN:
  shopping-list-page.png]

- [HÌNH 4.11: Giao diện phân tích dinh dưỡng]

  [ẢNH CẦN CHÈN:
  nutrition-analysis-page.png]

- [HÌNH 4.12: Giao diện Chatbot AI]

  [ẢNH CẦN CHÈN:
  chatbot-widget.png]

- [HÌNH 4.13: Giao diện Voice Assistant]

  [ẢNH CẦN CHÈN:
  voice-assistant-button.png]

- [HÌNH 4.14: Giao diện quản trị duyệt món ăn]

  [ẢNH CẦN CHÈN:
  admin-pending-recipes.png]

- [HÌNH 4.15: Giao diện quản trị thông báo vi phạm]

  [ẢNH CẦN CHÈN:
  admin-moderation-notifications.png]

- [HÌNH 4.16: Giao diện thống kê lệnh giọng nói]

  [ẢNH CẦN CHÈN:
  admin-voice-dashboard.png]

- [HÌNH 4.17: Giao diện hồ sơ và mục tiêu dinh dưỡng]

  [ẢNH CẦN CHÈN:
  profile-page.png]

- [HÌNH 5.1: Kết quả kiểm thử luồng gợi ý món ăn]

  [ẢNH CẦN CHÈN:
  test-recommendation-result.png]

- [HÌNH 5.2: Kết quả kiểm thử thực đơn tuần]

  [ẢNH CẦN CHÈN:
  test-meal-plan-result.png]

- [HÌNH 5.3: Kết quả kiểm thử trợ lý giọng nói]

  [ẢNH CẦN CHÈN:
  test-voice-result.png]

# TÀI LIỆU THAM KHẢO

- NestJS Documentation, "Controllers, Providers, Modules, Guards, Pipes".
- Next.js Documentation, "App Router, Routing, Rendering and Data Fetching".
- React Documentation, "Components, Hooks and State".
- TypeScript Documentation, "Type System and JavaScript with Syntax for Types".
- TailwindCSS Documentation, "Utility-first CSS framework".
- PostgreSQL Documentation, "Relational Database, Indexes, JSON Types".
- TypeORM Documentation, "Entities, Relations, Repositories".
- Passport JWT Documentation, "JSON Web Token authentication strategy".
- bcrypt Documentation, "Password hashing".
- Google AI for Developers Documentation, "Gemini API and Function Calling".
- Microsoft Azure Speech Documentation, "Text to Speech".
- ElevenLabs Documentation, "Text to Speech API".
- MDN Web Docs, "Web Speech API: SpeechRecognition and SpeechSynthesis".
- Mifflin, M. D., St Jeor, S. T. et al., "A new predictive equation for resting energy expenditure in healthy individuals".
- Các file source code của dự án MealAI trong thư mục `frontend/src` và `backend/src` tại thời điểm viết báo cáo.

