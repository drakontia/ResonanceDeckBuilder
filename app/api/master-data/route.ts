import { NextResponse } from "next/server"
import { buildDatabase } from "@/lib/masterData"

export const dynamic = "force-static"

export function GET() {
  const database = buildDatabase()
  return NextResponse.json(database)
}
