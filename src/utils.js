import {execSync} from 'child_process'
import util from 'util'

import debug from './debug'

export function clearConsole() {
  // This will completely wipe your scrollback in cmd.exe on Windows - recommend
  // using the start command to launch nwb's dev server in a new prompt.
  process.stdout.write('\x1bc')
}

/**
 * Create a banner comment for a UMD build file from package.json config.
 */
export function createBanner(pkg) {
  let banner = `${pkg.name} ${pkg.version}`
  if (pkg.homepage) {
    banner += ` - ${pkg.homepage}`
  }
  if (pkg.license) {
    banner += `\n${pkg.license} Licensed`
  }
  return banner
}

/**
 * Create Webpack externals config from a module → global variable mapping.
 */
export function createWebpackExternals(externals = {}) {
  return Object.keys(externals).reduce((webpackExternals, packageName) => {
    let globalName = externals[packageName]
    webpackExternals[packageName] = {
      root: globalName,
      commonjs2: packageName,
      commonjs: packageName,
      amd: packageName,
    }
    return webpackExternals
  }, {})
}

/**
 * Log objects in their entirety so we can see everything in debug output.
 */
export function deepToString(object) {
  return util.inspect(object, {colors: true, depth: null})
}

/**
 * String.prototype.endsWith() is behind the --harmony flag in Node.js v0.12.
 */
export function endsWith(s1, s2) {
  return s1.lastIndexOf(s2) === s1.length - s2.length
}

/**
 * Install react for the user when it's needed.
 */
export function installReact({dev = false, save = false, cwd = process.cwd(), version = 'latest'} = {}) {
  let command = `npm install${save ? ` --save${dev ? '-dev' : ''}` : ''} react@${version} react-dom@${version}`
  debug(`${cwd} $ ${command}`)
  execSync(command, {cwd, stdio: [0, 1, 2]})
}

/**
 * Better typeof.
 */
export function typeOf(o) {
  if (Number.isNaN(o)) return 'nan'
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
}
