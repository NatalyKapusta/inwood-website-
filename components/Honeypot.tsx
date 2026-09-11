// Прихована від людей пастка для спам-ботів: справжні відвідувачі не бачать
// і не заповнюють це поле (винесене за межі екрана, приховане від скрінрідерів
// і пропущене табуляцією), а боти, що автоматично заповнюють усі поля форми,
// його заповнюють — тоді lib/isSpam.ts відсіює таку заявку на сервері.
export default function Honeypot() {
  return (
    <input
      type="text"
      name="company_url"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
