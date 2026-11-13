export const API_CONFIG = {
  namespace: 'u_bc75445a318997106583',
  title: 'Motor Cycle Parts 3',
  description: 'Category, title, part number, description, price',
  endpoints: {
    main: {
      title: 'Main',
      description: 'Main access point of this API.',
      url:  "https://songer.datasn.com/data/api/v1/u_bc75445a318997106583/motor_cycle_parts_3/main/list/"
    },
    byTable: {
      title: 'By Table',
      description: 'Each API function returns data by a specific database table.',
      url:  "https://songer.datasn.com/data/api/v1/u_bc75445a318997106583/motor_cycle_parts_3/by_table/category_2/",
    },
  },
}

const PART_IMAGE_FALLBACKS = {
  Brakes: '/parts/brakes.svg',
  Engine: '/parts/engine.svg',
  Drive: '/parts/drive.svg',
  Electrical: '/parts/electrical.svg',
  Filters: '/parts/filters.svg',
}

export const getApiUrl = (endpoint = 'main') => {
  const selectedEndpoint = API_CONFIG.endpoints[endpoint] ?? API_CONFIG.endpoints.main
  return selectedEndpoint.url
}

export const getPartImage = (part) => {
  const imageUrl =
    part.imageUrl ??
    part.image_url ??
    part.image ??
    part.photoUrl ??
    part.photo_url ??
    part.thumbnail

  return typeof imageUrl === 'string' && imageUrl.trim()
    ? imageUrl
    : getPartImageFallback(part.category)
}

export const getPartImageFallback = (category) =>
  PART_IMAGE_FALLBACKS[category] ?? '/parts/engine.svg'

export default API_CONFIG
