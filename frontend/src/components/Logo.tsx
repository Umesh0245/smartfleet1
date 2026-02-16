import SmartFleetLogo from './SmartFleetLogo';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', showText = true, size = 'md' }: LogoProps) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleLogoClick}
      title="Click to reload the application"
    >
      <SmartFleetLogo 
        size={size}
        showText={showText}
        animated={false}
      />
    </div>
  );
};

export default Logo;