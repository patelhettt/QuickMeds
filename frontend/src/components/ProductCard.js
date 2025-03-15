import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = (product.Stock || product.stock) <= 0;
  const productName = product.tradeName || product.Product_name;
  const productPrice = product.Unit_MRP || product.unitMrp;
  const productStock = product.Stock || product.stock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`product-card glass-panel rounded-xl overflow-hidden ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-foreground line-clamp-2">{productName}</h3>
          <div className="ml-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.type === 'Pharmacy' 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {product.type}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">${Number(productPrice).toFixed(2)}</p>
            <p className={`text-xs mt-1 ${
              productStock < 5 && productStock > 0 
                ? 'text-amber-600' 
                : productStock <= 0 
                  ? 'text-destructive' 
                  : 'text-muted-foreground'
            }`}>
              {productStock <= 0 
                ? 'Out of stock' 
                : productStock < 5 
                  ? `Low stock: ${productStock}` 
                  : `In stock: ${productStock}`}
            </p>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`btn-hover-effect rounded-full p-2 ${
              isOutOfStock 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300'
            }`}
            aria-label={`Add ${productName} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
