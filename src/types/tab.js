// @flow

import uuidv4 from "uuid/v4";

// ID is generated during creation, not passed into the factory,
// so it has to be marked here as optional.

export type Tab = {
  id?: string,
  url: string,
  title?: string,
  subtitle?: string,
  iconUrl?: string,
};

export function createTabObject(
  url: string,
  title?: string,
  subtitle?: string,
  iconUrl?: string
) {
  return {
    id: uuidv4(),
    url,
    title,
    subtitle,
    iconUrl,
  };
}
