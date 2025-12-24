import data from "@/data/events.json";
import eventKomunitasImage from "@/assets/event-komunitas.jpg";
import festivalBudayaImage from "@/assets/festival-budaya-klungkung.jpg";
import upacaraAdatImage from "@/assets/upacara-adat.jpeg";

const imagesByFile = {
  "event-komunitas.jpg": eventKomunitasImage.src,
  "festival-budaya-klungkung.jpg": festivalBudayaImage.src,
  "upacara-adat.jpeg": upacaraAdatImage.src,
};

export const EVENTS = data.items.map((item) => ({
  ...item,
  poster: imagesByFile[item.poster] || item.poster,
}));
