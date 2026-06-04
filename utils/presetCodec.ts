import pako from "pako"

// base64 → JSON
export function decodePreset<T>(base64: string): T | null {
  try {
    // URL에서 가져온 base64 문자열 정리
    const cleaned = fixBase64FromUrl(base64)
    const compressed = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0))
    const jsonStr = new TextDecoder().decode(pako.inflateRaw(compressed))
    const result = JSON.parse(jsonStr)
    if (process.env.NODE_ENV === 'development') {
      console.log("Decoding preset:", result)
    }
    return result as T
  } catch {
    return null
  }
}

// JSON → base64
export function encodePreset<T>(json: T): string {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("Encoding preset:", json)
    }
    const jsonStr = JSON.stringify(json)
    const deflated = pako.deflateRaw(new TextEncoder().encode(jsonStr))
    const base64 = btoa(String.fromCharCode(...deflated))
    return base64
  } catch {
    return ""
  }
}

// URL에서 가져온 base64 문자열 수정 함수
export function fixBase64FromUrl(str: string): string {
  // 1. 공백을 +로 변환
  const withPlus = str.replace(/ /g, "+")

  // 2. base64 패딩 추가 (=)
  return padBase64(withPlus)
}

// base64 문자열에 필요한 패딩(=) 추가
export function padBase64(str: string): string {
  // base64는 4의 배수 길이여야 함
  const padLen = (4 - (str.length % 4)) % 4
  return str + "=".repeat(padLen)
}

// base64 문자열을 URL 안전하게 인코딩
export function encodePresetForUrl<T>(json: T): string {
  const base64 = encodePreset(json)
  return encodeURIComponent(base64)
}

// URL에서 코드 파라미터 추출 및 디코딩
export function decodePresetFromUrlParam<T>(urlParam: string | null): T | null {
  if (!urlParam) return null

  try {
    // URL 디코딩 후 base64 수정 및 디코딩
    const decoded = decodeURIComponent(urlParam)
    return decodePreset<T>(decoded)
  } catch (error) {
    console.error("Error decoding URL param:", error)
    return null
  }
}
