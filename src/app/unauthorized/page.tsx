export default function UnauthorizedPage() {
  return (
    <div className='p-10 text-center'>
      <h1 className='text-3xl font-bold text-red-600'>403 - Unauthorized</h1>
      <p className='mt-4 text-lg text-gray-700'>
        You do not have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
    </div>
  )
}
