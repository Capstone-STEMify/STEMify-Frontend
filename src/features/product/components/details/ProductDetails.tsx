'use client'
import React from "react"
import ProductGallery from "./gallery/ProductGallery ";
import ProductInfo from "./info/ProductInfo";
import ProductDescription from "./description/ProductDescription";
import ProductReviews from "./reviews/ProductReviews";

const ProductDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery />
          <div className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hidden lg:pr-4">
            <ProductInfo />
          </div>
        </div>
        
        {/* <div className="space-y-8">
          <ProductDescription />
          <ProductReviews />
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetails;