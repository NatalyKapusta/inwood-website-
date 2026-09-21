'use client';

import dynamic from 'next/dynamic';
import type { DoorFitProps } from './DoorFit';

/**
 * Клієнтська обгортка: 3D-частина (three.js, ~600 КБ) вантажиться окремим чанком лише на сторінці примірки
 * й лише в браузері (WebGL на сервері не існує). Імпортуйте цей файл зі сторінки.
 */
const DoorFit = dynamic(() => import('./DoorFit'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[480px] animate-pulse rounded-2xl bg-panel-alt" aria-hidden="true" />
  ),
});

export default function DoorFitLoader(props: DoorFitProps) {
  return <DoorFit {...props} />;
}
