import { Pipe, PipeTransform } from '@angular/core';

type Cur = 'UZS' | 'USD';

@Pipe({
  name: 'money',
  standalone: true,
})
export class MoneyPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    currency: Cur = 'UZS',
    opts?: { uzsCutThousands?: boolean } // default: true
  ): string {
    if (value == null) return '0';

    const num = typeof value === 'number' ? value : Number(value);
    const format = (val: number, locale: string) =>
      val.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    if (currency === 'UZS') {
      const cut = opts?.uzsCutThousands ?? true;
      // 1 mln va undan katta bo‘lsa 3 ta nolni “olib tashlash” (÷1000)
      if (cut && Math.abs(num) >= 1_000_000) {
        return format(Math.trunc(num / 1000), 'uz-UZ'); // masalan 1 500 000 -> 1 500
      }
      return format(num, 'uz-UZ');
    }

    // USD uchun .00 yo‘q, qolgan kasrlar ko‘rinsa bo‘ladi
    return format(num, 'en-US');
  }
}
