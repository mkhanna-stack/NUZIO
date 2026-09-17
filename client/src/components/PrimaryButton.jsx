export default function PrimaryButton({ children, onClick, disabled, type = 'button', loading }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary focus-ring w-full py-3.5 rounded-xl2 text-sm font-medium text-white disabled:cursor-not-allowed"
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
