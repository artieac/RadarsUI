export default interface IRadarState {
  radars: [],
  currentRadar: object | null,
  sourceRadar: object | null,
  radarTemplates: [],
  selectedRadarItem: object | null,
  selectedRadarItemChanged: boolean,
  /** Full DiagramPresentation returned by the API. Separate from currentRadar (simple selection). */
  currentDiagram: object | null
}