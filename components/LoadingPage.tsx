import React from 'react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skeleton header */}
      <div className="h-16 bg-gray-100 animate-pulse mb-8"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
            <div className="flex gap-2 items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
