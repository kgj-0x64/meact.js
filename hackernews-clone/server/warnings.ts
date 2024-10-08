/**
 * Copied from
 * @remix-run/server-runtime v1.2.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */

const alreadyWarned: Record<string, boolean> = {};
function warnOnce(condition: boolean, message: string) {
  if (!condition && !alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}

export { warnOnce };
