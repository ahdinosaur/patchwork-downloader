const xhr = require('xhr')

patchworkDownloader()

function patchworkDownloader () {
  const platformEl = document.querySelector('.main .platform')
  const versionEl = document.querySelector('.main .version')
  const latestEl = document.querySelector('.main .latest')
  const downloadEl = document.querySelector('.main .download')

  const platform = getPlatform(navigator.platform)
  console.log('platform', platform)

  platformEl.textContent = platform

  getLatestRelease(function (err, release) {
    if (err) throw err

    console.log('release', release)

    versionEl.textContent = release.version
    latestEl.href = release.url
    downloadEl.href = release.assets[platform]
  })
}

function getPlatform (platform) {
  if (platform.substring(0, 3).toUpperCase() === 'MAC')
    return 'mac'
  if (platform.substring(0, 3).toUpperCase() === 'WIN')
    return 'windows'
  if (platform.substring(0, 5).toUpperCase() === 'LINUX')
    return 'linux'
  return null
}


function getLatestRelease (options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  const {
    base = 'https://api.github.com/repos/',
    target = '/releases/latest',
    owner = 'ssbc',
    repo = 'patchwork'
  } = options

  xhr({
    url: `${base}${owner}/${repo}${target}`,
    responseType: 'json'
  }, function (err, res, body) {
    if (err) return cb(err)

    const {
      tag_name: version,
      html_url: url
    } = body

    const assets = findAssetUrls(body.assets)

    cb(null, {
      version,
      url,
      assets
    })
  })
}

const executablesByPlatform = {
  mac: [
    'dmg'
  ],
  windows: [
    'exe'
  ],
  linux: [
    'AppImage'
  ]
}

function findAssetUrls (assets) {
  var urls = {}
  assets.forEach(asset => {
    const url = asset.browser_download_url
    var extension = url.split('.')
    extension = extension[extension.length - 1]
    for (var platform in executablesByPlatform) {
      if (~executablesByPlatform[platform].indexOf(extension)) {
        urls[platform] = url
        return
      }
    }
  })
  return urls
}
