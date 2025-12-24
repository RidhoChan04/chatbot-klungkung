import data from "@/data/accommodations.json";
import semabuImage from "@/assets/semabu-hills-hotel-nusa-penida.jpg";
import seaLaVieImage from "@/assets/sea-la-vie-resort-nusa-penida.jpg";
import atalayaImage from "@/assets/atalaya-villas-nusa-penida.jpg";
import kelingkingSunsetImage from "@/assets/kelingking-sunset-point-hotel-spa.jpg";
import lembonganLuxImage from "@/assets/lembongan-lux-villas.jpg";
import sewaMobilImage from "@/assets/sewa-mobil.jpg";
import taksiLokalImage from "@/assets/taksi-lokal.png";
import transportasiUmumImage from "@/assets/transportasi-umum.jpeg";

const imagesById = {
  "semabu-hills-hotel-nusa-penida": semabuImage.src,
  "sea-la-vie-resort-nusa-penida": seaLaVieImage.src,
  "atalaya-villas-nusa-penida": atalayaImage.src,
  "kelingking-sunset-point-hotel-spa": kelingkingSunsetImage.src,
  "lembongan-lux-villas": lembonganLuxImage.src,
};

const imagesByFile = {
  "semabu-hills-hotel-nusa-penida.jpg": semabuImage.src,
  "sea-la-vie-resort-nusa-penida.jpg": seaLaVieImage.src,
  "atalaya-villas-nusa-penida.jpg": atalayaImage.src,
  "kelingking-sunset-point-hotel-spa.jpg": kelingkingSunsetImage.src,
  "lembongan-lux-villas.jpg": lembonganLuxImage.src,
  "sewa-mobil.jpg": sewaMobilImage.src,
  "taksi-lokal.png": taksiLokalImage.src,
  "transportasi-umum.jpeg": transportasiUmumImage.src,
};

export const ACCOMMODATION_CATEGORIES = data.categories;

export const ACCOMMODATION = data.items.map((item) => {
  const resolvedImage = imagesByFile[item.image] || imagesById[item.id] || item.image;
  return {
    ...item,
    image: resolvedImage,
  };
});

export const ACCOMMODATION_GROUPS = data.groups;
