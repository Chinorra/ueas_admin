import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

const serviceData = [
    {
      "id": 1,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870945/1.png",
      "title": "Vệ sinh công nghiệp",
      "description": "TA Việt Nam là một trong những đơn vị cung cấp dịch vụ vệ sinh công nghiệp uy tín hàng đầu tại Việt Nam. Với đội ngũ nhân viên chuyên nghiệp, giàu kinh nghiệm, cùng hệ thống trang thiết bị hiện đại, TA Việt Nam mang đến cho khách hàng những dịch vụ vệ sinh chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.\nDịch vụ Vệ sinh công nghiệp của TA Việt Nam gồm:\n- Dịch vụ vệ sinh tổng thể\n- Dịch vụ vệ sinh sau xây dựng\n- Dịch vụ vệ sinh định kỳ\n- Đánh bóng sàn đá Marble, Granite, Marble...\n- Đánh bóng sàn bê tông, đá mài...",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU VỆ SINH CÔNG NGHIỆP",
        "customers": [
          {
            "id": 1,
            "name": "khách hàng: Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam - Chi nhánh Hồng Hà",
            "project": "Vệ sinh công nghiệp",
            "job": "vệ sinh văn phòng, toà nhà ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam chi nhánh Hồng Hà",
            "address": "Số 26 Trần Nhật Duật, Phường Đồng Xuân, Quận Hoàn Kiếm, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/customer_1_1.png"
          },
          {
            "id": 2,
            "name": "Công ty Cổ phần JIVC",
            "project": "Vệ sinh công nghiệp",
            "job": "vệ sinh sàn nhà, trần nhà, đánh bóng sàn Công ty Cổ phần JIVC",
            "address": "508 Đường Trường Chinh, P. Ngã Tư Sở, Q. Đống Đa, TP Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_1_2.png"
          },
          {
            "id": 3,
            "name": "Viện pháp y tâm thần trung ương ",
            "project": "Vệ sinh công nghiệp",
            "job": "vệ sinh bàn ghế, giường rủ, nội thất Viện pháp y tâm thần trung ương ",
            "address": "Xã Hòa Bình, Huyện Thường Tín, TP Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_1_3.png"
          },
          {
            "id": 4,
            "name": "Cục Tác chiến điện tử - Bộ Tổng tham mưu",
            "project": "Vệ sinh công nghiệp",
            "job": "vệ sinh vật liệu trang trí nội thất Cục Tác chiến điện tử - Bộ Tổng tham mưu",
            "address": "Ngõ 46, đường Nguyễn Hoàng Tôn, P. Xuân La, Q.Tây Hồ, TP. Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870945/customer_1_4.png"
          }
        ]
      }
    },
    {
      "id": 2,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/2.png",
      "title": "Bảo trì và vệ sinh điện lạnh, thiết bị",
      "description": "Các tòa nhà hiện nay thường sử dụng rất nhiều thiết bị điện lạnh, từ máy điều hòa, tủ lạnh, máy giặt,... đến hệ thống điều hòa trung tâm, kho lạnh,... Những thiết bị này đóng vai trò quan trọng trong việc đảm bảo môi trường sống, làm việc thoải mái và an toàn cho người dân, doanh nghiệp.\n\nViệc bảo trì thiết bị, điện lạnh định kỳ là vô cùng cần thiết để đảm bảo các thiết bị này luôn hoạt động ổn định, hiệu quả, tránh xảy ra hỏng hóc, gián đoạn hoạt động của tòa nhà.\n\nTA Việt Nam là đơn vị được nhiều khách hàng uy tín, lựa chọn là đơn vị cung cấp dịch vụ bảo trì điện lạnh, thiết bị trong nhiều năm.\n\nTA Việt Nam cung cấp dịch vụ vệ sinh và bảo trì các loại thiết bị, hệ thống tòa nhà như:\n- Hệ thống điều hòa thông gió.\n- Hệ thống điện, máy phát điện...\n- Hệ thống trạm biến áp, tủ điện...\n- Hệ thống đèn exit, đèn sự cố, đèn chiếu sáng...\n- Hệ thống thiết bị (quạt đảo trần, đèn...)",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU BẢO TRÌ, SỬA CHỮA ĐIỆN LẠNH – THIẾT BỊ ",
        "customers": [
          {
            "id": 1,
            "name": "Ban Quản trị tòa nhà S1012 KDT Vinhomes Smart City",
            "project": "Bảo trì, sửa chữa điện lạnh - thiết bị",
            "job": "Sửa chữa, bảo trì quạt, điều hoà cụm Vinhomes Smart City",
            "address": "Cụm S1 S2 Khu đô thị Vinhomes Smart City, phường Tây Mỗ, thành phố Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/customer_2_1.png"
          },
          {
            "id": 2,
            "name": "Ban Quản trị tòa nhà S1.02 – KDT Vinhomes Smart City ",
            "project": "Bảo trì, sửa chữa điện lạnh - thiết bị",
            "job": "Sửa chữa, bảo trì máy phát điện khu Vinhomes Smart City",
            "address": "Cụm S1 S2 Khu đô thị Vinhomes Smart City, phường Tây Mỗ, thành phố Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/customer_2_2.png"
          },
          {
            "id": 3,
            "name": "Ban Quản trị tòa nhà S203 – KDT Vinhomes Smart City",
            "project": "Bảo trì, sửa chữa điện lạnh - thiết bị",
            "job": "Sửa chữa, bảo trì đèn hành lang, thang máy khu Vinhomes Smart City",
            "address": "Cụm S1 S2 Khu đô thi Vinhomes Smart City, phường Tây Mỗ, thành phố Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/customer_2_3.png"
          },
          {
            "id": 4,
            "name": "Công ty Cổ phần Xây lắp và Thương mại Thành Đạt",
            "project": "Bảo trì, sửa chữa điện lạnh - thiết bị",
            "job": "Sửa chữa, bảo trì điện lạnh tại Công ty Cổ phần Xây lắp và Thương mại Thành Đạt",
            "address": "Số 36, phố Nguyễn Thái Học, quận Ba Đình, thành phố Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/customer_2_4.png"
          }
        ]
      }
    },
    {
      "id": 3,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/3.png",
      "title": "Bảo trì và vệ sinh hệ thống PCCC",
      "description": "Hệ thống phòng cháy chữa cháy (PCCC) là yếu tố quan trọng nhất đảm bảo an toàn cho con người và tài sản. Hệ thống PCCC cần được bảo trì và vệ sinh định kỳ để đảm bảo hoạt động hiệu quả trong trường hợp xảy ra cháy nổ. TA Việt Nam có đội ngũ nhân viên chuyên nghiệp, được đào tạo bài bản, có đầy đủ trang thiết bị và dụng cụ cần thiết để thực",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU HỆ THỐNG PHÒNG CHÁY CHỮA CHÁY",
        "customers": [
          {
            "id": 1,
            "name": "Cục tác chiến điện tử / Bộ tổng tham mưu",
            "project": "Phòng cháy chữa cháy",
            "job": "Thay thế trang thiết bị, phục vụ công tác phòng cháy chữa cháy tại cục tác chiến điện tử / Bộ tổng tham mưu",
            "address": "Số 46, Nguyễn Hoàng Tôn, Quận Bắc Từ Liêm, thành phố Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/customer_3_1.png"
          }
        ]
      }
    },
    {
      "id": 4,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/4.png",
      "title": "Giặt là (sofa, chăn, ga, gối, đệm, ...)",
      "description": "TA Việt Nam là một trong những đơn vị cung cấp dịch vụ giặt là hàng đầu tại Việt Nam. Với nhiều năm kinh nghiệm hoạt động, TA Việt Nam luôn mang đến cho khách hàng những dịch vụ chất lượng cao, đảm bảo an toàn cho sức khỏe.\n\nĐể đảm bảo sức khỏe của khách hàng, TA Việt Nam sử dụng các loại hóa chất giặt tẩy an toàn, được kiểm định nghiêm ngặt. Các hóa chất này không chứa các chất độc hại như formaldehyde, chlorine,... gây ảnh hưởng đến da, hệ hô hấp và sức khỏe tổng thể.\n\nNgoài ra, TA Việt Nam cũng chú trọng đến quy trình giặt là khép kín, đảm bảo vệ sinh. Các đồ giặt được phân loại theo chất liệu và màu sắc để tránh bị phai màu, hỏng hóc. Sau khi giặt, đồ giặt được sấy khô ở nhiệt độ tiêu chuẩn, giúp loại bỏ vi khuẩn và nấm mốc.\n\nVới phương châm \"Sức khỏe của khách hàng là ưu tiên hàng đầu\", TA Việt Nam luôn nỗ lực mang đến cho khách hàng những dịch vụ giặt là an toàn, chất lượng cao.\n\nDưới đây là một số ưu điểm nổi bật của dịch vụ giặt là TA Việt Nam:\n- Sử dụng hóa chất giặt tẩy an toàn, được kiểm định nghiêm ngặt.\n- Quy trình giặt là khép kín, đảm bảo vệ sinh.\n- Đội ngũ nhân viên chuyên nghiệp, được đào tạo bài bản.\n- Dịch vụ giao nhận tận nơi, nhanh chóng và tiện lợi.",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU GIẶT LÀ",
        "customers": [
          {
            "id": 1,
            "name": "Cư dân tại cụm toà nhà S1 S2 - KĐT Vinhomes Smart City",
            "project": "Giặt là",
            "job": "Giặt là chăn, ga, gối cho cư dân Khu đô thị Vinhomes Smart City",
            "address": "Cụm S1 S2 Khu đô thị Vinhomes Smart City, phường Tây Mỗ, thành phố Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_4_1.png"
          },
          {
            "id": 2,
            "name": "Cư dân tại toà nnhà Golden Palace, Mễ Trì, Nam Từ Liêm, Hà Nội",
            "project": "Giặt là đệm, thảm cho Cư dân tại toà nnhà Golden Palace, Mễ Trì",
            "job": "Giặt là đệm sofa, đệm trải sàn cho cư dân tại toà nhà Golden Palace",
            "address": "Toà nhà Golden Palace, đường Mễ Trì, P.Mễ Trì Hạ, Q.Nam Từ Liêm, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_4_2.png"
          },
          {
            "id": 3,
            "name": "Cư dân tại tòa nhà Vinhomes West Point",
            "project": "Giặt là",
            "job": "Giặt là, phơi khô rèm cửa cho Cư dân tại tòa nhà Vinhomes West Point",
            "address": "Tòa nhà Vinhome WestPoint,đường Phạm Hùng, Phường Mễ Trì, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_4_3.png"
          },
          {
            "id": 4,
            "name": "Cư dân tại khu đô thị the Manor Central Park",
            "project": "Giặt là",
            "job": "Giặt là, sấy khô theo yêu cầu của Cư dân tại khu đô thị the Manor Central Park",
            "address": "Khu đô thị the Manor Central Park, đường Nguyễn Xiển, Quận Hoàng Mai, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/customer_4_4.png"
          }
        ]
      }
    },
    {
      "id": 5,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/5.png",
      "title": "Môi trường, cảnh quan",
      "description": "Dịch vụ thu gom và vận chuyển rác thải là một dịch vụ quan trọng giúp duy trì vệ sinh môi trường. Dịch vụ này bao gồm việc thu gom rác thải từ các hộ gia đình, doanh nghiệp, tổ chức và vận chuyển đến các bãi rác để xử lý.\n Dịch vụ chăm sóc cây xanh là một loại hình dịch vụ cung cấp các công việc cần thiết để duy trì và bảo vệ cây xanh, bao gồm: \n - Cắt tỉa cây.\n - Tưới nướic và bón phân cho cây. \n - Kiểm soát sâu bệnh. \n Vệ sinh cây xanh. \n Dịch vụ tư vấn môi trường: Dịch vụ này bao gồm việc tư cấn cho các doanh nghiệp, tổ cức về các vấn đề môi trường, bao gồm lập báo cáo đánh giá tác động môi trường (EIA), lập kế hoạch quản lý môi trường (EMP), ...",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU MÔI TRƯỜNG, CẢNH QUAN",
        "customers": [
          {
            "id": 1,
            "name": "Viện pháp y Tâm thần Trung ương",
            "project": "Môi trường, cảnh quan",
            "job": "Cắt tỉa, chăm sóc cây xanh, vườn tược tại Viện pháp y Tâm thần Trung ương",
            "address": "Xã Hòa Bình, Huyện Thường Tín, TP Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_5_1.png"
          }
        ]
      }
    },
    {
      "id": 6,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870946/6.jpg",
      "title": "An ninh, bảo về chuyên nghiệp",
      "description": "TA Việt Nam cung cấp dịch vụ cho nhiều đối tượng khách hàng khác nhau, bao gồm các ngân hàng, cơ quan, bệnh viện, người nổi tiếng,...\nDịch vụ an ninh, bảo vệ của TA Việt Nam bao gồm nhiều hạng mục khác nhau, bao gồm:\n- Bảo vệ mục tiêu cố định.\n- Bảo vệ mục tiêu di động.\n- Bảo vệ cá nhân.\n\nĐể đảm bảo chất lượng dịch vụ, TA Việt Nam luôn chú trọng đến việc tuyển chọn và đào tạo đội ngũ nhân viên chuyên nghiệp, có kinh nghiệm. Ngoài ra, TA Việt Nam cũng trang bị đầy đủ các trang thiết bị, phương tiện hiện đại để phục vụ công tác bảo vệ.\n\nVới phương châm \"An toàn của khách hàng là ưu tiên hàng đầu\", TA Việt Nam cam kết mang đến cho khách hàng những dịch vụ an ninh, bảo vệ chất lượng cao, góp phần bảo vệ an toàn cho tài sản và con người.",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU AN NINH, BẢO VỆ",
        "customers": [
          {
            "id": 1,
            "name": "Công ty Cổ phần Xây dựng & Nhân lực Việt Nam",
            "project": "An ninh, bảo vệ",
            "job": "Bảo về, giữ gìn trật tự, an ninh tại ông ty Cổ phần Xây dựng & Nhân lực Việt Nam",
            "address": "Số 162, đường Khuất Duy Tiến, Quận Thanh Xuân, thành phố Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_6_1.jpg"
          }
        ]
      }
    },
    {
      "id": 7,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/7.jpg",
      "title": "Diệt khuẩn, diệt côn trùng",
      "description": "Diệt khuẩn, diệt côn trùng là một trong những việc cần thiết để bảo vệ sức khỏe con người và tài sản. Sử dụng dịch vụ diệt khuẩn, diệt côn trùng mang lại nhiều lợi ích như bảo vệ sức khỏe, bảo vệ tài sản, tăng cường vệ sinh. TA Việt Nam là một trong những công ty cung cấp dịch vụ diệt khuẩn, diệt côn trùng lớn, uy tín tại Việt Nam.\n\nTA Việt Nam đã cung cấp dịch vụ cho nhiều đối tượng khách hàng khác nhau, bao gồm các cơ quan, bệnh viện, nhà máy, văn phòng, tòa nhà, bệnh viện, ngân hàng...\n\nDịch vụ diệt khuẩn, diệt côn trùng của TA Việt Nam bao gồm:\n- **Diệt khuẩn**: Quá trình tiêu diệt các vi sinh vật gây hại cho sức khỏe con người và vật nuôi.\n- **Diệt côn trùng**: Quá trình tiêu diệt các loại côn trùng gây hại như muỗi, ruồi, gián, kiến...\n\nTA Việt Nam luôn chú trọng đến việc tuyển chọn và đào tạo đội ngũ nhân viên chuyên nghiệp, có kinh nghiệm, trang bị đầy đủ các trang thiết bị, phương tiện hiện đại để phục vụ công tác diệt khuẩn, diệt côn trùng.\n\nVới phương châm \"Sức khỏe của khách hàng là ưu tiên hàng đầu\", TA Việt Nam cam kết mang đến cho khách hàng những dịch vụ diệt khuẩn, diệt côn trùng chất lượng cao, góp phần bảo vệ sức khỏe cho con người và tài sản.",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU DỊCH VỤ DIỆT KHUẨN, DIỆT CÔN TRÙNG",
        "customers": [
          {
            "id": 1,
            "name": "Lữ đoàn 84",
            "project": "Diệt khuẩn, diệt côn trùng",
            "job": "Diệt khuẩn, phun thuốc tại Lữ đoàn 84",
            "address": "Lữ đoàn 84, Đa Tốn, Gia Lâm, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_7_1.png"
          },
          {
            "id": 2,
            "name": "Trung tâm Công nghệ Xử lý Bom mìn / Binh chủng Công binh",
            "project": "Diệt khuẩn, diệt côn trùng",
            "job": "Diệt khuẩn, diệt sâu bọ tại Trung tâm Công nghệ Xử lý Bom mìn / Binh chủng Công binh",
            "address": "290 Lạc Long Quân, Tây Hồ, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_7_2.png"
          },
          {
            "id": 3,
            "name": "Viện pháp y Tâm thần Trung ương",
            "project": "Diệt khuẩn, diệt côn trùng",
            "job": "Vệ sinh, diệt khuẩn tại Viện pháp y Tâm thần Trung ương",
            "address": "Xã Hòa Bình, Huyện Thường Tín, TP Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_7_3.png"
          },
          {
            "id": 4,
            "name": "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam - Chi nhánh Hồng Hà",
            "project": "Diệt khuẩn, diệt côn trùng",
            "job": "Diệt khuẩn, diệt côn trùng tại Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam - Chi nhánh Hồng Hà",
            "address": "Số 26 Trần Nhật Duật, Phường Đồng Xuân, Quận Hoàn Kiếm, Hà Nội",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870949/customer_7_4.png"
          }
        ]
      }
    },
    {
      "id": 8,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870947/8.png",
      "title": "Vật tư, vật liệu tiêu hao thiết bị",
      "description": "TA Việt Nam cung cấp dịch vụ mua bán vật tư tiêu hao và thiết bị phục vụ cho nhiều lĩnh vực khác nhau, đáp ứng nhu cầu của doanh nghiệp, tổ chức và cá nhân. Chúng tôi cam kết mang đến sản phẩm chất lượng, giá cả hợp lý và dịch vụ chuyên nghiệp nhằm tối ưu hóa hiệu quả sử dụng và tiết kiệm chi phí cho khách hàng. \n Với kinh nghiệm lâu năm và đội ngũ chuyên nghiệp, TA Việt Nam cam kết mang đến cho khách hàng những sản phẩm chất lượng, đáng tin cậy cùng dịch vụ hậu mãi chu đáo. Liên hệ ngay để được tư vấn chi tiết và nhận báo giá tốt nhất!",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU VẬT TƯ TIÊU HAO THIẾT BỊ",
        "customers": [
          {
            "id": 1,
            "name": "Công ty Cổ phần Xây dựng & Nhân lực Việt Nam",
            "project": "Vật tư, vật liệu tiêu hao thiết bị",
            "job": "sửa chữa, thay thế trang thiết bị thiết yếu tại Công ty Cổ phần Xây dựng & Nhân lực Việt Nam",
            "address": "Số 54, đường Đỗ Bá Công Đạo, phường Nghi Hương, thị xã Cửa Lò, tỉnh Nghệ An.",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870950/customer_8_1.png"
          }
        ]
      }
    },
    {
      "id": 9,
      "service_image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870948/9.png",
      "title": "Đu dây lau kính",
      "description": "TA Việt Nam là một trong những đơn vị cung cấp dịch vụ đu dây lau kính uy tín hàng đầu tại Việt Nam. Với đội ngũ nhân viên chuyên nghiệp, giàu kinh nghiệm, cùng hệ thống trang thiết bị hiện đại, TA Việt Nam mang đến cho khách hàng những dịch vụ vệ sinh chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.",
      "projects": {
        "title": "DỰ ÁN TIÊU BIỂU DỊCH VỤ ĐU DÂY LAU KÍNH",
        "customers": [
          {
            "id": 1,
            "name": "Công ty Cổ phần JIVC",
            "project": "Đu dây lau kính",
            "job": "Vệ sinh cửa kính toà nhà",
            "address": "508 Đường Trường Chinh, P. Ngã Tư Sở, Q. Đống Đa, TP Hà Nội ",
            "image": "https://res.cloudinary.com/dwlhttwro/image/upload/v1748870945/customer_9_1.png"
          }
        ]
      }
    }
  ]

async function uploadData() {
  for (const service of serviceData) {
    const { id, title, service_image, description, projects } = service

    // Insert service
    const { data: insertedService, error: serviceError } = await supabase
    .from('services')
    .insert([
        {
          title: title,
          service_image: service_image,
          description: description,
          project_title: projects.title
        }
      ])
    .select()
    .single()
    
    if (serviceError) {
      console.error('Service Insert Error:', serviceError)
      continue
    }

    //Insert customers
    for (const customer of projects.customers) {
      const { id, name, project, job, address, image } = customer
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          service_id: insertedService.id,
          name,
          project,
          job,
          address,
          image
        })

      if (customerError) {
        console.error('Customer Insert Error:', customerError)
      }
    }
  }

  console.log('✅ All data uploaded!')
}

export {uploadData}