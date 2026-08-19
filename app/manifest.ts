import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScratchGolf",
    short_name: "ScratchGolf",
    description: "Personal training tracker for becoming a scratch golfer",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#254f2f",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
