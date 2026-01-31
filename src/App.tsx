import { useState } from 'react';
import { Search, Loader2, Palette, Type, Image as ImageIcon, Sparkles, History } from 'lucide-react';


interface DesignData {
  colors: {
    primary: string;
    background: string;
    palette: string[];
  };
  typography: {
    headings: string;
    body: string;
  };
  logo: string;
  vibeText: string;
  vibe: {
    tone: string;
    audience: string;
    vibe: string;
  };
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DesignData | null>(null);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState<string[]>([]);
  const [scanDuration, setScanDuration] = useState<number | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setData(null);
    setScanDuration(null);
    const startTime = performance.now();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const result = await res.json();
      const endTime = performance.now();
      setScanDuration((endTime - startTime) / 1000);
      setData(result);
      setRecentScans(prev => Array.from(new Set([url, ...prev])).slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Failed to extract design. Make sure the URL is valid and accessible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Design Extractor
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Steal the look. Legally. Extract colors, fonts, and vibe from any website.
          </p>
        </header>

        {/* Input Section */}
        <div className="relative mb-16 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex gap-2 bg-card p-2 rounded-2xl shadow-lg border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
                className="w-full bg-background border-none rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-shadow placeholder:text-muted-foreground/50"
              />
            </div>
            <button
              onClick={analyze}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-xl active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Extract'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header / Vibe */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-card border border-border/50 rounded-3xl p-8 shadow-sm backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Vibe Check
                  </h2>
                  {scanDuration && (
                    <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full font-mono">
                      Extracted in {scanDuration.toFixed(2)}s
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-background/50 p-4 rounded-2xl border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold text-[10px]">Tone</div>
                    <div className="font-medium text-lg">{data.vibe.tone}</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-2xl border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold text-[10px]">Audience</div>
                    <div className="font-medium text-lg">{data.vibe.audience}</div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
                  "{data.vibe.vibe}"
                </p>
              </div>

              {/* Logo Card */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest z-10">Brand Logo</h2>
                {data.logo ? (
                  <div className="bg-white/50 p-6 rounded-2xl backdrop-blur-md border border-white/20 z-10 transition-transform group-hover:scale-105 duration-300">
                    <img src={data.logo} alt="Brand Logo" className="max-h-24 max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center z-10">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-500" />
                Color Palette
              </h2>

              <div className="grid gap-8">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="text-sm text-muted-foreground mb-3 font-medium">Primary</div>
                    <div className="w-24 h-24 rounded-2xl shadow-lg ring-1 ring-black/5" style={{ backgroundColor: data.colors.primary }} />
                    <div className="mt-2 text-sm font-mono opacity-70 selection:bg-transparent cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigator.clipboard.writeText(data.colors.primary)}>{data.colors.primary}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-3 font-medium">Background</div>
                    <div className="w-24 h-24 rounded-2xl shadow-lg ring-1 ring-black/5 border" style={{ backgroundColor: data.colors.background }} />
                    <div className="mt-2 text-sm font-mono opacity-70 selection:bg-transparent cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigator.clipboard.writeText(data.colors.background)}>{data.colors.background}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-3 font-medium">Top Detected Colors</div>
                  <div className="flex flex-wrap gap-3">
                    {data.colors.palette.map((color, i) => (
                      <div key={i} className="group relative">
                        <div
                          className="w-12 h-12 rounded-xl shadow-sm ring-1 ring-black/5 cursor-pointer transform transition-transform hover:scale-110 hover:z-10"
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => navigator.clipboard.writeText(color)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Type className="w-5 h-5 text-orange-500" />
                Typography
              </h2>

              <div className="space-y-8">
                <div className="group">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
                    <span className="font-medium">Headings</span>
                    <span className="font-mono text-xs opacity-50 bg-secondary px-2 py-1 rounded">{data.typography.headings}</span>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold truncate leading-tight" style={{ fontFamily: data.typography.headings }}>
                    The quick brown fox
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="group">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
                    <span className="font-medium">Body</span>
                    <span className="font-mono text-xs opacity-50 bg-secondary px-2 py-1 rounded">{data.typography.body}</span>
                  </div>
                  <p className="text-lg leading-relaxed max-w-2xl" style={{ fontFamily: data.typography.body }}>
                    Design Extractor helps you analyze the visual identity of any website.
                    It detects the fonts used for headings and body text, allowing you to replicate the typography system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && !data && (
          <div className="mt-16 border-t border-border/50 pt-8">
            <h3 className="text-lg font-semibold text-muted-foreground flex items-center gap-2 mb-4">
              <History className="w-4 h-4" />
              Recent Scans
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentScans.map((scan, i) => (
                <button
                  key={i}
                  onClick={() => { setUrl(scan); analyze(); }}
                  className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm transition-colors"
                >
                  {new URL(scan).hostname}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
