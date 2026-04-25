const SPREADSHEET_ID = "1bAxQcxL2O6uK0LiGgp67oocyhEXDxYrYCjQg1_ZD2Jg";
const RANGE = "A2:F"; // Row 1 is headers; A=Date, B=Film, C=Series, D=Year, E=Location, F=Partners
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

export interface ArchivedScreening {
  date: string;
  film: string;
  series: string;
  year: string;
  location: string;
  partners: string;
}

function toBase64url(input: string | ArrayBuffer): string {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function buildJWT(clientEmail: string, privateKeyPem: string): Promise<string> {
  const header = toBase64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${payload}`;

  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${toBase64url(sig)}`;
}

async function fetchAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const jwt = await buildJWT(clientEmail, privateKeyPem);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      `OAuth error: ${data.error_description ?? data.error ?? "unknown"}`,
    );
  }

  return data.access_token;
}

export async function fetchArchivedScreenings(): Promise<ArchivedScreening[]> {
  const privateKey = (import.meta.env.PRIVATE_KEY as string).replace(
    /\\n/g,
    "\n",
  );
  const clientEmail = import.meta.env.CLIENT_EMAIL as string;

  const token = await fetchAccessToken(clientEmail, privateKey);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values ?? [];

  return rows.map((row) => ({
    date: row[0] ?? "",
    film: row[1] ?? "",
    series: row[2] ?? "",
    year: row[3] ?? "",
    location: row[4] ?? "",
    partners: row[5] ?? "",
  }));
}
