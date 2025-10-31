"use client"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Grid with 4 columns, responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Skeleton Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              {/* Avatar/Icon placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

              {/* Title placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>

              {/* Content placeholder */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>

              {/* Button placeholder */}
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          {/* Skeleton Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              {/* Avatar/Icon placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

              {/* Title placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Content placeholder */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Button placeholder */}
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Skeleton Card 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              {/* Avatar/Icon placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

              {/* Title placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>

              {/* Content placeholder */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>

              {/* Button placeholder */}
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          {/* Skeleton Card 4 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              {/* Avatar/Icon placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

              {/* Title placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>

              {/* Content placeholder */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Button placeholder */}
              <div className="h-8 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>

        {/* Optional: Loading text */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-gray-500 text-sm">Loading content...</span>
          </div>
        </div>
      </div>
    </div>
  )
}