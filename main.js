const fs = require('fs')
const path = require('path')

const secret = 'Putting in a super basic encryption pass so our saves are a little harder to edit than just opening a text or' +
  ' hex editor.  Need a secret key or some such... so here\'s some nonsense.\n'
const version = 'version: 0\n'

const args = process.argv.slice(2)

/**
 * @param {string} plaintext
 * @param {boolean} enc
 */
function encrypt(plaintext, enc = true) {
  let res = ''

  let i = 0
  for (const c of Buffer.from(plaintext)) {
    res += String.fromCharCode(secret.charCodeAt(i) ^ c)
    i++
    if (i >= secret.length - 1) i = 0
  }
  return enc ? version + res : res
}

/**
 * @param {string} plaintext
 */
function decrypt(plaintext) {
  return encrypt(plaintext, false)
}

const main = () => {
  if (args.length < 2) {
    console.log('Not enough arguments.\nUsage example: node ./main.js encrypt SlotD')
    return
  }

  // Windows only bcs im lazy
  const basePath = path.join(process.env.APPDATA, '../LocalLow', 'Dodge Roll', 'Enter the Gungeon')
  const slot = args[1]

  if (!fs.existsSync(`${basePath}\\${slot}.save`)) {
    console.log(`${slot}.save doesn't exist.`)
    return
  }

  switch (args[0]) {
    case 'decrypt': {
      const fileToDec = fs.readFileSync(`${basePath}\\${slot}.save`, 'utf8')
      const decrypted = decrypt(fileToDec.substring(11))
      fs.writeFileSync(`${basePath}\\${slot}.json`, decrypted)
      console.log(`${slot}.save decrypted.`)
      break
    }
    case 'encrypt': {
      const fileToEnc = fs.readFileSync(`${basePath}\\${slot}.json`, 'utf8')
      const encrypted = encrypt(fileToEnc)
      fs.writeFileSync(`${basePath}\\${slot}.save`, encrypted)
      console.log(`${slot}.save encrypted.`)
      break
    }
    default: {
      console.log('Invalid argument. Use encrypt or decrypt.\nUsage example: node ./main.js encrypt SlotD')
    }
  }


}

main()
