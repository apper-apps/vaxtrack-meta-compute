import { motion } from 'framer-motion';

const Loading = ({ type = 'table', className = '' }) => {
  if (type === 'table') {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-md ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 shimmer"></div>
            <div className="h-10 bg-gray-200 rounded w-32 shimmer"></div>
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-40 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-32 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-16 shimmer"></div>
                <div className="h-8 bg-gray-200 rounded w-20 shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-24 shimmer"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full shimmer"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;