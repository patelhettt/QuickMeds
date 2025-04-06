import React from 'react';
import { FaThList, FaStore } from 'react-icons/fa';
import { Package, ShoppingBag, Info } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { usePOSContext } from './POSContext';
import SearchBar from '../components/POS/SearchBar';
import CategoryFilter from '../components/POS/CategoryFilter';
import ProductCard from '../components/POS/ProductCard';

const POSProductList = () => {
    const { 
        filteredProducts,
        searchTerm,
        setSearchTerm,
        activeCategory,
        setActiveCategory,
        showCategoryFilter,
        user,
        cart,
        addToCart,
        cartQuantity,
        storeInventory,
        error
    } = usePOSContext();

    // Categorize products
    const pharmacyCount = filteredProducts.filter(p => 
        p.type === 'pharmacy' || Boolean(p.Unit_MRP)
    ).length;
    
    const nonPharmacyCount = filteredProducts.filter(p => 
        p.type === 'nonPharmacy' || Boolean(p.unitMrp)
    ).length;

    return (
        <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaStore className="mr-2 text-primary" />
                    Store Inventory
                    <span className="ml-2 badge badge-secondary">
                        {filteredProducts.length}
                    </span>
                </h2>
                
                <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                        {cartQuantity > 0 ? 
                            `${cartQuantity} items in cart` : 
                            'Cart is empty'}
                    </span>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                </div>
            </div>

            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            
            {showCategoryFilter && (
                <CategoryFilter 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory} 
                />
            )}
            
            {/* Store Info Banner */}
            <div className={`${
                error ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-primary/10 border-primary/20 text-primary"
            } border px-4 py-3 rounded-md mb-4`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center">
                        {error ? (
                            <Info className="h-4 w-4 mr-2" />
                        ) : (
                            <FaStore className="h-4 w-4 mr-2" />
                        )}
                        <span className="font-medium text-base">
                            {user.store_name ? `${user.store_name} Inventory` : "No Store Selected"}
                        </span>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {pharmacyCount} Pharmacy Products
                        </span>
                    </div>
                </div>
                {error && (
                    <p className="text-sm mt-1">{error}</p>
                )}
            </div>
            
            {/* Products Grid */}
            <div className="mb-6">
                {filteredProducts.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-2">
                            {searchTerm 
                                ? 'No products found matching your search.' 
                                : user.store_name
                                    ? `No approved items found for ${user.store_name}.`
                                    : 'No products available for your store.'
                            }
                        </p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="text-primary hover:text-secondary text-sm font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredProducts.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    cart={cart} 
                                    addToCart={addToCart} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default POSProductList; 