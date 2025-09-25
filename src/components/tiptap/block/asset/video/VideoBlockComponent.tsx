import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'

export default function VideoBlockComponent({ node, updateAttributes }: any) {
  const { src, width, height } = node.attrs

  return (
    <NodeViewWrapper as='div' className='my-4 flex justify-center'>
      <Resizable
        size={{
          width: width || '480px',
          height: height || '270px'
        }}
        // Khi resize xong thì lưu width/height vào node attrs
        onResizeStop={(e, direction, ref, d) => {
          updateAttributes({
            width: ref.style.width,
            height: ref.style.height
          })
        }}
        lockAspectRatio
        className='inline-block'
      >
        <video src={src} controls style={{ width: '100%', height: '100%' }} className='rounded shadow' />
      </Resizable>
    </NodeViewWrapper>
  )
}
