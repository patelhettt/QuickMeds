import React from 'react';

const InventoryFilter = ({ 
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter, 
    companyFilter, 
    setCompanyFilter, 
    stockFilter, 
    setStockFilter,
    categories,
    companies 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="font-semibold text-lg mb-3 text-gray-700">Filter Products</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                    <label className="label">
                        <span className="label-text">Search</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="input input-bordered w-full" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select 
                        className="select select-bordered w-full" 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>

                {/* Company Filter */}
                <div>
                    <label className="label">
                        <span className="label-text">Company</span>
                    </label>
                    <select 
                        className="select select-bordered w-full" 
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                    >
                        <option value="">All Companies</option>
                        {companies.map((company, index) => (
                            <option key={index} value={company.Name}>{company.Name}</option>
                        ))}
                    </select>
                </div>

                {/* Stock Filter */}
                <div>
                    <label className="label">
                        <span className="label-text">Stock Level</span>
                    </label>
                    <select 
                        className="select select-bordered w-full" 
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="all">All Stock Levels</option>
                        <option value="low">Low Stock (≤10)</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex justify-end mt-4 gap-2">
                <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('');
                        setCompanyFilter('');
                        setStockFilter('all');
                    }}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default InventoryFilter; 