import { motion } from 'framer-motion';
import { Printer, ShoppingCart } from 'lucide-react';

const OrderSuccess = ({ orderNumber, onPrintReceipt, onNewOrder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="max-w-md mx-auto glass-panel rounded-xl p-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-primary" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
      <p className="text-muted-foreground mb-6">
        Order #{orderNumber} has been placed successfully.
      </p>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={onPrintReceipt}
          className="flex items-center justify-center w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300"
        >
          <Printer size={18} className="mr-2" />
          Print Receipt
        </button>
        
        <button
          onClick={onNewOrder}
          className="flex items-center justify-center w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg hover:bg-secondary/80 transition-colors duration-300"
        >
          <ShoppingCart size={18} className="mr-2" />
          New Order
        </button>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
