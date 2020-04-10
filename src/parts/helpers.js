const hashToKey = text => {
  return text.toLowerCase().replace(/ /g, '_').replace(/[ą|ć|ę|ń|ł|ż|ó]/g, '').replace(/[^a-z0-9_]+/g, '').substring(0, 25)
}