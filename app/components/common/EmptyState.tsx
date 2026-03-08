import { FileQuestion } from 'lucide-react'

export default function EmptyState({ title, description, action }: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileQuestion size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
