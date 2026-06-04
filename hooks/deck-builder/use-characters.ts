"use client"

import { useState, useCallback, useMemo } from "react"
import type { Database } from "../../types"
import { getCharacterById } from "./utils"

export function useCharacters(data: Database | null) {
  // 캐릭터 선택 (5 슬롯, -1은 빈 슬롯)
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([-1, -1, -1, -1, -1])

  // 리더 캐릭터
  const [explicitLeaderCharacter, setLeaderCharacter] = useState<number>(-1)

  // 캐릭터 ID로 캐릭터 정보 가져오기
  const getCharacter = useCallback(
    (id: number) => {
      return getCharacterById(data, id)
    },
    [data],
  )

  // 리더 설정 - 개선된 버전
  const setLeader = useCallback(
    (characterId: number, forceSet = false) => {
      // forceSet이 true이면 검증 없이 리더 설정
      // 또는 유효한 캐릭터인지 확인 (현재 선택된 캐릭터 목록에 있는지)
      if (forceSet || selectedCharacters.includes(characterId)) {
        setLeaderCharacter(characterId)
      }
    },
    [selectedCharacters],
  )

  const leaderCharacter = useMemo(() => {
    if (explicitLeaderCharacter !== -1 && selectedCharacters.includes(explicitLeaderCharacter)) {
      return explicitLeaderCharacter
    }

    const validCharacters = selectedCharacters.filter((id) => id !== -1)
    return validCharacters.length > 0 ? validCharacters[0] : -1
  }, [selectedCharacters, explicitLeaderCharacter])

  return {
    selectedCharacters,
    setSelectedCharacters,
    leaderCharacter,
    setLeaderCharacter,
    getCharacter,
    setLeader,
  }
}
