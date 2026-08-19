import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#254f2f",
        }}
      >
        <svg width="280" height="280" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="20" rx="8" ry="1.5" stroke="#f4e3c8" strokeWidth="1.5" />
          <path d="M12 20V5" stroke="#f4e3c8" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 5l6 2.5L12 10" stroke="#f4e3c8" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="6" cy="20" r="1.6" fill="#f4e3c8" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
