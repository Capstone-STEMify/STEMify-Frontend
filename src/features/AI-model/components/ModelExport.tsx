import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Download } from 'lucide-react'

interface ModelExportProps {
  model: any
  onDownload: () => void
}

export function ModelExport({ model, onDownload }: ModelExportProps) {
  return (
    <Card className='mx-auto w-fit border-2 border-gray-200 py-4'>
      <CardHeader>
        <CardTitle className='text-center text-xl'>Xuất Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-center'>
          <h3 className='mb-4 text-xl font-bold text-gray-800'>{model ? 'Model đã sẵn sàng!' : 'Chưa có model'}</h3>
          <p className='mb-5 text-gray-700'>
            {model ? 'Bạn có thể tải xuống model để sử dụng trong micro:bit' : 'Hãy train model trước để xuất'}
          </p>
          <Button onClick={onDownload} disabled={!model} className='bg-sky-100 text-blue-500'>
            <Download className='mr-2 h-5 w-5' />
            Tải xuống Model
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
