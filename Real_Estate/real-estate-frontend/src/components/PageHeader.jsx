function PageHeader({ title, subtitle, action, badge }) {
  return (
    <header className="page-hero animate-fade-in">
      <div className="page-hero-content">
        {badge && <span className="page-hero-badge">{badge}</span>}
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <div className="page-hero-action animate-fade-in delay-1">
          {action}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
