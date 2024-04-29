function formatDateString(dateString, withTime = false) {
  // Tworzenie obiektu Date na podstawie daty w formacie ISO 8601
  const date = new Date(dateString);

  // Użycie metod Date do pobrania dnia, miesiąca i roku
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Tablica z nazwami miesięcy
  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  // Formatowanie daty
  let formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

  // Jeśli withTime jest ustawione na true, dodaj godzinę i minuty
  if (withTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 godzinny zegar, 0 oznacza 12
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    formattedDate += ` ${hours}:${minutesString} ${ampm}`;
  }

  return formattedDate;
}

function formatDateForInput(dateString) {
  const date = new Date(dateString); // Parsuje datę z MongoDB

  // Tworzy ciąg znaków w formacie ISO (YYYY-MM-DDTHH:MM)
  const isoString = date.toISOString().substring(0, 16);

  // Zwraca sformatowaną wartość dla inputa typu datetime-local
  return isoString;
}

export { formatDateString, formatDateForInput };
