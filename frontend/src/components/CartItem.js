import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const itemName = item.tradeName || item.Product_name;
  const itemPrice = item.Unit_MRP || item.unitMrp;
  const itemStock = item.Stock || item.stock;
  const subtotal = itemPrice * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="glass-panel rounded-lg mb-3 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{itemName}</h4>
            <div className="flex items-baseline mt-1">
              <p className="text-sm text-muted-foreground">${Number(itemPrice).toFixed(2)} each</p>
              <span className="mx-2 text-muted-foreground">×</span>
              <p className="text-sm font-medium">{item.quantity}</p>
            </div>
          </div>
          
          <div className="text-right ml-4">
            <p className="font-semibold">${subtotal.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onDecrease(item._id)}
              disabled={item.quantity <= 1}
              className={`p-1.5 rounded-md ${
                item.quantity <= 1 
                  ? 'text-muted-foreground bg-transparent cursor-not-allowed' 
                  : 'text-foreground hover:bg-secondary transition-colors duration-200'
              }`}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            
            <span className="w-8 text-center font-medium text-sm">
              {item.quantity}
            </span>
            
            <button
              onClick={() => onIncrease(item._id)}
              disabled={item.quantity >= itemStock}
              className={`p-1.5 rounded-md ${
                item.quantity >= itemStock
                  ? 'text-muted-foreground bg-transparent cursor-not-allowed' 
                  : 'text-foreground hover:bg-secondary transition-colors duration-200'
              }`}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item._id)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
            aria-label={`Remove ${itemName} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
