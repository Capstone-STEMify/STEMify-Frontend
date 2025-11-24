import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'

export function AITypeSelector() {
  return (
    <Card className='border-2 border-gray-200 bg-gray-50 py-4'>
      <CardHeader>
        <CardTitle className='text-2xl'>1. Chọn loại AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex gap-5'>
          <button className='flex-1 rounded-xl border-3 border-[#4facfe] bg-blue-50 p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg'>
            <h3 className='mb-2 text-lg font-bold'>Image Classification</h3>
            <p className='text-gray-600'>Phân loại hình ảnh theo các class</p>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
