/**
 * Design System Component Specification & Stories
 * Documents props, types, and visual states for CryptoAnalyzer design system
 */

import React from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Tooltip } from '../components/common/Tooltip';
import { Skeleton } from '../components/common/Skeleton';
import { Avatar, CoinAvatar } from '../components/common/Avatar';
import { PriceChange } from '../components/common/PriceChange';
import { MetricCard } from '../components/common/MetricCard';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { ChartWrapper } from '../components/common/ChartWrapper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/common/Tabs';
import { Search, Zap } from 'lucide-react';

export const ButtonStories = {
  title: 'DesignSystem/Button',
  variants: [
    <Button key="pri" variant="primary">Primary Action</Button>,
    <Button key="sec" variant="secondary">Secondary Action</Button>,
    <Button key="out" variant="outline">Outline Action</Button>,
    <Button key="gho" variant="ghost">Ghost Action</Button>,
    <Button key="dan" variant="danger">Danger Action</Button>,
    <Button key="load" variant="primary" isLoading>Loading State</Button>,
  ],
};

export const InputStories = {
  title: 'DesignSystem/Input',
  examples: [
    <Input key="norm" placeholder="Standard input..." />,
    <Input key="icon" startIcon={<Search className="w-4 h-4" />} placeholder="Search coins (e.g. BTC)..." />,
    <Input key="err" error="Please enter a valid price threshold" defaultValue="-150" />,
  ],
};

export const BadgeStories = {
  title: 'DesignSystem/Badge',
  examples: [
    <Badge key="def" variant="default">Default</Badge>,
    <Badge key="suc" variant="success">Bullish 68%</Badge>,
    <Badge key="dan" variant="danger">Bearish 74%</Badge>,
    <Badge key="war" variant="warning">High Volatility</Badge>,
    <Badge key="inf" variant="info">Inference Complete</Badge>,
  ],
};

export const MetricCardStories = {
  title: 'DesignSystem/MetricCard',
  examples: [
    <MetricCard
      key="mc1"
      label="Bitcoin Live Spot"
      value="$77,092.40"
      change={2.35}
      subtext="Binance Spot WebSocket"
      icon={<Zap className="w-4 h-4 text-emerald-400" />}
      variant="highlight"
    />,
  ],
};

export const RegimeBadgeStories = {
  title: 'DesignSystem/RegimeBadge',
  examples: [
    <RegimeBadge key="b" regime="Bull" confidence={82} showConfidence />,
    <RegimeBadge key="be" regime="Bear" confidence={75} showConfidence />,
    <RegimeBadge key="s" regime="Sideways" confidence={61} showConfidence />,
    <RegimeBadge key="h" regime="High Volatility" confidence={90} showConfidence />,
  ],
};
