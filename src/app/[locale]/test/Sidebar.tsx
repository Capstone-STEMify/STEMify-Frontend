import { components } from './ComponentLibrary'

export default function Sidebar({ onAdd }: { onAdd: (item: any) => void }) {
  return (
    <div className='h-full w-60 overflow-y-auto bg-gray-100 p-4'>
      <h2 className='mb-4 font-bold'>Components</h2>
      {components.map((comp) => (
        <div key={comp.id} className='mb-3'>
          <button className='w-full rounded border bg-white p-2 hover:bg-blue-100' onClick={() => onAdd(comp)}>
            {comp.id}
          </button>
        </div>
      ))}
    </div>
  )
}
