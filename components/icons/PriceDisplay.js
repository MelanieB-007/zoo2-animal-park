import DiamandIcon from './DiamandIcon';
import ZoodollarIcon from "./ZoodollarIcon";


export default function PriceDisplay({ value, type }) {
  console.log("type", type);
  if (type === 'diamanten') {
    return <DiamandIcon value={value} />;
  }
  return <ZoodollarIcon value={value} />;
}