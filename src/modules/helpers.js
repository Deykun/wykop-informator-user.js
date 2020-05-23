const removeDiacritics = text => text.replace(/\u0141/g, 'L').replace(/\u0142/g, 'l').normalize('NFD').replace(/[^\w\s]/g, '')

const hashToKey = text => removeDiacritics( text.toLowerCase() ).replace(/ /g, '_').replace(/[^a-z0-9_]+/g, '').substring(0, 25)