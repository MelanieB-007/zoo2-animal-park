import DiamandIcon from './DiamandIcon';
import ZoodollarIcon from "./ZoodollarIcon";


export default function PriceDisplay({ value, type }) {
  if (type === 'diamond') {
    return <DiamandIcon value={value} />;
  }
  return <ZoodollarIcon value={value} />;
}