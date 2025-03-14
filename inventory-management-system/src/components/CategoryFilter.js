import { motion } from 'framer-motion';

const CategoryFilter = ({ activeCategory, onCategoryChange, categories }) => {
  return (
    <div className="relative my-4 flex items-center space-x-2 overflow-x-auto pb-1 hide-scrollbar">
      {categories.map((category) => (
        <div key={category.id} className="relative">
          <button
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeCategory === category.id
                ? 'text-primary-foreground'
                : 'text-foreground/70 hover:text-foreground/90 hover:bg-secondary'
            }`}
          >
            {category.name}
          </button>
          
          {activeCategory === category.id && (
            <motion.div
              layoutId="activeCategoryIndicator"
              className="absolute inset-0 bg-primary rounded-md -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
