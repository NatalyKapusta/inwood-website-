// Наведення мишкою на 3D-модель захоплює колесо прокрутки під зум/оберт
// моделі — сторінка через нього не скролиться. Ця підказка стоїть поруч
// (не над iframe), щоб було видно, де саме гортати далі.
export default function ScrollHint({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 flex-row items-center justify-center gap-2 py-2 text-navy-dim/70 lg:w-14 lg:flex-col lg:gap-3 lg:py-0">
      <span className="scroll-hint-mouse" aria-hidden="true">
        <span className="scroll-hint-dot" />
      </span>
      <span className="max-w-[6rem] text-center text-xs leading-tight lg:max-w-none lg:[writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
}
