export const PhysicalProductTypeModal = ({ isOpen, onClose, onSelectProductType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-orange-100 rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Physical Product Type</h2>
        <p className="mb-4">How will you fulfill this product?</p>

        <div className="flex items-center gap-4 mb-4">
          <span role="img" aria-label="standard product">✨</span>
          <button
            onClick={() => onSelectProductType('Standard Product')}
            className="w-full text-left p-2 hover:bg-orange-50 rounded"
          >
            Standard Product
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span role="img" aria-label="customizable product">🎨</span>
          <button
            onClick={() => onSelectProductType('Customizable Product')}
            className="w-full text-left p-2 hover:bg-orange-50 rounded"
          >
            Customizable Product
          </button>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 hover:opacity-70 rounded-md text-primary">Cancel</button>
        </div>
      </div>
    </div>
  );
};