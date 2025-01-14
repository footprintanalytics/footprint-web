export const getPublicCardUrl = (query) => {
  const url = `/api/v1/public/dashboard/${query.uuid}/dashcard/${query.dashcardId}/card/${query.cardId}?parameters=${query.parameters}&ignore_cache=${query.ignore_cache}`
  return url
}
