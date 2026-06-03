function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-spinner-wrap">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingSpinner;
