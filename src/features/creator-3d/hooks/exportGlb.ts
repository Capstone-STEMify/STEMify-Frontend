// exportGlb.ts
import { buildSceneFromAssembly } from './buildSceneFromAssembly'
import { ExportedAssembly } from '@/features/assembly/types/assembly.types'
import { GLTFExporter } from 'three-stdlib'

export async function exportGLB(assembly: ExportedAssembly, fileName = 'assembly.glb') {
  const scene = await buildSceneFromAssembly(assembly)

  const exporter = new GLTFExporter()

  exporter.parse(
    scene,
    (glb) => {
      const blob = new Blob([glb as ArrayBuffer], {
        type: 'model/gltf-binary'
      })

      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()

      URL.revokeObjectURL(url)
    },
    (error) => {
      console.error('GLB export error:', error)
    },
    { binary: true }
  )
}
