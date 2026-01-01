export const ProductTypeModal = ({ isOpen, onClose, onSelectProductType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-orange-100 rounded-lg p-6 w-116">
        <h2 className="text-lg font-semibold mb-4">What type of product are you listing?</h2>
        <p className="mb-4">Choose the option that best describes your product</p>

        <div className="flex items-center gap-4 mb-4">
          <span role="img" aria-label="physical product">📦</span>
          <button
            onClick={() => onSelectProductType('Physical Product')}
            className="w-full text-left p-2 hover:bg-orange-50 rounded"
          >
            Physical Product
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span role="img" aria-label="digital product">💾</span>
          <button
            onClick={() => onSelectProductType('Digital Product')}
            className="w-full text-left p-2 hover:bg-orange-50 rounded"
          >
            Digital Product
          </button>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 hover:opacity-70 rounded-md text-primary">Cancel</button>
        </div>
      </div>
    </div>
  );
};