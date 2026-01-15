"use client"

import { useCallback, useState } from "react"

interface UseCardSettingsParams {
  cardId: string
  initialUseType: number
  initialUseParam: number
  initialUseParamMap?: Record<string, number>
  onSave: (cardId: string, useType: number, useParam: number, useParamMap?: Record<string, number>) => void
}

export function useCardSettings({
  cardId,
  initialUseType,
  initialUseParam,
  initialUseParamMap = {},
  onSave,
}: UseCardSettingsParams) {
  const [useType, setUseType] = useState(initialUseType)
  const [useParam, setUseParam] = useState(initialUseParam)
  const [useParamMap, setUseParamMap] = useState<Record<string, number>>(initialUseParamMap)

  const handleParamChange = useCallback(
    (optionIndex: number, value: number, minNum: number, maxNum: number) => {
      let adjustedValue = value
      if (value < minNum) adjustedValue = minNum
      if (value > maxNum) adjustedValue = maxNum

      const newParamMap = {
        ...useParamMap,
        [optionIndex.toString()]: adjustedValue,
      }

      setUseParamMap(newParamMap)
      setUseType(optionIndex)
      setUseParam(adjustedValue)
      onSave(cardId, optionIndex, adjustedValue, newParamMap)
    },
    [cardId, onSave, useParamMap],
  )

  const handleOptionSelect = useCallback(
    (newUseType: number, paramValue = -1) => {
      setUseType(newUseType)
      setUseParam(paramValue)
      onSave(cardId, newUseType, paramValue, useParamMap)
    },
    [cardId, onSave, useParamMap],
  )

  return {
    useType,
    useParam,
    useParamMap,
    handleParamChange,
    handleOptionSelect,
  }
}
