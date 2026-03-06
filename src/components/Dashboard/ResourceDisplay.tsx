import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { formatNumber, formatRate } from '../../utils/formatters';

interface AnimatedNumberProps {
  value: number;
}

function AnimatedNumber({ value }: AnimatedNumberProps) {
  const spring = useSpring(value, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, (v) => formatNumber(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

interface ResourceDisplayProps {
  minerals: number;
  energy: number;
  mineralsPerSec: number;
  energyPerSec: number;
}

export function ResourceDisplay({
  minerals,
  energy,
  mineralsPerSec,
  energyPerSec,
}: ResourceDisplayProps) {
  return (
    <section className="mb-6">
      <p>
        星際礦物: <AnimatedNumber value={minerals} />
        <span className="text-gray-400 text-sm ml-2">
          ({formatRate(mineralsPerSec)})
        </span>
      </p>
      <p>
        能源: <AnimatedNumber value={energy} />
        <span className="text-gray-400 text-sm ml-2">
          ({formatRate(energyPerSec)})
        </span>
      </p>
    </section>
  );
}
