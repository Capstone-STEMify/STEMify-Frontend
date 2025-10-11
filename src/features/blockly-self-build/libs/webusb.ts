// Kết nối Micro:bit qua Web Serial
export async function connectToMicrobit(): Promise<SerialPort | null> {
  try {
    if (!('serial' in navigator)) {
      alert('Trình duyệt của bạn không hỗ trợ Web Serial. Hãy dùng Chrome hoặc Edge.')
      return null
    }

    // Hiển thị popup cho người dùng chọn cổng Serial (ví dụ: Micro:bit)
    const port = await navigator.serial.requestPort()
    await port.open({ baudRate: 115200 })
    console.log('Đã kết nối với Micro:bit qua Serial:', port)

    return port
  } catch (error) {
    console.error('Không thể kết nối Micro:bit:', error)
    return null
  }
}

// Gửi dữ liệu (chuỗi lệnh) đến Micro:bit
export async function flashHexToMicrobit(port: SerialPort, message: string): Promise<void> {
  if (!port || !port.writable) {
    alert('Micro:bit chưa được kết nối hoặc không thể ghi dữ liệu.')
    return
  }

  const encoder = new TextEncoder()
  const writer = port.writable.getWriter()

  try {
    console.log('Gửi lệnh đến Micro:bit:', message)
    await writer.write(encoder.encode(message + '\n'))
    console.log('Đã gửi xong.')
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu:', error)
    alert(`Gửi dữ liệu thất bại: ${error}`)
  } finally {
    writer.releaseLock()
  }
}
