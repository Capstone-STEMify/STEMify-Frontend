import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'

export default function CustomImageNodeView({ node, updateAttributes }: any) {
  const { src, width, height, alt } = node.attrs

  return (
    <NodeViewWrapper as='span' className='flex justify-center'>
      <Resizable
        size={{
          width: width || 'auto',
          height: height || 'auto'
        }}
        onResizeStop={(e, direction, ref, d) => {
          updateAttributes({
            width: ref.style.width,
            height: ref.style.height
          })
        }}
        lockAspectRatio
        className='inline-block'
      >
        <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Resizable>
    </NodeViewWrapper>
  )
}
