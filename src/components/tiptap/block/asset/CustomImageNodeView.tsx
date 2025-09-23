import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'

export default function CustomImageNodeView({ node, updateAttributes }: NodeViewProps) {
  const { src, width, height, textAlign } = node.attrs

  return (
    <NodeViewWrapper as='span' className={`my-2 text-${textAlign}`}>
      <Resizable
        size={{ width: width || 'auto', height: height || 'auto' }}
        onResizeStop={(e, direction, ref, d) => {
          updateAttributes({
            width: ref.style.width,
            height: ref.style.height
          })
        }}
        lockAspectRatio
        className='border border-gray-300'
      >
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Resizable>
    </NodeViewWrapper>
  )
}
