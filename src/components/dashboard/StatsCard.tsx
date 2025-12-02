import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  index?: number;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  index = 0,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card variant="stat">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
              {change && (
                <p
                  className={cn(
                    'mt-1 text-sm font-medium',
                    changeType === 'positive' && 'text-success',
                    changeType === 'negative' && 'text-destructive',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
