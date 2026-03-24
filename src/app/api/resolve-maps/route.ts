import { NextRequest, NextResponse } from "next/server";

// Extracts lat/lng from a Google Maps URL (any format)
function extractCoords(url: string): { lat: number; lng: number } | null {
  // @lat,lng,zoom
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // !3dlat!4dlng (embedded/place format)
  const d3Match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (d3Match) return { lat: parseFloat(d3Match[1]), lng: parseFloat(d3Match[2]) };

  // q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  // ll=lat,lng
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

  // center=lat,lng
  const centerMatch = url.match(/[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (centerMatch) return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) };

  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Follow redirects server-side — works for maps.app.goo.gl and other short links
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml",
      },
      // 5 second timeout
      signal: AbortSignal.timeout(5000),
    });

    const finalUrl = response.url;

    // Try to extract from the final URL first
    const fromUrl = extractCoords(finalUrl);
    if (fromUrl) {
      return NextResponse.json({ lat: fromUrl.lat, lng: fromUrl.lng, source: "url" });
    }

    // If not in URL, check the page HTML for embedded coordinates
    const html = await response.text();

    // Google Maps embeds coordinates in the page as JSON-LD or meta tags
    const jsonLdMatch = html.match(/"latitude"\s*:\s*(-?\d+\.\d+).*?"longitude"\s*:\s*(-?\d+\.\d+)/s);
    if (jsonLdMatch) {
      return NextResponse.json({
        lat: parseFloat(jsonLdMatch[1]),
        lng: parseFloat(jsonLdMatch[2]),
        source: "html",
      });
    }

    // Try canonical URL embedded in page
    const canonicalMatch = html.match(/canonical.*?href="([^"]+maps[^"]+)"/);
    if (canonicalMatch) {
      const fromCanonical = extractCoords(canonicalMatch[1]);
      if (fromCanonical) {
        return NextResponse.json({ ...fromCanonical, source: "canonical" });
      }
    }

    return NextResponse.json(
      { error: "No se encontraron coordenadas en este enlace", finalUrl },
      { status: 422 }
    );
  } catch (err: any) {
    const isTimeout = err?.name === "TimeoutError" || err?.message?.includes("timeout");
    return NextResponse.json(
      { error: isTimeout ? "El enlace tardó demasiado en responder" : "No se pudo resolver el enlace" },
      { status: 500 }
    );
  }
}
