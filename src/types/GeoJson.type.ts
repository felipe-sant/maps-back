type PolygonGeometry = {
    type: "Polygon"
    coordinates: number[][][]
}

type MultiPolygonGeometry = {
    type: "MultiPolygon"
    coordinates: number[][][][]
}

type Feature = {
    type: string
    geometry: PolygonGeometry | MultiPolygonGeometry
    properties: {
        codarea: string
    }
}

type GeoJson = {
    type: string
    features: Feature[]
}

export { Feature }
export default GeoJson