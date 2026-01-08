// Character Types
export interface Character {
  id: number
  name: string
  quality: string
  sideId?: number
  passiveSkillList?: Array<{ skillId: number }>
  skillList: Array<{ num: number; skillId: number }>
  tk_SN: number | null
  hp_SN?: number
  def_SN?: number
  atk_SN?: number
  atkSpeed_SN?: number
  luck_SN?: number
  talentList?: Array<{ talentId: number }>
  breakthroughList?: Array<{ breakthroughId: number }>
  line?: number
  subLine?: number
  identity?: string
  ability?: string
  controllerId?: number
  img_card?: string
  desc?: string
  rarity?: string
  equipmentSlotList?: Array<{ tagID: number; }>
  homeSkillList?: Array<{ id: number; resonanceLv: number; nextIndex?: number }>
}

// Card Types
export interface Card {
  id: number
  name: string
  color?: string
  cardType?: string
  ownerId?: number
  idCN?: string // Added for checking neutral cards
  cost_SN?: number
  tagList?: Array<{ tagId: number }> // Added for status effects
  ExCondList?: Array<{
    condId?: number
    des?: number
    interValNum?: number
    isNumCond?: boolean
    minNum?: number
    numDuration?: number
    typeEnum?: string
  }>
  ExActList?: Array<{
    actId?: number
    des?: number
    typeEnum?: string
  }>
}

// Skill Types
export interface DesParam {
  isPercent?: boolean
  param: string
}

export interface SkillParam {
  skillRateA_SN?: number
  skillRateB_SN?: number
  skillRateC_SN?: number
  skillRateD_SN?: number
  skillRateE_SN?: number
  skillRateF_SN?: number
  skillRateG_SN?: number
  skillRateH_SN?: number
  skillRateI_SN?: number
  skillRateJ_SN?: number
  skillRateL_SN?: number
  skillRateT_SN?: number
}

export interface Skill {
  id: number
  name: string
  mod: string
  description: string
  detailDescription: string
  ExSkillList: Array<{
    ExSkillName: number
    isNeturality?: boolean
  }>
  cardID?: number | null
  leaderCardConditionDesc?: string
  desParamList?: DesParam[]
  skillParamList?: SkillParam[]
}

export interface SkillMap {
  skills: number[]
  relatedSkills: number[]
  notFromCharacters: number[]
}

// Breakthrough Types
export interface Attribute {
  attributeType: string,
  numType: string,
  num_SN: number
}

export interface Breakthrough {
  id: number
  name: string
  desc: string
  attributeList: Attribute[]
}

// Talent Types
export interface Talent {
  id: number
  name: string
  desc: string
  awakeLv: number
  skillParamOffsetList?: Array<{
    skillId: number
    tag: string
    value_SN: number
  }> | null
}

// HomeSkill Types
export interface HomeSkill {
  id: number
  name: string
  desc: string
  param?: number
  homeSkillType: string
}

// Image Database Type
export interface ImageDatabase {
  [key: string]: string
}

// Language Types
export interface LanguageStrings {
  [key: string]: string | null
}

export interface Languages {
  [langCode: string]: LanguageStrings
}

// Preset Types
export interface Preset {
  roleList: number[]
  header: number
  cardList: PresetCard[]
  isLeaderCardOn: boolean
  isSpCardOn: boolean
  keepCardNum: number
  discardType: number
  otherCard: number
}

// Update the PresetCard interface to make skillIndex optional
export interface PresetCard {
  id: string
  ownerId?: number
  skillId?: number
  skillIndex?: number // Now optional
  targetType?: number
  useType: number
  useParam: number
  useParamMap?: Record<string, number>
  equipIdList?: string[]
}

// Equipment Types
export interface Getway {
  DisplayName: string
  FromLevel?: number
  UIName?: string
  Way3?: string
  funcId?: number
}

export interface Equipment {
  id: number
  name: string
  des: string
  equipTagId: number
  quality: string
  type?: string // weapon, armor, accessory
  url?: string
  skillList?: Array<{ skillId: number }>
  Getway?: Getway[] // 획득 방법 배열 추가
}

// Equipment Type Mapping
export interface EquipmentTypeMapping {
  [equipTagId: string]: string
}

// Database Types
export interface Database {
  characters: Record<string, Character>
  cards: Record<string, Card>
  skills: Record<string, Skill>
  breakthroughs: Record<string, Breakthrough>
  talents: Record<string, Talent>
  images: ImageDatabase
  languages: Languages
  equipments?: Record<string, Equipment>
  equipmentTypes?: EquipmentTypeMapping
  homeSkills?: Record<string, HomeSkill>
  charSkillMap?: Record<
    string, SkillMap
  >
  itemSkillMap?: Record<
    string,
    {
      relatedSkills: number[]
    }
  >
}

export interface CardExtraInfo {
  name: string
  desc: string
  cost: number
  amount: number
  img_url?: string
  specialCtrl?: string[]
}

export interface SpecialControl {
  text: string
  icon?: string
  minimum?: string
  maximum?: string
}

export interface Tag {
  id: number
  idCN: string
  tagName?: string
  mod: string
  detail?: string
}

export interface TagColorMapping {
  [color: string]: number[]
}
