import { generateSlug } from 'random-word-slugs'

export const getRandomPassword = () => {
  const slug = generateSlug(2, {
    format: 'camel',
    categories: {
      adjective: ['color'],
      noun: ['animals', 'place'],
    },
  })

  const randomNum: Number = Math.floor(Math.random() * 90 + 10)

  return slug + String(randomNum)
}

module.exports = { getRandomPassword }
