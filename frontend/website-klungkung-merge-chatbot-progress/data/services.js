import data from "@/data/services.json";
import anekaSewaImage from "@/assets/aneka-sewa.jpg";
import jasaDokumentasiImage from "@/assets/jasa-dokumentasi.jpg";
import jasaPemanduImage from "@/assets/jasa-pemandu.jpeg";
import penyewaanSelamImage from "@/assets/penyewaan-selam.jpg";
import spaMessageImage from "@/assets/spa-message.jpg";

const imagesByFile = {
  "aneka-sewa.jpg": anekaSewaImage.src,
  "jasa-dokumentasi.jpg": jasaDokumentasiImage.src,
  "jasa-pemandu.jpeg": jasaPemanduImage.src,
  "penyewaan-selam.jpg": penyewaanSelamImage.src,
  "spa-message.jpg": spaMessageImage.src,
};

export const SERVICE_CATEGORIES = data.categories;
export const SERVICES = data.items.map((item) => ({
  ...item,
  image: imagesByFile[item.image] || item.image,
}));
