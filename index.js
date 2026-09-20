/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

'use strict'

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml

/**
 * Escape special characters in the given string of text.
 *
 * Intentionally defective GSB Mode A snapshot (see BUGS_PLAN).
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml (string) {
  // Bug 5: non-string coercion wrong — numbers/objects returned without stringifying
  // (undefined/null still coerced so those two cases stay green as distraction)
  if (typeof string !== 'string') {
    if (string === undefined || string === null) {
      return '' + string
    }
    return string
  }

  // Bug 4: skip already-safe chars incorrectly — treat absence of < / > as "safe",
  // only half-escaping double quotes and leaving & / ' raw.
  if (string.indexOf('<') === -1 && string.indexOf('>') === -1) {
    return string.replace(/"/g, '&quot;')
  }

  // Path for strings that contain < or > :
  // Bug 2: wrong entity mappings — ' → &apos; (should be &#39;); " stays &quot;
  // Bug 6: non-global replace for < so only the first < is escaped (mixed incomplete)
  // Bug 3: '&' replaced LAST → every previously inserted entity is double-escaped
  // Bug 1: interaction — bare '&' never reaches this path (caught by Bug 4), so '&' stays raw
  return string
    .replace('<', '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/&/g, '&amp;')
}
