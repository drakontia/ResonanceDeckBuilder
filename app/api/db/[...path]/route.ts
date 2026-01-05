'use client'

import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { usePathname, useRouter } from "next/navigation"

export async function GET(request: NextRequest, { params }) {
  try {
    const pathname = usePathname()
    // 요청된 경로 가져오기
    const filePath = pathname.replace("/api/db/", "")
    console.log("Requested path:", filePath)

    // 기본 디렉터리 설정 및 경로 조합
    const baseDir = path.join(process.cwd(), "public", "db")
    const fullPath = baseDir + "/" + filePath

    // 경로 도약(Directory Traversal) 방지
    const normalizedPath = path.normalize(fullPath)
    const relativePath = path.relative(baseDir, normalizedPath)
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return new NextResponse(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // 파일 존재 여부 확인
    if (!fs.existsSync(fullPath)) {
      return new NextResponse(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // 파일 읽기
    const fileContent = fs.readFileSync(fullPath, "utf8")

    // JSON 파싱 시도
    try {
      const jsonData = JSON.parse(fileContent)
      return NextResponse.json(jsonData)
    } catch (e) {
      // JSON이 아닌 경우 텍스트로 반환
      return new NextResponse(fileContent, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }
  } catch (error) {
    console.error("Error reading file:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

