import { ProductData } from "../mockData";
import { motion } from 'framer-motion'
import ProductCard from "../card/ProductCard";
import Link from "next/link";

const ProductsGrid: React.FC<{ products: ProductData[] }> = ({ products }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Link href={`/stemify-kit/${product.id}`} key={product.id}>
            <ProductCard key={product.id} product={product} index={index} />
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

export default ProductsGrid;