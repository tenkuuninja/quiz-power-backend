import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform((value: any) =>
    [true, 'enabled', 'true', 1, '1'].includes(value),
  );
}
