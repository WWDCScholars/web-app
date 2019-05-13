import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('pronoun',
  (gender: string) => gender === 'male' ? 'him' : gender === 'female' ? 'her' : 'them')

Vue.filter('possessivePronoun',
  (gender: string) => gender === 'male' ? 'his' : gender === 'female' ? 'her' : 'their')

Vue.filter('isAre',
  (count: number) => count === 0 || count > 1 ? 'are' : 'is')

Vue.filter('readableNumber', (count: number) => {
  switch (count) {
    case 0: return 'zero'
    case 1: return 'one'
    case 2: return 'two'
    case 3: return 'three'
    case 4: return 'four'
    case 5: return 'five'
    case 6: return 'six'
    case 7: return 'seven'
    case 8: return 'eight'
    case 9: return 'nine'
    case 10: return 'ten'
    case 11: return 'eleven'
    case 12: return 'twelve'
    default: return count.toString()
  }
})

Vue.filter('quantize', (word: string, count: number) => {
  if (count === 0 || count > 1) {
    return word + 's'
  }
  return word
})

Vue.filter('yearDifference', (date?: number): number => {
  if (!date) return 0

  const dateObject = dayjs(date)
  return dayjs().diff(dateObject, 'year')
})
