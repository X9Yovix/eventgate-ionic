import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTime',
  standalone: true,
})
export class ShortTimePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string | null {
    if (!value) return null;
    const [hours, minutes] = value.split(':');
    return `${hours}:${minutes}`;
  }
}
