const helpers = require('rewire')('./helpers.js')

const removeDiacritics = helpers.__get__('removeDiacritics')
const hashToKey = helpers.__get__('hashToKey')

describe('removeDiacritics()', () => {
  it('should sanitize ąćęńóśźż', () => {
    expect(removeDiacritics('ąćęńóśźż')).toEqual('acenoszz')
    expect(removeDiacritics('ĄĆĘŃÓŚŹŻ')).toEqual('ACENOSZZ')
  })

  it('should sanitize ł', () => {
    expect(removeDiacritics('ł')).toEqual('l')
    expect(removeDiacritics('Ł')).toEqual('L')
  })
})

describe('hashToKey()', () => {
  it('should hash text', () => {
    expect(hashToKey('')).toEqual('')
    expect(hashToKey('Nieprawidłowe tagi')).toEqual('nieprawidlowe_tagi')
  })

  it('should trim longer text', () => {
    expect(hashToKey('This string is very very long')).toEqual('this_string_is_very_very_')
  })
})