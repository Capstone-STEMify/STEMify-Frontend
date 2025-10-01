export interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  video: string;
  description: string;
  rating: number;
  reviews: number;
}

export const products: ProductData[] = [
  {
    id: 1,
    name: "Premium Headphones",
    category: "Audio",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "Wireless noise-cancelling headphones",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Wearables",
    price: 399,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "Advanced fitness tracking smartwatch",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 3,
    name: "Vintage Camera",
    category: "Photography",
    price: 599,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "Classic design with modern features",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 4,
    name: "Wireless Speaker",
    category: "Audio",
    price: 199,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "360° immersive sound experience",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 5,
    name: "Gaming Console",
    category: "Gaming",
    price: 499,
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "Next-gen gaming experience",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 6,
    name: "Designer Sunglasses",
    category: "Fashion",
    price: 249,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    video: "https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4",
    description: "UV protection with style",
    rating: 4.8,
    reviews: 234
  }
];