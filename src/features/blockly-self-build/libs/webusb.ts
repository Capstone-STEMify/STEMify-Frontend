export async function connectToMicrobit(): Promise<USBDevice | null> {
  try {
    if (!navigator.usb) {
      alert("Trình duyệt của bạn không hỗ trợ WebUSB. Hãy thử với Google Chrome hoặc Edge.");
      return null;
    }
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x0d28, productId: 0x0204 }],
    });
    console.log("Đã tìm thấy Micro:bit:", device);
    return device;
  } catch (error) {
    console.error("Không thể kết nối với Micro:bit:", error);
    return null;
  }
}

/**
 * Nạp một file hex đã được biên dịch vào Micro:bit.
 * Đây là một hàm ở mức độ khái niệm. Việc triển khai đầy đủ phức tạp hơn nhiều
 * và có thể cần các thư viện như `dapjs` để xử lý giao thức DAPLink.
 *
 * @param {USBDevice} device - Đối tượng thiết bị USB đã kết nối.
 * @param {string} hex - Nội dung file hex dưới dạng chuỗi.
 */
export async function flashHexToMicrobit(device: USBDevice, hex: string): Promise<void> {
    if (!device) {
        alert("Micro:bit chưa được kết nối.");
        return;
    }

    try {
        await device.open();
        console.log("Đã mở kết nối với thiết bị.");

        if (device.configuration === null) {
            await device.selectConfiguration(1);
            console.log("Đã chọn cấu hình.");
        }

        await device.claimInterface(4); // Giao diện WebUSB của DAPLink
        console.log("Đã yêu cầu quyền kiểm soát giao diện.");
        
        // Tại đây, bạn sẽ cần triển khai logic để gửi dữ liệu hex
        // theo giao thức CMSIS-DAP. Đây là một tác vụ rất phức tạp.
        console.log("Bắt đầu quá trình nạp (logic giả định)...");
        alert("Tính năng nạp code đang được phát triển!");
        
        console.log("Nạp thành công (giả định).");

    } catch (error) {
        console.error("Lỗi trong quá trình nạp:", error);
        alert(`Đã xảy ra lỗi: ${error}`);
    } finally {
        // Luôn đóng thiết bị sau khi hoàn tất
        if (device.opened) {
            await device.close();
            console.log("Đã đóng kết nối với thiết bị.");
        }
    }
}