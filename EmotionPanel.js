import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { Heart, Activity } from "lucide-react";

const EMOTION_COLORS = {
  empathy: "#E8B4B8",
  joy: "#E2C275",
  sadness: "#B5B1CB",
  logic: "#A8C0CE",
  neutral: "#8BA888",
};

const EMOTION_LABELS = {
  empathy: "Empathy",
  joy: "Joy",
  sadness: "Compassion",
  logic: "Clarity",
  neutral: "Calm",
};

export default function EmotionPanel({ data }) {
  const hasData = data && data.radar && data.radar.some((d) => d.value > 0);

  const dominantEmotion = data?.counts
    ? Object.entries(data.counts).reduce((a, b) => (b[1] > a[1] ? b : a), ["neutral", 0])[0]
    : "neutral";

  return (
    <div
      className="h-full bg-white border-l border-stone-200/50 flex flex-col"
      data-testid="emotion-panel"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-[#8BA888]" strokeWidth={1.5} />
          <h3
            className="text-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}
          >
            Emotional Landscape
          </h3>
        </div>
        <p className="text-[11px]" style={{ color: "#8A9488" }}>
          How our conversation feels
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#F3F1ED] flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#8A9488]/40" strokeWidth={1} />
            </div>
            <p className="text-xs text-center" style={{ color: "#8A9488" }}>
              Start chatting and I'll map<br />our emotional journey together.
            </p>
          </div>
        ) : (
          <>
            {/* Radar chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={data.radar} outerRadius={75}>
                  <PolarGrid stroke="#E3D5CA" strokeWidth={0.5} />
                  <PolarAngleAxis
                    dataKey="emotion"
                    tick={{ fontSize: 10, fill: "#8A9488" }}
                  />
                  <Radar
                    dataKey="value"
                    fill="#8BA888"
                    fillOpacity={0.2}
                    stroke="#8BA888"
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Dominant mood */}
            <div
              className="p-4 rounded-2xl mb-6"
              style={{ backgroundColor: `${EMOTION_COLORS[dominantEmotion]}15` }}
              data-testid="dominant-emotion"
            >
              <p className="text-[10px] tracking-wide uppercase mb-1" style={{ color: "#8A9488" }}>
                Dominant feeling
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: EMOTION_COLORS[dominantEmotion] }}
                />
                <span className="text-sm font-medium" style={{ color: "#2C332A" }}>
                  {EMOTION_LABELS[dominantEmotion] || dominantEmotion}
                </span>
              </div>
            </div>

            {/* Emotion breakdown */}
            <div className="space-y-3 mb-6">
              <p className="text-[10px] tracking-wide uppercase" style={{ color: "#8A9488" }}>
                Emotion breakdown
              </p>
              {data.radar.map((item) => {
                const key = item.emotion.toLowerCase();
                const emotionKey = Object.keys(EMOTION_COLORS).find(
                  (k) => k === key || EMOTION_LABELS[k]?.toLowerCase() === key
                ) || "neutral";

                return (
                  <div key={item.emotion} className="flex items-center gap-3" data-testid={`emotion-bar-${item.emotion}`}>
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: EMOTION_COLORS[emotionKey] }}
                    />
                    <span className="text-xs flex-1" style={{ color: "#5C665A" }}>
                      {item.emotion}
                    </span>
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: EMOTION_COLORS[emotionKey],
                        }}
                      />
                    </div>
                    <span className="text-[10px] w-8 text-right" style={{ color: "#8A9488" }}>
                      {item.value}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline (recent) */}
            {data.timeline && data.timeline.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] tracking-wide uppercase mb-3" style={{ color: "#8A9488" }}>
                  Recent emotional flow
                </p>
                <div className="flex gap-1 flex-wrap">
                  {data.timeline.slice(-20).map((t, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: EMOTION_COLORS[t.emotion] || EMOTION_COLORS.neutral,
                        opacity: 0.6 + (i / 20) * 0.4,
                      }}
                      title={t.emotion}
                      data-testid={`timeline-dot-${i}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}