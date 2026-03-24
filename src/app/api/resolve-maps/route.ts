import { NextRequest, NextResponse } from "next/server";

// ── Coordinate extractors — ordered from most to least reliable ───────────────

function extractFromUrl(url: string): { lat: number; lng: number } | null {
  // @lat,lng,zoom  (most common share URL)
  const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };

  // !3dlat!4dlng  (place/embedded format)
  const d3 = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (d3) return { lat: parseFloat(d3[1]), lng: parseFloat(d3[2]) };

  // q=lat,lng
  const q = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };

  // ll=lat,lng
  const ll = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (ll) return { lat: parseFloat(ll[1]), lng: parseFloat(ll[2]) };

  // center=lat,lng  (static maps API in page)
  const center = url.match(/center=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (center) return { lat: parseFloat(center[1]), lng: parseFloat(center[2]) };

  return null;
}

function extractFromHtml(html: string): { lat: number; lng: number } | null {
  // og:image — Google Maps always embeds a static map URL with center=lat,lng
  // e.g.: https://maps.googleapis.com/maps/api/staticmap?center=18.361905,-66.103605&...
  const ogImage = html.match(/og:image[^>]*content="([^"]+)"/);
  if (ogImage) {
    const coords = extractFromUrl(ogImage[1]);
    if (coords) return coords;
  }

  // og:url or canonical — sometimes has @lat,lng
  const ogUrl = html.match(/og:url[^>]*content="([^"]+)"/);
  if (ogUrl) {
    const coords = extractFromUrl(ogUrl[1]);
    if (coords) return coords;
  }

  const canonical = html.match(/rel="canonical"[^>]*href="([^"]+)"/);
  if (canonical) {
    const coords = extractFromUrl(canonical[1]);
    if (coords) return coords;
  }

  // JSON-LD schema.org
  const jsonLd = html.match(/"latitude"\s*:\s*"?(-?\d+\.?\d*)"?[\s\S]{0,50}"longitude"\s*:\s*"?(-?\d+\.?\d*)"?/);
  if (jsonLd) return { lat: parseFloat(jsonLd[1]), lng: parseFloat(jsonLd[2]) };

  // Google Maps APP_INITIALIZATION_STATE — coordinates buried in JS state
  // Pattern: [null,null,18.3619,-66.1036] (lat then lng, 4+ decimal places)
  const allPairs = [...html.matchAll(/\[null,null,(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})\]/g)];
  if (allPairs.length > 0) {
    return { lat: parseFloat(allPairs[0][1]), lng: parseFloat(allPairs[0][2]) };
  }

  // Fallback: any staticmap URL in the page
  const staticMap = html.match(/maps\.googleapis\.com\/maps\/api\/staticmap\?([^"'\s]+)/);
  if (staticMap) {
    const coords = extractFromUrl(staticMap[0]);
    if (coords) return coords;
  }

  return null;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Browsers to try — Google responds differently per User-Agent
  const userAgents = [
    // Desktop Chrome — usually gets full redirect with @lat,lng in URL
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    // iPhone Safari — gets mobile page which has og:image with coords
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  ];

  let lastError = "";

  for (const ua of userAgents) {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": ua,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-PR,es;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(8000),
      });

      const finalUrl = response.url;

      // 1. Try extracting from the final redirected URL
      const fromUrl = extractFromUrl(finalUrl);
      if (fromUrl) {
        return NextResponse.json({ lat: fromUrl.lat, lng: fromUrl.lng, source: "url" });
      }

      // 2. Try extracting from the HTML content
      const html = await response.text();
      const fromHtml = extractFromHtml(html);
      if (fromHtml) {
        return NextResponse.json({ lat: fromHtml.lat, lng: fromHtml.lng, source: "html" });
      }

      lastError = `Could not find coords in URL (${finalUrl.slice(0, 80)}) or HTML`;
    } catch (err: any) {
      lastError = err?.message ?? "fetch failed";
    }
  }

  return NextResponse.json(
    { error: "No se encontraron coordenadas. Prueba copiando la URL completa de Google Maps.", debug: lastError },
    { status: 422 }
  );
}
