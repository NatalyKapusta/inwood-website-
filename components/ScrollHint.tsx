// Наведення мишкою на 3D-модель захоплює колесо прокрутки під зум/оберт
// моделі — сторінка через нього не скролиться. Ця підказка стоїть поруч
// (не над iframe), щоб було видно, де саме гортати далі. Навмисно не іконка
// мишки — вона читалась як кнопка, на яку тре клікнути (реальний фідбек);
// стрілка вниз однозначно читається як "тут можна прокручувати", без натяку
// на клікабельність.
export default function ScrollHint({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 flex-row items-center justify-center gap-2 py-2 text-navy-dim/70 lg:w-14 lg:flex-col lg:gap-3 lg:py-0">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="scroll-hint-chevron h-6 w-6 lg:h-7 lg:w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span className="max-w-[8rem] text-center text-xs leading-tight lg:max-w-none lg:[writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
}
