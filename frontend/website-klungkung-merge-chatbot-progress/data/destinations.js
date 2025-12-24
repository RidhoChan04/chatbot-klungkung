import data from "@/data/destinations.json";
import airTerjunPeguyanganImage from "@/assets/air-terjun-peguyangan.jpeg";
import bukitTeletubisImage from "@/assets/bukit-teletubis.jpg";
import kertaGosaImage from "@/assets/kerta-gosa.jpg";
import nusaPenidaImage from "@/assets/nusa-penida.jpg";
import pantaiAtuhImage from "@/assets/pantai-atuh.jpg";
import pantaiCrystalBayImage from "@/assets/pantai-crystal-bay.jpg";
import pantaiDiamondImage from "@/assets/pantai-diamond.jpeg";
import pantaiKusambaImage from "@/assets/pantai-kusamba.jpg";
import pantaiNusaLembonganImage from "@/assets/pantai-nusa-lembongan.jpg";
import pasarSeniImage from "@/assets/pasar-seni.jpg";
import puraGoaLawahImage from "@/assets/pura-goa-lawah.jpg";
import puraPenataranImage from "@/assets/pura-penataran.jpg";
import warungLawarImage from "@/assets/warung-lawar.jpeg";

const imagesByFile = {
  "air-terjun-peguyangan.jpeg": airTerjunPeguyanganImage.src,
  "bukit-teletubis.jpg": bukitTeletubisImage.src,
  "kerta-gosa.jpg": kertaGosaImage.src,
  "nusa-penida.jpg": nusaPenidaImage.src,
  "pantai-atuh.jpg": pantaiAtuhImage.src,
  "pantai-crystal-bay.jpg": pantaiCrystalBayImage.src,
  "pantai-diamond.jpeg": pantaiDiamondImage.src,
  "pantai-kusamba.jpg": pantaiKusambaImage.src,
  "pantai-nusa-lembongan.jpg": pantaiNusaLembonganImage.src,
  "pasar-seni.jpg": pasarSeniImage.src,
  "pura-goa-lawah.jpg": puraGoaLawahImage.src,
  "pura-penataran.jpg": puraPenataranImage.src,
  "warung-lawar.jpeg": warungLawarImage.src,
};

export const DEST_CATEGORIES = data.categories.map((category) => ({
  ...category,
  image: imagesByFile[category.image] || category.image,
}));

export const DESTINATIONS = data.items.map((item) => ({
  ...item,
  media: imagesByFile[item.media] || item.media,
}));
