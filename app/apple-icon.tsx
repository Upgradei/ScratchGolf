import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
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
