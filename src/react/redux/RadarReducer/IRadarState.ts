export default interface IRadarState {
  radars: [],
  currentRadar: object | null,
  sourceRadar: object | null,
  radarTemplates: [],
  selectedRadarItem: object | null,
  selectedRadarItemChanged: boolean
}