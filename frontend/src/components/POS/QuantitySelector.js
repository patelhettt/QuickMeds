import React, { useState } from 'react';
import { X } from 'lucide-react';

const QuantitySelector = ({ product, onAdd, onClose, maxStock }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= maxStock) {
            setQuantity(value);
        }
    };

    const handleSubmit = () => {
        onAdd(product, quantity);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add to Cart</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Product</p>
                    <p className="font-medium">{product.tradeName || product.Product_name}</p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-2">
                        Quantity (Max: {maxStock})
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={maxStock}
                        className="w-full border rounded-md py-2 px-3 text-center"
                        placeholder="Enter quantity"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector; 