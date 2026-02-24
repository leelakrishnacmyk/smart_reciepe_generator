import { Loader } from 'lucide-react';

export default function LoadingSpinner({ message = 'Finding recipes...' }) {
  return (
    <div className="loading-spinner">
      <Loader size={40} className="spin" />
      <p>{message}</p>
    </div>
  );
}
