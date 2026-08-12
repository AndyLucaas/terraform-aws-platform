import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
}

export function ChartCard({ title, subtitle, children, height = 260 }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>{children}</div>
      </CardContent>
    </Card>
  );
}
