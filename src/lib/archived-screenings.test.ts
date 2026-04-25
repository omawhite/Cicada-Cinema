import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
const mockImportKey = vi.fn().mockResolvedValue({} as CryptoKey);
const mockSign = vi.fn().mockResolvedValue(new ArrayBuffer(3));

vi.stubGlobal("fetch", mockFetch);
vi.stubGlobal("crypto", {
  subtle: { importKey: mockImportKey, sign: mockSign },
});

vi.stubEnv(
  "PRIVATE_KEY",
  "-----BEGIN PRIVATE KEY-----\\nFAKEKEY\\n-----END PRIVATE KEY-----\\n",
);
vi.stubEnv("CLIENT_EMAIL", "test@project.iam.gserviceaccount.com");

import { fetchArchivedScreenings } from "./archived-screenings";

function mockTokenFetch() {
  return { ok: true, json: () => Promise.resolve({ access_token: "test-token" }) };
}

function mockSheetsFetch(values: string[][]) {
  return { ok: true, json: () => Promise.resolve({ values }) };
}

describe("fetchArchivedScreenings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps rows to ArchivedScreening objects", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenFetch())
      .mockResolvedValueOnce(
        mockSheetsFetch([
          [
            "2024-11-12",
            "La Jetée",
            "French New Wave",
            "1962",
            "Main Hall",
            "Alliance Française",
          ],
          ["2024-10-05", "Stalker", "Soviet Cinema", "1979", "Annex", ""],
        ]),
      );

    const result = await fetchArchivedScreenings();

    expect(result).toEqual([
      {
        date: "2024-11-12",
        film: "La Jetée",
        series: "French New Wave",
        year: "1962",
        location: "Main Hall",
        partners: "Alliance Française",
      },
      {
        date: "2024-10-05",
        film: "Stalker",
        series: "Soviet Cinema",
        year: "1979",
        location: "Annex",
        partners: "",
      },
    ]);
  });

  it("returns empty array when sheet has no data rows", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenFetch())
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ values: undefined }),
      });

    const result = await fetchArchivedScreenings();
    expect(result).toEqual([]);
  });

  it("fills missing trailing cells with empty strings", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenFetch())
      .mockResolvedValueOnce(mockSheetsFetch([["2024-01-01", "Film Title"]]));

    const result = await fetchArchivedScreenings();
    expect(result[0]).toEqual({
      date: "2024-01-01",
      film: "Film Title",
      series: "",
      year: "",
      location: "",
      partners: "",
    });
  });

  it("throws when OAuth token request fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "invalid_grant",
          error_description: "Token has been expired",
        }),
    });

    await expect(fetchArchivedScreenings()).rejects.toThrow(
      "Token has been expired",
    );
  });

  it("throws when Sheets API request fails", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenFetch())
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: () => Promise.resolve("Permission denied"),
      });

    await expect(fetchArchivedScreenings()).rejects.toThrow(
      "Sheets API error 403",
    );
  });

  it("passes private key bytes to crypto.subtle.importKey", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenFetch())
      .mockResolvedValueOnce(mockSheetsFetch([]));

    await fetchArchivedScreenings();

    expect(mockImportKey).toHaveBeenCalledWith(
      "pkcs8",
      expect.any(Uint8Array),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
  });
});
