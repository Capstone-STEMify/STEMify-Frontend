// buildSceneFromAssembly.ts
import * as THREE from 'three'
import { Assembly, ExportedAssembly } from '@/features/assembly/types/assembly.types'
import { GLTFLoader } from 'three-stdlib'

export async function buildSceneFromAssembly(assembly: ExportedAssembly): Promise<THREE.Scene> {
  const scene = new THREE.Scene()

  /* ================= ENVIRONMENT ================= */
  scene.background = new THREE.Color(assembly.scene.environment.background)

  const ambient = new THREE.AmbientLight(assembly.scene.environment.lighting.ambient)
  scene.add(ambient)

  const dir = assembly.scene.environment.lighting.directional
  const directional = new THREE.DirectionalLight(dir.color, dir.intensity)
  directional.position.set(dir.position.x, dir.position.y, dir.position.z)
  scene.add(directional)

  /* ================= STRAWS ================= */
  for (const strawGroup of assembly.instances.straws) {
    for (const instance of strawGroup.instances) {
      const geometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 16)
      const material = new THREE.MeshStandardMaterial({ color: '#4f46e5' })

      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(instance.transform.position.x, instance.transform.position.y, instance.transform.position.z)

      mesh.rotation.set(instance.transform.rotation.x, instance.transform.rotation.y, instance.transform.rotation.z)

      mesh.scale.set(1,1,1)

      mesh.name = instance.id
      scene.add(mesh)
    }
  }

  /* ================= CONNECTORS ================= */
  const loader = new GLTFLoader()

  for (const connectorGroup of assembly.instances.connectors) {
    for (const instance of connectorGroup.instances) {
      const gltf = await loader.loadAsync('/models/connector_3legs.glb')
      const mesh = gltf.scene.clone()

      mesh.position.set(instance.transform.position.x, instance.transform.position.y, instance.transform.position.z)

      mesh.rotation.set(instance.transform.rotation.x, instance.transform.rotation.y, instance.transform.rotation.z)

      mesh.scale.set(1,1,1)

      mesh.name = instance.id
      scene.add(mesh)
    }
  }

  return scene
}
