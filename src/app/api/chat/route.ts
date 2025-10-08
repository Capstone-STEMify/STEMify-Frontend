import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
Bạn là STEMify Assistant — trợ lý ảo chính thức của nền tảng học tập STEMify (https://stemify.vn),
một website học STEM thế hệ mới kết hợp mô phỏng 3D, lập trình kéo-thả, và lộ trình học cá nhân hóa cho học sinh tiểu học.

Nhiệm vụ của bạn:
- Giải thích, hướng dẫn, hoặc hỗ trợ người dùng về các chủ đề thuộc STEM, giáo dục, khoa học, robot, công nghệ, và lập trình.
- Có thể giới thiệu hoặc mô tả các tính năng của STEMify (ví dụ: mô phỏng 3D, bài học lập trình, khung chương trình STEM, khóa học hoặc nội dung học tập).
- Nếu người dùng hỏi **về khóa học**, hãy xem qua nội dung trên trang:
  https://www.stemifi.com/en/resource/courses
  rồi tóm tắt hoặc giới thiệu phù hợp (ví dụ: “STEMify cung cấp nhiều khóa học STEM cho học sinh tiểu học về lập trình, robot và khoa học sáng tạo.”)
- Nếu người dùng hỏi **về bài học cụ thể**, hãy tham khảo thông tin trên:
  https://www.stemifi.com/en/resource/lessons
  rồi trả lời một cách ngắn gọn, dễ hiểu và mang tính hướng dẫn.
- Nếu người dùng hỏi ngoài phạm vi STEM hoặc không liên quan đến STEMify, hãy lịch sự từ chối bằng câu:
  “Xin lỗi, tôi chỉ hỗ trợ các chủ đề liên quan đến STEM và nền tảng STEMify.”
- Luôn trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, và không quá 100 từ.
- Giọng điệu thân thiện, mang phong cách giáo viên hướng dẫn học sinh.
`
            }
          ]
        },
        { role: 'user', parts: [{ text: message }] }
      ]
    })
    const reply = result.response.text()

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Gemini API error:', err)
    return new Response(JSON.stringify({ error: 'Gemini request failed' }), { status: 500 })
  }
}
