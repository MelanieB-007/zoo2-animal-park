/**
 * Unit-Tests für den useSort-Hook
 *
 * Abgedeckt:
 *  1. Initialer State (sortBy, sortDirection, Standardwert)
 *  2. toggleSort mit neuem Key → setzt Key, setzt Richtung auf "asc"
 *  3. toggleSort mit gleichem Key → flippt Richtung (asc ↔ desc)
 *  4. getSortIcon gibt ↕ / ▲ / ▼ korrekt zurück
 */

import { renderHook, act } from "@testing-library/react";
import { useSort } from "../../hooks/useSort";

// ─── 1. Initialer State ───────────────────────────────────────────────────────

describe("1. useSort – initialer State", () => {
  it("verwendet den übergebenen initialKey als sortBy", () => {
    const { result } = renderHook(() => useSort("name"));
    expect(result.current.sortBy).toBe("name");
  });

  it("setzt die initiale Richtung auf 'asc'", () => {
    const { result } = renderHook(() => useSort("name"));
    expect(result.current.sortDirection).toBe("asc");
  });

  it("akzeptiert eine explizite initialDirection", () => {
    const { result } = renderHook(() => useSort("name", "desc"));
    expect(result.current.sortDirection).toBe("desc");
  });

  it("nutzt 'name' als Standard-initialKey wenn keiner angegeben wird", () => {
    const { result } = renderHook(() => useSort());
    expect(result.current.sortBy).toBe("name");
  });
});

// ─── 2. toggleSort mit neuem Key ──────────────────────────────────────────────

describe("2. toggleSort – neuer Key", () => {
  it("setzt sortBy auf den neuen Key", () => {
    const { result } = renderHook(() => useSort("name"));
    act(() => { result.current.toggleSort("stalllevel"); });
    expect(result.current.sortBy).toBe("stalllevel");
  });

  it("setzt sortDirection auf 'asc' wenn ein neuer Key gewählt wird", () => {
    const { result } = renderHook(() => useSort("name", "desc"));
    act(() => { result.current.toggleSort("stalllevel"); });
    expect(result.current.sortDirection).toBe("asc");
  });

  it("wechselt korrekt zwischen verschiedenen Keys", () => {
    const { result } = renderHook(() => useSort("name"));
    act(() => { result.current.toggleSort("gehege.name"); });
    expect(result.current.sortBy).toBe("gehege.name");
    act(() => { result.current.toggleSort("stalllevel"); });
    expect(result.current.sortBy).toBe("stalllevel");
  });
});

// ─── 3. toggleSort mit gleichem Key (Richtung flippen) ────────────────────────

describe("3. toggleSort – gleicher Key flippt Richtung", () => {
  it("wechselt von 'asc' zu 'desc' bei zweitem Klick auf denselben Key", () => {
    const { result } = renderHook(() => useSort("name"));
    act(() => { result.current.toggleSort("name"); });
    expect(result.current.sortDirection).toBe("desc");
  });

  it("wechselt von 'desc' zurück zu 'asc' bei drittem Klick", () => {
    const { result } = renderHook(() => useSort("name"));
    act(() => { result.current.toggleSort("name"); }); // → desc
    act(() => { result.current.toggleSort("name"); }); // → asc
    expect(result.current.sortDirection).toBe("asc");
  });

  it("ändert sortBy nicht wenn derselbe Key togglet wird", () => {
    const { result } = renderHook(() => useSort("name"));
    act(() => { result.current.toggleSort("name"); });
    expect(result.current.sortBy).toBe("name");
  });
});

// ─── 4. getSortIcon ───────────────────────────────────────────────────────────

describe("4. getSortIcon – Icons korrekt", () => {
  it("gibt '↕' zurück für einen inaktiven Key", () => {
    const { result } = renderHook(() => useSort("name"));
    expect(result.current.getSortIcon("stalllevel")).toBe("↕");
  });

  it("gibt '▲' zurück für den aktiven Key bei sortDirection 'asc'", () => {
    const { result } = renderHook(() => useSort("name", "asc"));
    expect(result.current.getSortIcon("name")).toBe("▲");
  });

  it("gibt '▼' zurück für den aktiven Key bei sortDirection 'desc'", () => {
    const { result } = renderHook(() => useSort("name", "desc"));
    expect(result.current.getSortIcon("name")).toBe("▼");
  });

  it("aktualisiert das Icon nach einem toggleSort", () => {
    const { result } = renderHook(() => useSort("name"));
    expect(result.current.getSortIcon("name")).toBe("▲"); // asc
    act(() => { result.current.toggleSort("name"); });
    expect(result.current.getSortIcon("name")).toBe("▼"); // desc
  });
});
