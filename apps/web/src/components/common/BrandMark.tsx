/**
 * Logo plano BN (letras de Big Shoulders Black, `docs/brand/assets/logo-plano.svg`).
 * Toma el color de `currentColor`: usa `text-logo` para que cambie con el modo.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1993 1600" fill="currentColor" aria-hidden="true" className={className}>
      <path
        transform="translate(-99 1600) scale(1 -1)"
        d="M99 0V1600H506Q730 1600 833.0 1509.5Q936 1419 936 1210Q936 1182 936.0 1156.0Q936 1130 934 1104Q927 995 885.0 930.5Q843 866 754 836V788Q846 758 889.0 692.5Q932 627 936 514Q938 481 938.0 453.0Q938 425 936 390Q927 182 828.5 91.0Q730 0 506 0ZM399 264H506Q569 264 602.5 297.5Q636 331 636 394Q636 421 636.0 447.0Q636 473 636 500Q636 599 605.5 640.5Q575 682 506 682H399ZM399 946H506Q569 946 602.5 989.5Q636 1033 636 1112Q636 1141 636.0 1169.5Q636 1198 636 1226Q636 1279 602.5 1307.5Q569 1336 506 1336H399Z"
      />
      <path
        transform="translate(864 1600) scale(1 -1)"
        d="M99 0V1600H589L709 1090L819 264H908L852 914L828 1600H1129V0H615L495 524L413 1338H320L372 614L398 0Z"
      />
    </svg>
  );
}
